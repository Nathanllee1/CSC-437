import { prepareTemplate } from "./template.js";
export function addFragment(htmlString, container) {
    const parser = new DOMParser();

    const doc = parser.parseFromString(htmlString, "text/html");
    const fragment = Array.from(doc.body.childNodes);

    container.append(...fragment);
}
export function renderJSON(json) {
    const entries = Object.entries(json);
    const dtdd = (key, value) =>
        `<dt>${key}</dt><dd>${JSON.stringify(value)}</dd>`;
    return entries.map(([k, v]) => dtdd(k, v)).join("");
}

export function loadJSON(
    src,
    container,
    authorization
  ) {
    console.log({authorization})
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

    connectedCallback() {
        const src = this.getAttribute("src");
        const open = this.hasAttribute("open");
        if (open) loadJSON(src, this);
        this.addEventListener(
            "json-object:open",
            () => loadJSON(src, this)
        );
    }
}

customElements.define("json-object", JsonObjectElement);