import { Auth, Observer, View } from "@calpoly/mustang";
import { css, html } from "lit";
import { property } from "lit/decorators.js";
import { Tracker } from "server/models";
import { Msg } from "../mvu/messages";
import { Model } from "../mvu/model";

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
        .card {
            background-color: white;
            padding: 10px;
            margin: 10px;
            max-width: 300px;
            border-radius: 5px;
            box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
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
    `


    render() {
        return html`
            <h2>Your Trackers</h2>
            <div class="card_container">${
            
                this.trackers?.map((tracker) => {
                    // Renders out cards of a list of trackers
                    return (
                        html`
                            <div class="card">
                                <div class="toolbar">
                                    <a href="/app/tracker/edit/${tracker.id}">✏️</a>
                                    <button onclick="console.log('trash')">🗑️</button>
                                </div>
                                <p>Trailhead ID: ${tracker.trailheadId}</p>
                                
                                <p>Phone Number: ${tracker.phoneNumber}</p>
                                <p>Party Size: ${tracker.partySize}</p>
                            </div>`
                    )
                })
            
            }</div>
    `;
    }

    // etc
}