import { z } from 'zod'

export const userStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'PENDING', 'BLOCKED', 'DELETED'])

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  status: userStatusSchema,
  accountId: z.string(),
})

export type User = z.infer<typeof userSchema>
