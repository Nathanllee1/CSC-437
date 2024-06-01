import { LitElement, css, html } from "lit";
import { Dropdown, define } from "@calpoly/mustang";

export class HeaderElement extends LitElement {
  static uses = define({
    "drop-down": Dropdown.Element
  });

  render() {
    return html`
      <header>
        <a id="title" href="/app">Permit Tracker</a>
        <a href="campsites.html">New Request</a>

        <a href="/app/login?next=/tracker">Log In</a>

        <drop-down>
          <div><a href="/app/tracker">My Trackers</a></div>
            <div>
                <a href="#" onclick="relayEvent(event, 'auth:message', ['auth/signout'])">
                    Sign out
                </a>
            </div>
          <dark-mode></dark-mode>
        </drop-down>
        
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
        color: var(--text-color);
        font-size: 1.2em;
        font-weight: bold;
        
    }

    a {
        color: var(--text-color);
    }
  `;
}