import { SUBSCRIBE_LINK } from "@/lib/constants";
import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { NextResponse } from "next/server";

const isLoginPage = createRouteMatcher(["/login"]);
const isProtectedRoute = createRouteMatcher(["/perfil(.*)", "/assinantes(.*)"]);
const isSubscribePage = createRouteMatcher(["/sub"]);

export default convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    // Add the current pathname as a header
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", request.nextUrl.pathname);

    if (isSubscribePage(request)) {
      const response = NextResponse.redirect(SUBSCRIBE_LINK);
      // Copy headers to the redirect response
      requestHeaders.forEach((value, key) => {
        response.headers.set(key, value);
      });
      return response;
    }
    if (isLoginPage(request) && (await convexAuth.isAuthenticated())) {
      const response = nextjsMiddlewareRedirect(request, "/perfil");
      // Copy headers to the redirect response
      requestHeaders.forEach((value, key) => {
        response.headers.set(key, value);
      });
      return response;
    }
    if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
      const response = nextjsMiddlewareRedirect(request, "/login");
      // Copy headers to the redirect response
      requestHeaders.forEach((value, key) => {
        response.headers.set(key, value);
      });
      return response;
    }

    // For non-redirect cases, return with the updated headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  },
  { cookieConfig: { maxAge: 60 * 60 * 24 * 30 } }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
