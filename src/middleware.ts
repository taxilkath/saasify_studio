import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

export default authMiddleware({
  // Define all routes that are publicly accessible.
  // Unauthenticated users will be allowed to visit these routes.
  publicRoutes: ['/', '/sign-in', '/sign-up'],

  /**
  * The afterAuth function runs after authentication and can be used to
  * implement custom redirection rules.
  */
  afterAuth(auth, req) {
    // --- Handle LOGGED-IN users ---
    if (auth.userId) {
      const isPublicRoute = auth.isPublicRoute;
      const isAuthRoute = req.nextUrl.pathname.startsWith('/sign-in') || req.nextUrl.pathname.startsWith('/sign-up');

      // If the user is logged in and tries to access the landing page or an auth page,
      // redirect them to their dashboard.

      if (isAuthRoute) {
        const dashboardUrl = new URL('/dashboard', req.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }


    // --- Handle LOGGED-OUT users ---
    if (!auth.userId && !auth.isPublicRoute) {
      // If the user is not logged in and is trying to access a private route,
      // redirect them to the landing page.
      const landingUrl = new URL('/', req.url);
      return NextResponse.redirect(landingUrl);
    }

    // If none of the above conditions are met, allow the request to proceed.
    return NextResponse.next();
  }
});

export const config = {
  // This matcher ensures the middleware runs on all routes except for static files.
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};