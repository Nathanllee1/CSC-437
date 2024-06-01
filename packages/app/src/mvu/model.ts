import { Tracker, User } from "server/models";

export interface Model {
    trackers?: Tracker[];
    profile?: User;
}

export const init: Model = {};
