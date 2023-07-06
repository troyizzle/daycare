import { z } from "zod";

export const babyCreateSchema = z.object({
  firstName: z.string().min(1).max(40),
  lastName: z.string().min(1).max(40),
})

export type BabyCreateSchema = z.infer<typeof babyCreateSchema>
