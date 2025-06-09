// New and correct way
import { authMiddleware } from "@clerk/nextjs";
export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ['/sign-in', '/sign-up'],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: [],
  debug:false
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};