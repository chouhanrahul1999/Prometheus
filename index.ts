import express, { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import client from "prom-client";

const requestCounter = new client.Counter({
    name: "http_request_total",
    help: "Total no of http request",
    labelNames: ["method", "route", "status_code"],
});

const activeRequestToGorge = new client.Gauge({
    name: "active_request",
    help: "Numbers of active request",
});

const httpsRequestDuritionMilisecond = new client.Histogram({
    name: 'https_request_durition_ms',
    help: 'Duration of request in ms',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 5, 50, 100, 300, 500, 1000]
})

export function middleware(req: Request, res: Response, next: NextFunction) {
    if (req.path !== "/metrics") {
        activeRequestToGorge.inc();
    }

    const startTime = Date.now();

    res.on("finish", () => {
        const endTime = Date.now() - startTime;
        console.log(`Time it took is ${endTime}ms.`);

        requestCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode,
        });

        httpsRequestDuritionMilisecond.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            code: res.statusCode
        }, endTime)

        if (req.path !== "/metrics") {
            activeRequestToGorge.dec();
        }
    });

    next();
}

const app = express();
app.use(middleware);

app.get("/cpu", async (req, res) => {
    await new Promise((p) => setTimeout(p, Math.random() * 1000));

    res.json({
        message: "cpu",
    });
});

app.get("/user", (req, res) => {
    res.json({
        message: "user",
    });
});

app.get("/metrics", async (req, res) => {
    const metrics = await client.register.metrics();
    res.set("Content-Type", client.register.contentType);
    res.end(metrics);
});

app.listen(3001);
