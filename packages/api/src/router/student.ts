import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs"
import { studentNewLogSchema, studentNewSchema, studentProfilePictureSchema, studentUpdateSchema } from "@acme/db/schema/student"
import { inferProcedureOutput, TRPCError } from "@trpc/server";
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
    const startOfDay = new Date(date)
    startOfDay.setUTCHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setUTCHours(23, 59, 59, 999)

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
  create: protectedProcedure
    .input(studentNewSchema)
    .mutation(({ ctx, input: data }) => {

      return ctx.prisma.student.create({
        data
      })
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
    .input(studentNewLogSchema)
    .mutation(async ({ ctx, input }) => {
      // const userTimezoneOffset = new Date().getTimezoneOffset() * 60000;
      // const postedAt = new Date(Date.now() - userTimezoneOffset)

      // const student = await ctx.prisma.student.findUnique({
      //   where: {
      //     id: input.studentId
      //   },
      //   include: {
      //     classrooms: {
      //       include: {
      //         classroom: {
      //           include: {
      //             teachers: true
      //           }
      //         }
      //       }
      //     }
      //   }
      // })

      if (true) {
        throw new Error("Student not found")
      }

      // const data = await ctx.prisma.studentActionLog.create({
      //   data: {
      //     ...input,
      //     teacherId: ctx.auth.userId,
      //     postedAt: postedAt.toISOString()
      //   },
      //   include: {
      //     student: {
      //       select: {
      //         firstName: true,
      //         lastName: true
      //       }
      //     },
      //     action: true
      //   }
      // })
      //
      // const parents = await ctx.prisma.parentStudent.findMany({
      //   where: {
      //     studentId: input.studentId
      //   }
      // })
      //
      // const pushTokens = await ctx.prisma.userPushToken.findMany({
      //   where: {
      //     userId: {
      //       in: parents.map(parent => parent.userId)
      //     }
      //   }
      // })
      //
      // pushTokens.forEach(pushToken => {
      //   sendNotification(pushToken.pushToken,
      //     {
      //       body: `${data.student.firstName} ${data.student.lastName} ${data.action.name}`
      //     }
      //   )
      // })
      //
      //
      // return data
    }),
  byIdProfile: protectedProcedure
    .input(z.object({
      studentId: z.string()
    }))
    .query(({ ctx, input }) => {
      return ctx.prisma.student.findUnique({
        where: {
          id: input.studentId
        }
      })
    })
});
