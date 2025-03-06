import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "sync subscribers from Substack",
  { hourUTC: 12, minuteUTC: 0 },
  internal.getSubs.syncSubscribers
);

export default crons;
