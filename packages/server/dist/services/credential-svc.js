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
var credential_svc_exports = {};
__export(credential_svc_exports, {
  default: () => credential_svc_default
});
module.exports = __toCommonJS(credential_svc_exports);
var import_bcryptjs = __toESM(require("bcryptjs"));
var import_mongoose = require("mongoose");
const credentialSchema = new import_mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    hashedPassword: {
      type: String,
      required: true
    }
  },
  { collection: "user_credentials" }
);
const credentialModel = (0, import_mongoose.model)(
  "Credential",
  credentialSchema
);
function create(username, password) {
  return __async(this, null, function* () {
    if (!username || !password) {
      throw "must provide username and password";
    }
    const found = yield credentialModel.find({ username });
    if (found.length)
      throw "username exists";
    const salt = yield import_bcryptjs.default.genSalt(10);
    const hashedPassword = yield import_bcryptjs.default.hash(password, salt);
    const creds = new credentialModel({
      username,
      hashedPassword
    });
    const created = yield creds.save();
    if (created)
      return created;
  });
}
function verify(username, password) {
  return __async(this, null, function* () {
    const found = yield credentialModel.find({ username });
    if (!found || found.length !== 1)
      throw "Invalid username or password";
    const credsOnFile = found[0];
    if (!credsOnFile)
      throw "Invalid username or password";
    if (import_bcryptjs.default.compareSync(password, credsOnFile.hashedPassword)) {
      console.log("Verified", credsOnFile.username);
      return credsOnFile.username;
    }
    throw "Invalid username or password";
  });
}
function get(username) {
  return __async(this, null, function* () {
    const user = yield credentialModel.findOne({ username });
    console.log({ username: user.username });
    return { username: user.username };
  });
}
var credential_svc_default = { create, verify, get };
