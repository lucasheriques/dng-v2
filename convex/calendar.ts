"use node";

import { ActionCache } from "@convex-dev/action-cache";
import { v } from "convex/values";
import dayjs from "dayjs";
import type { calendar_v3 } from "googleapis";
import { google } from "googleapis";
import { components, internal } from "./_generated/api";
import { action, internalAction } from "./_generated/server";

// Define the event type that will be returned to the client
export type CalendarEvent = {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location?: string;
  link?: string;
  meetLink?: string;
};

// Define a type for Google API errors
interface GoogleApiError extends Error {
  response?: {
    status: number;
    statusText: string;
    data: Record<string, unknown>;
  };
}

// Define a type for the service account key
interface ServiceAccountKey {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  [key: string]: string;
}

const cache = new ActionCache(components.actionCache, {
  action: internal.calendar.internalGetEvents,
  name: "getEvents",
  ttl: 1000 * 60 * 60,
});

export const getEvents = action({
  handler: async (
    ctx
  ): Promise<{
    events: (CalendarEvent & { isPast: boolean })[];
    success: boolean;
    error?: string;
  }> => {
    // Calculate time range (current month)
    const timeMin = dayjs().startOf("month").toDate().toISOString();
    const timeMax = dayjs().endOf("month").toDate().toISOString();

    // Use the time range as cache parameters
    return await cache.fetch(ctx, { timeMin, timeMax });
  },
});

// Action to get calendar events directly from Google Calendar
export const internalGetEvents = internalAction({
  args: {
    timeMin: v.string(),
    timeMax: v.string(),
  },
  handler: async (_ctx, args) => {
    try {
      const calendarId = process.env.GOOGLE_CALENDAR_ID;
      if (!calendarId) {
        throw new Error("GOOGLE_CALENDAR_ID is not set");
      }

      if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
        throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY is not set");
      }

      const events = await fetchEventsWithServiceAccount(
        calendarId,
        args.timeMin,
        args.timeMax
      );
      console.log(`Successfully fetched ${events.length} events`);

      const formattedEvents = events.map((event: CalendarEvent) => {
        return {
          ...event,
          isPast: dayjs(event.startTime).isBefore(dayjs()),
        };
      });

      const today = dayjs().startOf("day");
      formattedEvents.sort((a, b) => {
        const aDate = dayjs(a.startTime);
        const bDate = dayjs(b.startTime);
        const aIsPast = aDate.isBefore(today);
        const bIsPast = bDate.isBefore(today);

        if (aIsPast && !bIsPast) return 1;
        if (!aIsPast && bIsPast) return -1;
        return aDate.isBefore(bDate) ? -1 : 1;
      });

      return {
        events: formattedEvents,
        success: true,
      };
    } catch (error) {
      console.error("Error fetching calendar events:", error);

      return {
        events: [],
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

// Helper function to parse the service account key
function parseServiceAccountKey(keyString: string): ServiceAccountKey {
  console.log("Attempting to parse service account key...");

  let serviceAccountKey: ServiceAccountKey;

  // First, try to parse it directly as JSON
  try {
    serviceAccountKey = JSON.parse(keyString);
    return serviceAccountKey;
  } catch {
    console.log("Direct JSON parsing failed, trying base64 decode...");
  }

  // If direct parsing fails, try base64 decoding
  try {
    const decoded = Buffer.from(keyString, "base64").toString();
    serviceAccountKey = JSON.parse(decoded);
    return serviceAccountKey;
  } catch (error) {
    console.error("Base64 decoding and parsing failed:", error);
    throw new Error(
      "Invalid service account key format. Please ensure it's valid JSON or base64 encoded JSON."
    );
  }
}

const serviceAccountKey = parseServiceAccountKey(
  process.env.GOOGLE_SERVICE_ACCOUNT_KEY as string
);
const auth = new google.auth.GoogleAuth({
  credentials: serviceAccountKey,
  scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
});

// Helper function to fetch events using a service account
async function fetchEventsWithServiceAccount(
  calendarId: string,
  timeMin: string,
  timeMax: string
): Promise<CalendarEvent[]> {
  try {
    const calendar = google.calendar({
      version: "v3",
      auth: auth,
    });
    console.log("Making API request to Google Calendar...");

    try {
      const response = await calendar.events.list({
        calendarId,
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: "startTime",
        maxResults: 100,
      });

      return (response.data.items || [])
        .filter(
          (item): item is calendar_v3.Schema$Event =>
            item.status !== "cancelled" && item !== null
        )
        .map((item) => ({
          id: item.id || "",
          title: item.summary || "Evento sem título",
          description: item.description || "",
          startTime: item.start?.dateTime || item.start?.date || "",
          endTime: item.end?.dateTime || item.end?.date || "",
          location: item.location || undefined,
          link: item.htmlLink || undefined,
          meetLink:
            item.conferenceData?.entryPoints?.find(
              (ep: calendar_v3.Schema$EntryPoint) =>
                ep.entryPointType === "video"
            )?.uri || undefined,
        }));
    } catch (error) {
      console.error("Error making Google Calendar API request:", error);
      const apiError = error as GoogleApiError;
      if (apiError.response) {
        console.error("API Error Response:", {
          status: apiError.response.status,
          statusText: apiError.response.statusText,
          data: apiError.response.data,
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Detailed error in fetchEventsWithServiceAccount:", error);
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
}
