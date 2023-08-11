import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const userPushTokenRouter = router({
  create: protectedProcedure.input(z.object({
    pushToken: z.string(),
  }))
  .mutation(({ ctx, input }) => {
    return ctx.prisma.userPushToken.create({
      data: {
        pushToken: input.pushToken,
        userId: ctx.auth.userId
      }
    })
  })
})
