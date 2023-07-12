import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const roleRouter = router({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.role.findMany();
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.role.delete({
        where: {
          id: input.id
        }
      })
    }
  ),
})
