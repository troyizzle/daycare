import { router, protectedProcedure, publicProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs"
import { z } from "zod";
import { isClerkAPIResponseError } from "@clerk/nextjs"
import { inferProcedureOutput, TRPCError } from "@trpc/server";
import { userCreateSchema, userUpdateSchema } from "../../../db/schema/user"
import { AppRouter } from ".";
import { Student } from ".prisma/client";

export type UserAllResponse = inferProcedureOutput<AppRouter['user']['all']>
export type UserByIdResponse = inferProcedureOutput<AppRouter['user']['byId']>

export const userRouter = router({
  all: protectedProcedure.query(async ({ ctx }) => {
    const users = await clerkClient.users.getUserList()
    const userIds = users.map(user => user.id)

    const userRoles = await ctx.prisma.userRole.findMany({
      where: {
        userId: {
          in: userIds
        }
      },
      include: {
        role: true
      }
    })

    const children = await ctx.prisma.parentStudent.findMany({
      where: {
        userId: {
          in: userIds
        }
      }
    })


    return users.map(user => {
      return {
        ...user,
        roles: userRoles.filter(userRole => userRole.userId === user.id).map(userRole => userRole.role.name),
        childrenCount: children.filter(child => child.userId === user.id).length
      }
    })
  }),
  byId: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ ctx, input }) => {
      console.log("AUTH!!!!!!", ctx.auth)
      try {
        const user = await clerkClient.users.getUser(input.id)

        const roles = await ctx.prisma.userRole.findMany({
          where: {
            userId: user.id
          },
          include: {
            role: true
          }
        })

        const children = await ctx.prisma.parentStudent.findMany({
          where: {
            userId: user.id
          },
          include: {
            student: true
          }
        })

        const classroomIds = await ctx.prisma.classroomTeachers.findMany({
          where: {
            teacherId: user.id
          },
          select: {
            classroomId: true
          }
        })

        return {
          ...user,
          roles: roles,
          children: children,
          students: classroomIds.length == 0 ? null :
            await ctx.prisma.classroomStudents.findMany({
              where: {
                classroomId: {
                  in: classroomIds.map(record => record.classroomId)
                }
              },
              include: {
                student: true
              }
            })
        }
      } catch (err) {
        if (isClerkAPIResponseError(err)) {
          console.log(err)
          if (err.status === 404) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'User not found',
            })
          }

          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Internal server error',
          })

        }
      }
    }),
  create: protectedProcedure
    .input(userCreateSchema)
    .mutation(async ({ input }) => {
      try {
        const user = await clerkClient.users.createUser({
          firstName: input.firstName,
          lastName: input.lastName,
          emailAddress: [input.email],
          phoneNumber: [input.phoneNumber],
        })

        return user
      } catch (e) {
        if (isClerkAPIResponseError(e)) {
          console.log(e)
        }
      }
    }),
  update: protectedProcedure
    .input(userUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await clerkClient.users.updateUser(input.id, {
          firstName: input.firstName,
          lastName: input.lastName,
        })

        await ctx.prisma.userRole.deleteMany({
          where: {
            userId: user.id
          }
        })

        await ctx.prisma.userRole.createMany({
          data: input.roles.map(role => {
            return {
              userId: user.id,
              roleId: role
            }
          })
        })

        await ctx.prisma.parentStudent.deleteMany({
          where: {
            userId: user.id
          }
        })

        await ctx.prisma.parentStudent.createMany({
          data: input.children.map(child => {
            return {
              userId: user.id,
              studentId: child
            }
          })
        })

        return user
      } catch (err) {
        if (isClerkAPIResponseError(err)) {
          if (err.status === 404) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'User not found',
            })
          }
        }
      }
    }),
})
