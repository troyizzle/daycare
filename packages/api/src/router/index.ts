import { router } from "../trpc";
import { actionRouter } from "./action";
import { userRouter } from "./user";
import { roleRouter } from "./role";
import { classroomRouter } from "./classroom";
import { studentRouter } from "./student";

export const appRouter = router({
  action: actionRouter,
  student: studentRouter,
  classroom: classroomRouter,
  role: roleRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
