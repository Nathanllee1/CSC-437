import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import { flattenedRegion, regions } from "../regions";
import { Form, History, View, define } from "@calpoly/mustang";
import { Model } from "../mvu/model";
import { Msg } from "../mvu/messages";

export class RequestTrailhead extends View<Model, Msg> {

    static uses = define({
        "mu-form": Form.Element,
    })

    @property({ attribute: 'trailhead', reflect: true })
    trailhead = "";

    _handleSubmit(event: Form.SubmitEvent<any>) {
        console.log("SUBMITTING")
        console.log(event.detail)

        const newTracker = {
            ...event.detail,
            trailheadId: this.trailhead
        }

        this.dispatchMessage(["new-tracker", {tracker: newTracker, onSuccess: () => {
            History.dispatch(this, "history/navigate", {href: `/app/tracker`})
        }}])
    }

    constructor() {
        super("blazing:model");
    }

    render() {
        return html`
            <h1>${flattenedRegion[this.trailhead]}</h1>
            <h2>Create a Tracker</h2>
            <mu-form @mu-form:submit=${this._handleSubmit}>
              <label>
                <span>Phone Number</span>
                <input name="phoneNumber" type="tel" />
              </label>
              <label>
                <span>Party Size</span>
                <input name="partySize" type="number" min="1" max="10" />
              </label>
              <label>
                <span>Date</span>
                <input type="date" name="dates" />
              </label>
            </mu-form>
            `;
    }
}
