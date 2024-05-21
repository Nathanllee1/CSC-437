import { LitElement, css, html } from "lit";

export class HeaderElement extends LitElement {
  render() {
    return html`
      <header>
        <slot name="title"></slot>
        <slot></slot>
        <!-- TODO: insert contents of header here -->
      </header>
    `;
  }

  static styles = css`
    /* TODO: Style the header here */
  `;
}