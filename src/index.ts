import express from "express";
import client from "prom-client";
import { middleware } from "../middleware/middleware";

const app = express();
app.use(middleware);

app.get("/cpu", async (req, res) => {
    await new Promise((p) => setTimeout(p, Math.random() * 2500));

    res.json({
        message: "cpu",
    });
});

app.get("/user", (req, res) => {
    res.json({
        message: {
            name: "Rahul singh",
            age: 24,
        },
    });
});

app.get("/metrics", async (req, res) => {
    const metrics = await client.register.metrics();
    res.set("Content-Type", client.register.contentType);
    res.end(metrics);
});

app.listen(3000);
