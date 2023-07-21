import { z } from "zod";
import { contactInformationNewSchema } from "./contactInformation";

export const studentNewSchema = z.object({
  firstName: z.string({
    required_error: "First name is required"
  }),
  lastName: z.string({
    required_error: "Last name is required"
  }),
  dob: z.date({
    required_error: "Date of birth is required"
  })
})

export type StudentNewInput = z.infer<typeof studentNewSchema>

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
  dob: z.date({
    required_error: "Date of birth is required"
  }),
  ContactInformation: z.array(contactInformationNewSchema).optional()
})

export type StudentUpdateInput = z.infer<typeof studentUpdateSchema>


