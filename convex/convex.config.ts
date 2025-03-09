import cache from "@convex-dev/action-cache/convex.config";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(cache);
app.use(rateLimiter);

export default app;
