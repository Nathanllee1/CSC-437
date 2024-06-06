import { Tracker } from "models/tracker";
import { Schema, Model, Document, model } from "mongoose";


const trackerSchema = new Schema<Tracker>({
    userId: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    dates: String,
    partySize: {
        type: Number,
        required: true
    },
    trailheadId: Number
})

const trackerModel = model<Tracker>("Tracker", trackerSchema)

function index() {
    return trackerModel.find()
}

async function get(id: string) {

    const list = await trackerModel.findById(id).catch(err => {
        throw `${id} Not found`
    })

    return list
}

function create(tracker: Tracker) {
    const p = new trackerModel(tracker);

    return p.save()
}

async function update(id: String, tracker: Tracker) {

    const found = await trackerModel.findById(id)

    if (!found) throw `${id} not found`

    const updated = await trackerModel.findByIdAndUpdate(id, tracker, {
        new: true
    })

    if (!updated) throw `Could not update ${id}`

    return updated as Tracker

}

async function deleteTracker(id: String) {
    const deleted = await trackerModel.findById( id)

    if (!deleted) throw `${id} not found`

    await trackerModel.findByIdAndDelete(id)
}

async function getTrackers(username: String) {
    const trackers = await trackerModel.find({userId: username})

    return trackers
}

export default {index, get, create, update, deleteTracker, getTracker: getTrackers}