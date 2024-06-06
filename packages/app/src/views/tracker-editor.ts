import { Auth, Form, History, Observer, Rest, View, define } from "@calpoly/mustang";
import { css, html } from "lit";
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

    const tracker = allTrackers?.filter((tracker) => {
      return tracker._id === this.trackerId
    })[0]

    if (!tracker) {
      return undefined
    }

    console.log(tracker)

    tracker.dates = new Date(tracker.dates)
    return tracker
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

  static styles = css`

    form {
      display: block
    }

    span {
      margin-bottom: 5px
    }

  `

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
          <span>Date</span>
          <input name="dates" type="date" />
        </label>

      </mu-form>
    `
  }

}