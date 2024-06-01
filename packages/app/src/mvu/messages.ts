import { Tracker } from "server/models";

export type Msg =
    | ["add-tracker", Tracker]
    | ["remove-tracker", { id: string }]
    | ["update-tracker", { 
        tracker: Tracker, 
        onSuccess: () => void, 
        onFailure: (error: Error) => void }]
    | ["get-user"]
