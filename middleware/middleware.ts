import type { Request, Response, NextFunction } from "express";
import { requestCounter } from "../store/requestCounter";
import { activeRequestToGorge } from "../store/activeRequestToGorge";
import { httpsRequestDuritionMilisecond } from "../store/httpsRequestDuritionMilisecond";


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