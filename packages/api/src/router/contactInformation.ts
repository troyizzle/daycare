import { z } from "zod"
import { router, protectedProcedure } from "../trpc"

export const contactInformationRouter = router({
  allByStudentId: protectedProcedure.input(
    z.object({
      studentId: z.string(),
    })
  ).query(({ ctx, input }) => {
    return ctx.prisma.contactInformation.findMany({
      where: {
        studentId: input.studentId
      }
    })
  }),
})

