import client from "prom-client";

export const requestCounter = new client.Counter({
    name: "http_request_total",
    help: "Total no of http request",
    labelNames: ["method", "route", "status_code"],
});