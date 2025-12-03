import client from "prom-client";

export const activeRequestToGorge = new client.Gauge({
    name: "active_request",
    help: "Numbers of active request",
});