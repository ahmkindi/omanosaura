import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.email(),
  subject: z.string().min(1).max(300),
  message: z.string().min(1).max(5000),
})

export type ContactInput = z.infer<typeof contactSchema>
