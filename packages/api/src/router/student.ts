import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs"
import { studentProfilePictureSchema, studentUpdateSchema } from "@acme/db/schema/student"
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from ".";
import { sendNotification } from "../../../../apps/expo/src/utils/push-notifications";

export type StudentAllResponse = inferProcedureOutput<AppRouter["student"]["all"]>;
export type StudentLogsByStudentIdResponse = inferProcedureOutput<AppRouter["student"]["logsByStudentId"]>;

export const studentRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.student.findMany();
  }),
  byId: protectedProcedure.input(
    z.object({
      id: z.string(),
    })
  )
    .query(({ ctx, input }) => {
      return ctx.prisma.student.findUnique({
        where: {
          id: input.id
        },
      })
    }),
  logsByStudentId: protectedProcedure.input(
    z.object({
      studentId: z.string(),
      date: z.date()
    })
  ).query(async ({ ctx, input }) => {
    const { date } = input
    console.log('og date', date)
    const startOfDay = new Date(date)
    startOfDay.setUTCHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setUTCHours(23, 59, 59, 999)
    console.log("query dates", startOfDay, endOfDay)

    const data = await ctx.prisma.studentActionLog.findMany({
      where: {
        studentId: input.studentId,
        postedAt: {
          gte: startOfDay.toISOString(),
          lte: endOfDay.toISOString()
        }
      },
      include: {
        action: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const teacherIds = data?.map(log => log.teacherId)

    const users = await clerkClient.users.getUserList({
      userId: teacherIds
    })

    return data.map(log => ({
      ...log,
      teacher: users.find(user => user.id === log.teacherId)
    }))
  }),
  update: protectedProcedure
    .input(studentUpdateSchema)
    .mutation(({ ctx, input }) => {
      const { id, ContactInformation, ...data } = input

      return ctx.prisma.student.update({
        where: {
          id
        },
        data: {
          ...data,
          ContactInformation: {
            deleteMany: {},
            createMany: {
              data: ContactInformation ?? []
            }
          }
        }
      })
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
  createLog: protectedProcedure
    .input(z.object({
      studentId: z.string(),
      actionId: z.string(),
      notes: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userTimezoneOffset = new Date().getTimezoneOffset() * 60000;
      const postedAt = new Date(Date.now() - userTimezoneOffset)

      const data = await ctx.prisma.studentActionLog.create({
        data: {
          ...input,
          teacherId: ctx.auth.userId,
          postedAt: postedAt.toISOString()
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          action: true
        }
      })

      const parents = await ctx.prisma.parentStudent.findMany({
        where: {
          studentId: input.studentId
        }
      })

      const pushTokens = await ctx.prisma.userPushToken.findMany({
        where: {
          userId: {
            in: parents.map(parent => parent.userId)
          }
        }
      })

      pushTokens.forEach(pushToken => {
        sendNotification(pushToken.pushToken,
          {
            body: `${data.student.firstName} ${data.student.lastName} ${data.action.name}`
           }
        )
      })


      return data
    }),
  byIdProfile: protectedProcedure
    .input(z.object({
      studentId: z.string()
    }))
    .query(({ ctx, input }) => {
      return ctx.prisma.student.findUnique({
        where: {
          id: input.studentId
        },
        include: {
        }
      })
    })
});
