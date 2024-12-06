import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.hourly(
  "sync subscrptions from Substack",
  { minuteUTC: 0 },
  internal.getSubs.syncSubscribers
);

export default crons;
