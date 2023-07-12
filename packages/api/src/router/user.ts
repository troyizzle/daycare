import { router, protectedProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs"

export const userRouter = router({
  all: protectedProcedure.query(async ({ ctx }) => {
    return await clerkClient.users.getUserList()
  }),
})
