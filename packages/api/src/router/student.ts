import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs"
import { studentProfilePictureSchema, studentUpdateSchema} from "@acme/db/schema/student"

export const studentRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.student.findMany();
  }),
  byId: protectedProcedure.input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const data = await ctx.prisma.student.findUnique({
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
  updateProfilePicture: protectedProcedure
  .input(studentProfilePictureSchema)
  .mutation(({ ctx, input }) => {
    const { id, ...data } = input

    return ctx.prisma.student.update({
      where: {
        id
      },
      data
    })
  }),
  updateMood: protectedProcedure
  .input(z.object({
    babyId: z.string(),
    mood: z.string()
  }))
  .mutation(({ ctx, input }) => {
    return ctx.prisma.student.update({
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
    studentId: z.string(),
    actionId: z.string(),
    notes: z.string(),
  }))
  .mutation(({ ctx, input }) => {
    return ctx.prisma.studentActionLog.create({
      data: {
        ...input,
        teacherId: ctx.auth.userId
      }
    })
  }),
});
