import cache from "@convex-dev/action-cache/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(cache);

export default app;
