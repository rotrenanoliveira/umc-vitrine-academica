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

export const projectStatusSchema = z.enum(['SKETCH', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'])

export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  authorId: z.string(),
  status: projectStatusSchema,
  attachments: z.array(z.string()),
  tags: z.array(z.string()),
  createdAt: z.string(),
})

export type Project = z.infer<typeof projectSchema>
export type ProjectStatus = z.infer<typeof projectStatusSchema>

export const projectScheduledSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  publishedIn: z.string(),
  createdAt: z.string(),
})

export type ProjectScheduled = z.infer<typeof projectScheduledSchema>
