import { Auth, Form, History, Observer, Rest, View, define } from "@calpoly/mustang";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { Tracker } from "server/models";
import { Model } from "../mvu/model";
import { Msg } from "../mvu/messages";

define({ "restful-form": Rest.FormElement });

export class TrackerEdit extends View<Model, Msg> {

  static uses = define({
    "mu-form": Form.Element,
  })

  @property()
  get trackers(): Tracker | undefined {
    const allTrackers = this.model.trackers;

    return allTrackers?.filter((tracker) => {
      return tracker.id === this.trackerId
    })[0]
  }

  @property({ attribute: "tracker", reflect: true })
  trackerId = ""

  connectedCallback(): void {
    super.connectedCallback();

    if (!this.trackers) {
      this.dispatchMessage(["get-user"]);
    }

  }

  _handleSubmit(event: Form.SubmitEvent<Tracker>) {
    console.log("SUBMITTING")
    this.dispatchMessage([
      "update-tracker",
      {
        tracker: event.detail,
        onSuccess: () =>
          History.dispatch(this, "history/navigate", {
            href: `/app/tracker`
          }),
        onFailure: (error: Error) =>
          console.log("ERROR:", error)
      }
    ]);
  }


  constructor() {
    super("blazing:model");
  }

  render() {
    return html`
            <h2>Edit Tracker</h2>
            <mu-form .init=${this.trackers} @mu-form:submit=${this._handleSubmit}>
              <label>
                <span>Phone Number</span>
                <input name="phoneNumber" />
              </label>
              <label>
                <span>Party Size</span>
                <input name="partySize" />
              </label>
              <label>
                <span>Trailhead ID</span>
                <input name="trailheadId" />

                </label>
            </mu-form>
        `
  }

}