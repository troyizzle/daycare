import { z } from "zod";

export const actionCreateSchema = z.object({
  name: z.string().min(1).max(40)
})

export type ActionCreateSchema = z.infer<typeof actionCreateSchema>
