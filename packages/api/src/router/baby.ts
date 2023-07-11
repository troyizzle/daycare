import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs"

const babyCreateSchema = z.object({
  firstName: z.string().min(1).max(40),
  lastName: z.string().min(1).max(40),
})


export const babyRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.baby.findMany();
  }),
  byId: protectedProcedure.input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const data = await ctx.prisma.baby.findUnique({
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

    const teacherIds = data?.actionLogs.map(log => log.teacherId)
    if (!teacherIds || teacherIds?.length === 0) {
      return data
    }

    const users = await clerkClient.users.getUserList({
      userId: teacherIds
    })

    return {
      ...data,
      actionLogs: data?.actionLogs.map(log => ({
        ...log,
        teacher: users.find(user => user.id === log.teacherId)
      }))
    }
  }),
  create: protectedProcedure.input(babyCreateSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.baby.create({
        data: input
      });
    }
  ),
  updateMood: protectedProcedure
  .input(z.object({
    babyId: z.string(),
    mood: z.string()
  }))
  .mutation(({ ctx, input }) => {
    return ctx.prisma.baby.update({
      where: {
        id: input.babyId
      },
      data: {
        mood: input.mood
      }
    })
  }),
  createLog: protectedProcedure
  .input(z.object({
    babyId: z.string(),
    actionId: z.string(),
    notes: z.string(),
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
