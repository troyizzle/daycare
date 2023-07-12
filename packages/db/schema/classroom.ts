import { z } from "zod"

export const classroomCreateSchema = z.object({
  name: z.string({
    required_error: "Name is required"
  }).min(1).max(40)
})

export type ClassroomCreateInput = z.infer<typeof classroomCreateSchema>

export const classroomUpdateSchema = classroomCreateSchema.extend({
  id: z.string(),
  teachers: z.array(z.object({
    id: z.string()
  })
  )
})

export type ClassroomUpdateInput = z.infer<typeof classroomUpdateSchema>

