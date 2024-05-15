"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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
var trackers_exports = {};
__export(trackers_exports, {
  default: () => trackers_default
});
module.exports = __toCommonJS(trackers_exports);
var import_express = require("express");
var import_profile_svc = __toESM(require("../services/profile-svc"));
var import_profile_svc2 = __toESM(require("../services/profile-svc"));
const router = (0, import_express.Router)();
router.get("/:trackerid", (req, res) => __async(void 0, null, function* () {
  const { trackerid } = req.params;
  console.log(trackerid);
  const got = yield import_profile_svc.default.get(trackerid).catch((err) => {
    res.status(404);
  });
  res.json(got[0]);
}));
router.put("/:trackerid", (req, res) => __async(void 0, null, function* () {
  const { trackerid } = req.params;
  const updated = yield import_profile_svc.default.update(trackerid, req.body).catch((err) => {
    res.status(404).send(err);
  });
  res.json(updated);
}));
router.delete("/:trackerid", (req, res) => __async(void 0, null, function* () {
  const { trackerid } = req.params;
  const deleted = yield import_profile_svc.default.deleteTracker(trackerid).catch((err) => {
    console.error(err);
    res.status(404).send(err);
  });
  res.json(deleted);
}));
router.post("/", (req, res) => __async(void 0, null, function* () {
  const newProfile = req.body;
  const profile = yield import_profile_svc2.default.create(newProfile).catch((err) => {
    res.status(500).send(err);
  });
  res.status(201).send(profile);
}));
router.get("/", (req, res) => __async(void 0, null, function* () {
  const profiles = yield import_profile_svc2.default.index().catch((err) => {
    res.status(500).send(err);
  });
  res.json(profiles);
}));
var trackers_default = router;
