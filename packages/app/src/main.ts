import { define, Auth, Events, Store, Switch, History } from "@calpoly/mustang";
import { HeaderElement } from "./components/blazing-header"
import { DarkModeToggle } from "./components/dark-mode"
import { Msg } from "./mvu/messages";
import { Model, init } from "./mvu/model";
import update from "./mvu/update";
import { Hero } from "./components/hero";
import { html } from "lit";
import { LoginFormElement } from "./components/login-form";
import { ProfileView } from "./views/profile-view";
import { TrackerEdit } from "./views/tracker-editor";


const routes: Switch.Route[] = [
    {
        path: "/app",
        view: () => html`
            <main-hero></main-hero>
        `
    },
    {
        path: "/",
        redirect: "/app"
    },

    {
        path: "/app/login",
        view: () => html`
            <main-login></main-login>
        `
    },
    {
        path: "/app/tracker",
        view: () => html`
            <profile-view></profile-view>
        `
    },
    {
        path: "/app/tracker/edit/:id",
        view: (params: Switch.Params) => html`
            <tracker-edit tracker=${params.id}></tracker-edit>
        `
    }

]

class AppStore extends Store.Provider<
    Model,
    Msg
> {
    constructor() {
        super(update, init, "blazing:auth");
    }
}



define({
    "mu-auth": Auth.Provider,
    "blazing-header": HeaderElement,
    "dark-mode": DarkModeToggle,
    "mu-store": AppStore,
    "main-hero": Hero,
    "mu-history": History.Provider,
    "mu-switch": class AppSwitch extends Switch.Element {
        constructor() {
            super(routes, "blazing:history");
        }
    },
    "main-login": LoginFormElement,
    "profile-view": ProfileView,
    "tracker-edit": TrackerEdit
});

// @ts-ignore
window.relayEvent = Events.relay;

const page = document.body;

page.addEventListener('dark-mode:toggle', (event) => {
    console.log(event)
    // @ts-ignore
    const { checked } = event.detail;

    document.body.classList.toggle('dark-mode', checked);
});