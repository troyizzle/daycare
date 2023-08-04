import { z  } from "zod"

export const contactInformationNewSchema = z.object({
  firstName: z.string({
    required_error: "First name is required"
  }),
  lastName: z.string({
    required_error: "Last name is required"
  }),
  phone: z.string({
    required_error: "Phone is required"
  }),
  email: z.string({
    required_error: "Email is required"
  })
})

export type ContactInformationNewInput = z.infer<typeof contactInformationNewSchema>
