import { Router } from "express";
import tracker from "../services/profile-svc"
import profileSvc from "../services/profile-svc";

const router = Router();

router.get("/:trackerid", async (req, res) => {
    const { trackerid } = req.params;
    console.log(trackerid)
    const got = await tracker.get(trackerid).catch((err) => {res.status(404)})

    res.json(got[0])
})

router.put("/:trackerid", async (req, res) => {

    const { trackerid } = req.params;
    const updated = await tracker.update(trackerid, req.body).catch(err => {
        res.status(404).send(err)
    })

    res.json(updated)

});

router.delete("/:trackerid", async (req, res) => {
    const { trackerid } = req.params;
    const deleted = await tracker.deleteTracker(trackerid).catch(err => {
        console.error(err)
        res.status(404).send(err)
    })

    res.json(deleted)
})

router.post("/", async (req, res) => {
    const newProfile = req.body;

    const profile = await profileSvc.create(newProfile).catch(err => {
        res.status(500).send(err)
    })

    res.status(201).send(profile)
})

router.get("/", async (req, res) => {

    const profiles = await profileSvc.index().catch(err => {
        res.status(500).send(err)
    })

    res.json(profiles)

});

export default router