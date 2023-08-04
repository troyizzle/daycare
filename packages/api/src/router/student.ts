import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs"
import { studentProfilePictureSchema, studentUpdateSchema } from "@acme/db/schema/student"
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from ".";

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
    const data = await ctx.prisma.studentActionLog.findMany({
      where: {
        studentId: input.studentId,
        createdAt: {
          gte: input.date,
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
    .mutation(({ ctx, input }) => {
      return ctx.prisma.studentActionLog.create({
        data: {
          ...input,
          teacherId: ctx.auth.userId
        }
      })
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
