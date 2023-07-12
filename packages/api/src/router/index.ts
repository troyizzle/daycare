import { router } from "../trpc";
import { babyRouter } from "./baby";
import { actionRouter } from "./action";
import { classRouter } from "./class";
import { userRouter } from "./user";

export const appRouter = router({
  action: actionRouter,
  baby: babyRouter,
  class: classRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
