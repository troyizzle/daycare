import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

const actionCreateSchema = z.object({
  name: z.string().min(1).max(40)
})

export const actionRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.action.findMany();
  }),
  create: protectedProcedure
    .input(actionCreateSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.action.create({
        data: input
      });
    }
  ),
});
