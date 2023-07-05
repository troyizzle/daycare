import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const babyRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.baby.findMany();
  }),
  byId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.post.findFirst({ where: { id: input } });
  }),
  create: protectedProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({ data: input });
    }),
});
