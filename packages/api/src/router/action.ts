import { router, publicProcedure } from "../trpc";

export const actionRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.action.findMany();
  }),
});
