import { router, publicProcedure, protectedProcedure } from "../trpc";
import { classroomCreateSchema, classroomUpdateSchema } from "../../../db/schema/classroom";
import { z } from "zod";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from ".";

export type ClassroomByIdResponse = inferProcedureOutput<AppRouter["classroom"]["byId"]>;

export const classroomRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.classroom.findMany({
      orderBy: {
        name: 'asc'
      }
    });
  }),
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.classroom.findUnique({
        where: {
          id: input.id,
        },
        include: {
          teachers: true
        }
      });
    }),
  create: protectedProcedure
    .input(classroomCreateSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.classroom.create({
        data: input
      });
    }
    ),
  update: protectedProcedure
    .input(classroomUpdateSchema)
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      const { teachers, ...rest } = data;

      try {
        return ctx.prisma.classroom.update({
          where: { id },
          data: {
            ...rest,
            teachers: {
              deleteMany: {},
              create: teachers.map(teacher => {
                return {
                  teacherId: teacher
                }
              })
            }
          }
        })
      } catch (e) {
        console.error(e)
      }
    }
    ),
});
