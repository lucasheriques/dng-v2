import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

// Add Stripe webhook route
http.route({
  path: "/stripe",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return new Response("Missing Stripe signature", { status: 400 });
    }

    try {
      const result = await ctx.runAction(internal.stripe.fulfill, {
        signature,
        payload: await request.text(),
      });

      if (result.success) {
        return new Response("Webhook processed successfully", { status: 200 });
      } else {
        console.error("Error in webhook:", result.error);
        return new Response("Error processing webhook", { status: 400 });
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
      return new Response("Internal error processing webhook", { status: 500 });
    }
  }),
});

http.route({
  path: "/pix",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const webhookSecret = url.searchParams.get("webhookSecret");

    if (!webhookSecret) {
      return new Response("Missing webhook secret", { status: 400 });
    }

    try {
      const result = await ctx.runAction(internal.pix.fulfill, {
        webhookSecret,
        payload: await request.text(),
      });

      if (result.success) {
        return new Response("Webhook processed successfully", { status: 200 });
      } else {
        console.error("Error in webhook:", result.error);
        return new Response("Error processing webhook", { status: 400 });
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
      return new Response("Internal error processing webhook", { status: 500 });
    }
  }),
});

export default http;
