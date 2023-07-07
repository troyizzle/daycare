import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const classCreateSchema = z.object({
  name: z.string().min(1).max(40)
})

export const classRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.class.findMany();
  }),
  create: protectedProcedure
    .input(classCreateSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.class.create({
        data: input
      });
    }
  ),
});
