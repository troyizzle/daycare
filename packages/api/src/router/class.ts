import { router, publicProcedure, protectedProcedure } from "../trpc";
import { classCreateSchema, classUpdateSchema } from "../../../db/schema/class";
import { z } from "zod";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from ".";

export type ClassByIdResponse = inferProcedureOutput<AppRouter["class"]["byId"]>;

export const classRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.class.findMany();
  }),
  byId: protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.prisma.class.findUnique({
      where: {
        id: input.id,
      },
      include: {
        teachers: true
      }
    });
  }),
  create: protectedProcedure
    .input(classCreateSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.class.create({
        data: input
      });
    }
  ),
  update: protectedProcedure
    .input(classUpdateSchema)
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;

      return ctx.prisma.class.update({
        where: { id },
        data: {
          data
        }
      });
    }
  ),
});
