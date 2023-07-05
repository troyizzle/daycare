import { router } from "../trpc";
import { postRouter } from "./post";
import { authRouter } from "./auth";
import { babyRouter } from "./baby";

export const appRouter = router({
  baby: babyRouter,
  post: postRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
