import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const babyRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.baby.findMany();
  }),
  byId: protectedProcedure.input(
    z.object({
      id: z.string(),
    })
  )
  .query(({ ctx, input }) => {
    return ctx.prisma.baby.findUnique({
      where: {
        id: input.id
      },
      include: {
        actionLogs: {
          include: {
            action: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
    })
  }),
  createLog: protectedProcedure
  .input(z.object({
    babyId: z.string(),
    actionId: z.string(),
  }))
  .mutation(({ ctx, input }) => {
    return ctx.prisma.babyActionLog.create({
      data: {
        ...input,
        teacherId: ctx.auth.userId
      }
    })
  }),
});
