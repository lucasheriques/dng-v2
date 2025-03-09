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
    if (isSubscribePage(request)) {
      return NextResponse.redirect(SUBSCRIBE_LINK);
    }
    if (isLoginPage(request) && (await convexAuth.isAuthenticated())) {
      return nextjsMiddlewareRedirect(request, "/perfil");
    }
    if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
      return nextjsMiddlewareRedirect(request, "/login");
    }
  },
  { cookieConfig: { maxAge: 60 * 60 * 24 * 30 } }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
