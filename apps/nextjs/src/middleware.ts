// import { withClerkMiddleware } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
//
// export default withClerkMiddleware((_req: NextRequest) => {
//   return NextResponse.next();
// });
//
// // Stop Middleware running on static files
// export const config = {
//   matcher: [
//     /*
//      * Match request paths except for the ones starting with:
//      * - _next
//      * - static (static files)
//      * - favicon.ico (favicon file)
//      *
//      * This includes images, and requests from TRPC.
//      */
//     "/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)",
//   ],
// };

import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  afterAuth: async (auth) => {
    console.log("after auth", auth)
    console.log("aouth token", await auth.getToken())
  }
});

 export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
