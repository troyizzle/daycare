import { z } from "zod";

export const studentProfilePictureSchema = z.object({
  id: z.string(),
  profilePicture: z.string()
})

export type StudentProfilePictureInput = z.infer<typeof studentProfilePictureSchema>

export const studentUpdateSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  profilePicture: z.string().nullable(),
})

export type StudentUpdateInput = z.infer<typeof studentUpdateSchema>


