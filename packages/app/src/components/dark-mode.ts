import { Events } from "@calpoly/mustang";
import { LitElement, html } from "lit";

function toggleDarkMode(ev: InputEvent) {
    const target = ev.target as HTMLInputElement;
    const checked = target.checked;

    Events.relay(ev, "dark-mode:toggle", { checked });
}

export class DarkModeToggle extends LitElement {
    render() {
        return html`
        <label @change=${toggleDarkMode}>
            <input type="checkbox" autocomplete="off" />
            Dark mode
        </label>`
    }
}