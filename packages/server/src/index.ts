// src/index.ts
import express, { Request, Response, json } from "express";
import { connect } from "./mongo";
import trackers from "./routes/trackers"
import path from "path";
import auth, { authenticateUser } from "./routes/auth";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

// NPM Packages
const nodeModules = path.resolve(
    __dirname,
    "../../../node_modules"
);
console.log("Serving NPM packages from", nodeModules);
app.use("/node_modules", express.static(nodeModules));

app.use(express.static(staticDir));
app.use(json())

app.use("/api/trackers", authenticateUser, trackers)
app.use("/auth", auth);

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.listen(port, async () => {
    await connect("permittracker")
    console.log(`Server running at http://localhost:${port}`);
});