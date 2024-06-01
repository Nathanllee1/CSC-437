"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var tracker_svc_exports = {};
__export(tracker_svc_exports, {
  default: () => tracker_svc_default
});
module.exports = __toCommonJS(tracker_svc_exports);
var import_mongoose = require("mongoose");
const trackerSchema = new import_mongoose.Schema({
  id: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  dates: [String],
  partySize: {
    type: Number,
    required: true
  },
  trailheadId: Number
});
const trackerModel = (0, import_mongoose.model)("Tracker", trackerSchema);
function index() {
  return trackerModel.find();
}
function get(id) {
  return __async(this, null, function* () {
    const list = yield trackerModel.find({ id }).catch((err) => {
      throw `${id} Not found`;
    });
    return list;
  });
}
function create(tracker) {
  const p = new trackerModel(tracker);
  return p.save();
}
function update(id, tracker) {
  return __async(this, null, function* () {
    const found = yield trackerModel.findOne({ id });
    if (!found)
      throw `${id} not found`;
    const updated = yield trackerModel.findOneAndUpdate({ id }, tracker, {
      new: true
    });
    if (!updated)
      throw `Could not update ${id}`;
    return updated;
  });
}
function deleteTracker(id) {
  return __async(this, null, function* () {
    const deleted = yield trackerModel.findOne({ id });
    if (!deleted)
      throw `${id} not found`;
    yield trackerModel.findOneAndDelete({ id: deleted.id });
  });
}
function getTrackers(username) {
  return __async(this, null, function* () {
    const trackers = yield trackerModel.find({ userId: username });
    return trackers;
  });
}
var tracker_svc_default = { index, get, create, update, deleteTracker, getTracker: getTrackers };
