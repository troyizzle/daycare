import { router } from "../trpc";
import { actionRouter } from "./action";
import { userRouter } from "./user";
import { roleRouter } from "./role";
import { classroomRouter } from "./classroom";
import { studentRouter } from "./student";
import { contactInformationRouter } from "./contactInformation";
import { userPushTokenRouter } from "./userPushToken";

export const appRouter = router({
  action: actionRouter,
  student: studentRouter,
  classroom: classroomRouter,
  contactInformation: contactInformationRouter,
  role: roleRouter,
  user: userRouter,
  userPushToken: userPushTokenRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
