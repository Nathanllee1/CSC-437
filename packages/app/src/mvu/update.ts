
import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Tracker } from "server/models";


export default function update(
    message: Msg,
    apply: Update.ApplyMap<Model>,
    user: Auth.User
) {

    console.log("GETIING UPDATE")

    switch (message[0]) {

        case "update-tracker":

            console.log("Updating tracker")
            const tracker = message[1].tracker;

            fetch(`/api/trackers/${tracker._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...Auth.headers(user),
                },
                body: JSON.stringify(tracker),
            })
                .then(response => {
                    if (!response.ok) {
                        throw "Could not update tracker"
                    }
                    return response.json();
                })
                .then(() => {
                    message[1].onSuccess()
                })
                .catch(error => {
                    message[1].onFailure(error)
                });

            break;

        case "get-user":
            console.log("GETTING USER")
            fetch(`/api/trackers/alltrackers/${user.username}`, {
                headers: Auth.headers(user)
            })
                .then(response => {
                    if (!response.ok) {
                        throw "Could not get user"
                    }
                    return response.json();
                })
                .then(trackers => {
                    apply((model) => {
                        return {
                            profile: model.profile,
                            trackers
                        }
                    })
                })
                .catch(error => {
                    console.error(error);
                });
            break;

        case "new-tracker":
            console.log("NEW TRACKER", message[1])

            const newTracker = message[1].tracker;
            newTracker.userId = user.username;


            fetch('/api/trackers/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...Auth.headers(user),
                },
                body: JSON.stringify(message[1].tracker),
            })
                .then(response => {
                    if (!response.ok) {
                        throw "Could not save tracker"
                    }
                    return response.json();
                })
                .then(() => {
                    apply((model) => {
                        return {
                            profile: model.profile,
                            trackers: [...(model.trackers ? model.trackers : []), message[1].tracker]
                        }
                    })
                    message[1].onSuccess()
                })
                .catch(error => {
                    console.error(error);
                });

            break;

        case "remove-tracker":
            
            fetch(`/api/trackers/${message[1].id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...Auth.headers(user),
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw "Could not delete tracker"
                    }
                })
                .then(() => {
                    apply((model) => {
                        return {
                            profile: model.profile,
                            trackers: model.trackers?.filter((tracker) => {
                                return tracker._id !== message[1].id
                            })
                        }
                    })
                })
                .catch(error => {
                    console.error(error);
                });
                
            break;


        default:
            throw "Unknown message type"

    }
}

async function saveTracker(tracker: Tracker, user: Auth.User) {

    const response = await fetch("/api/trackers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...Auth.headers(user),
        },
        body: JSON.stringify(tracker),
    })

    if (!response.ok) {
        throw "Could not save tracker"
    }

}