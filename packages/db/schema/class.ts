import { z } from "zod"

export const classCreateSchema = z.object({
  name: z.string({
    required_error: "Name is required"
  }).min(1).max(40)
})

export type ClassCreateInput = z.infer<typeof classCreateSchema>

export const classUpdateSchema = classCreateSchema.extend({
  id: z.string(),
  teachers: z.array(z.object({
    id: z.string()
  })
  )
})

export type ClassUpdateInput = z.infer<typeof classUpdateSchema>

