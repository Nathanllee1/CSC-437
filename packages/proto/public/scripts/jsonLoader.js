import { prepareTemplate } from "./template.js";
import { Auth, Observer } from "@calpoly/mustang";

export function addFragment(htmlString, container) {
  const parser = new DOMParser();

  const doc = parser.parseFromString(htmlString, "text/html");
  const fragment = Array.from(doc.body.childNodes);

  container.append(...fragment);
}
export function renderJSON(json) {
  const entries = Object.entries(json);
  const dtdd = (key, value) =>
    `<dt><b>${key}:</b> ${JSON.stringify(value)}</dt>`;
  return entries.map(([k, v]) => dtdd(k, v)).join("");
}

export function loadJSON(
  src,
  container,
  authorization
) {
  console.log({ authorization })
  container.replaceChildren();
  fetch(src, {
    headers: authorization
  })
    .then((response) => {
      if (response.status !== 200) {
        throw `Status: ${response.status}`;
      }
      return response.json();
    })
    .then((json) => addFragment(renderJSON(json), container))
    .catch((error) =>
      addFragment(
        renderJSON({
          Error: error,
          "While Loading": src
        }),
        container
      )
    );
}

export class JsonObjectElement extends HTMLElement {
  static template = prepareTemplate(`<template>
        <dl>
            <slot></slot>
        </dl>
        </template>`);

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).appendChild(
      JsonObjectElement.template.cloneNode(true)
    );
  }

  get src() {
    return this.getAttribute("src");
  }

  get authorization() {
    console.log("Authorization for user, ", this._user);
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${this._user.token}`
      }
    );
  }

  _authObserver = new Observer(this, "blazing:auth");

  connectedCallback() {
    this._authObserver.observe(({ user }) => {
      console.log("Setting user as effect of change", user);
      this._user = user;
      console.log({ user, src: this.src })
      if (this.src) {
        console.log("LOading JSON", this.authorization);
        loadJSON(
          this.src,
          this,
          this.authorization
        ).catch((error) => {
          const { status } = error;
          if (status === 401) {
            const message = new CustomEvent("auth:message", {
              bubbles: true,
              composed: true,
              detail: ["auth/redirect"]
            });
            console.log("Dispatching", message);
            this.dispatchEvent(message);
          } else {
            console.log("Error:", error);
          }
        });
      }
    });
  }
}

customElements.define("json-object", JsonObjectElement);