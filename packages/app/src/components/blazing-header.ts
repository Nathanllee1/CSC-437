import { LitElement, css, html } from "lit";
import { Auth, Dropdown, Observer, View, define } from "@calpoly/mustang";
import { property } from "lit/decorators.js";
import { Model } from "../mvu/model";
import { Msg } from "../mvu/messages";

export class HeaderElement extends View<Model, Msg> {
  static uses = define({
    "drop-down": Dropdown.Element
  });

  @property()
  username = "anonymous";

  @property()
  authenticated = false

  _authObserver = new Observer<Auth.Model>(
    this,
    "blazing:auth"
  );

  connectedCallback() {
    super.connectedCallback();

    console.log("Connected")

    this._authObserver.observe(({ user }) => {
      console.log("User", user)
      if (user && user.authenticated) {
        this.username = user.username;
        this.authenticated = true;
        return
      }
      this.authenticated = false;
      this.username = "anonymous";
    });
  }

  render() {
    return html`
      <header>
        <a id="title" href="/app">Permit Tracker</a>

        ${this.authenticated ? html`
                  <a href="/app/request">New Request</a>

        <a href="/app/tracker">My Trackers</a>
        <a href="/app/login" onclick="relayEvent(event, 'auth:message', ['auth/signout'])">
                    Sign out
                </a>
       ` : html`
        <a href="/app/login?next=/app/tracker">Log In</a>
       `}

       <dark-mode></dark-mode>
      </header>
    `;
  }

  static styles = css`
    header {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 1em;

    }

    #title {
        color: var(--color-primary);
        font-size: 1.2em;
        font-weight: bold;
    }

    a {
        color: var(--text-color);
        /* remove underline */
        text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  `;
}