import { z } from "zod"

export const classCreateSchema = z.object({
  name: z.string().min(1).max(40)
})

export type ClassCreateInput = z.infer<typeof classCreateSchema>
