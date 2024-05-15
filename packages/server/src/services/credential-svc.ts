// src/services/credential-svc.ts
import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
import { Credential } from "../models/credential";

const credentialSchema = new Schema<Credential>(
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

const credentialModel = model<Credential>(
    "Credential",
    credentialSchema
);

async function create(username: string, password: string) {

    if (!username || !password) {
        throw "must provide username and password";
    }

    const found = await credentialModel.find({ username }) as unknown as Credential[];

    if (found.length) throw ("username exists");

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const creds = new credentialModel({
        username,
        hashedPassword
    });

    const created = await creds.save()

    if (created) return created
}

async function verify(
    username: string,
    password: string
): Promise<string> {

    const found = await credentialModel.find({ username }) as unknown as Credential[];
    if (!found || found.length !== 1)
        throw "Invalid username or password";

    const credsOnFile = found[0];
    if (!credsOnFile) throw "Invalid username or password";

    if (bcrypt.compareSync(password, credsOnFile.hashedPassword)) {
        console.log("Verified", credsOnFile.username)
        return credsOnFile.username;
    }

    throw "Invalid username or password";
}

export default { create, verify };
