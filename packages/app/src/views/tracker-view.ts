import { Auth, History, Observer, View } from "@calpoly/mustang";
import { css, html } from "lit";
import { property } from "lit/decorators.js";
import { Tracker } from "server/models";
import { Msg } from "../mvu/messages";
import { Model } from "../mvu/model";
import { flattenedRegion } from "../regions";

export class ProfileView extends View<Model, Msg> {

    @property({ attribute: "username", reflect: true })
    username: string = "";

    @property()
    get trackers(): Tracker[] | undefined {
        return this.model.trackers;
    }

    constructor() {
        super("blazing:model");
    }

    connectedCallback() {
        super.connectedCallback();

        this.dispatchMessage(["get-user"]);

    }

    static styles = css`
        @keyframes bounceIn {
            0% {
                transform: scale(1);
                opacity: 0;
            }
            60% {
                transform: scale(1.02);
                opacity: 1;
            }
            100% {
                transform: scale(1);
            }
        }
        .card {
            background-color: var(--color-background-card);
            padding: 10px;
            margin: 10px;
            border-radius: 5px;
            box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
            width: 250px;
            animation: bounceIn 0.2s ease-out;

        }

        .card_container {
            display: flex;
            flex-wrap: wrap;
        }

        .toolbar {
            display: flex;
            justify-content: end;
            font-size: 0.8em;

        }

        button {
            background-color: transparent;
            border: none;
            cursor: pointer;
        }

        .card#new_tracker {
            background-color: var(--color-primary);
            color: white;
            text-align: center;
            cursor: pointer;
        }

        .card#new_tracker:hover {
            /* Make the card a little darker when hovered */
            background-color: #425c4a
        }

        .plus {
            font-size: 2em;
        }
    `

    _deleteTracker(trackerId: string) {

        console.log("Deleting tracker", trackerId)
        this.dispatchMessage(["remove-tracker", { id: trackerId }]);
    }


    render() {
        return html`
            <h2>Your Trackers</h2>
            <div class="card_container">${this.trackers?.map((tracker) => {
            // Renders out cards of a list of trackers
            return (
                html`
                    <div class="card">
                        <div class="toolbar">
                            <a href="/app/tracker/edit/${tracker._id}">✏️</a>
                            <button @click=${() => this._deleteTracker(tracker._id)}>🗑️</button>
                        </div>
                        <h2>${flattenedRegion[tracker.trailheadId]}</h2>
                        
                        <p>📞 ${tracker.phoneNumber}</p>
                        <p>👥 ${tracker.partySize}</p>
                        <p>📅 ${tracker.dates}</p>
                    </div>`
            )

        })

            }
            <div class="card" id="new_tracker" @click=${() => History.dispatch(this, "history/navigate", { href: `/app/request` })}>
                <h2>Create Tracker</h2>
                <h1 class="plus">+</h1>
                
            </div>
            </div>

            

            
    `;

    }

    // etc
}