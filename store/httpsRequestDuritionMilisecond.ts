import client from "prom-client";

export const httpsRequestDuritionMilisecond = new client.Histogram({
    name: 'https_request_durition_ms',
    help: 'Duration of request in ms',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 5, 50, 100, 300, 500, 1000]
})