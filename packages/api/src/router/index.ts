import { router } from "../trpc";
import { babyRouter } from "./baby";
import { actionRouter } from "./action";

export const appRouter = router({
  action: actionRouter,
  baby: babyRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
