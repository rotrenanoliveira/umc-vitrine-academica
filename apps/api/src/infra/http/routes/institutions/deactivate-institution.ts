import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { makeDeactivateInstitutionController } from '../../factories/institution/make-deactivate-institution-controller'

const institutionResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  type: z.enum(['UNIVERSITY', 'COLLEGE', 'CENTER', 'TECHNICAL_COLLEGE', 'OTHER']),
  status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'ARCHIVED']),
  origin: z.enum(['SEED', 'USER_REGISTRATION', 'ADMIN']),
  description: z.string(),
  registerBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export async function deactivateInstitutionRoute(app: FastifyInstance) {
  const deactivateInstitutionController = makeDeactivateInstitutionController()

  app.withTypeProvider<ZodTypeProvider>().put(
    '/institutions/:institutionId/deactivate',
    {
      schema: {
        tags: ['institutions'],
        summary: 'Desativar uma instituição',
        description: 'Desativa uma instituição existente',
        params: z.object({
          institutionId: z.string().describe('O id da instituição'),
        }),
        body: z.object({
          actorId: z.string().min(1).describe('O id do usuário que está desativando'),
        }),
        response: {
          200: z.object({
            institution: institutionResponseSchema,
          }),
          400: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      return deactivateInstitutionController.handle(request.params, request.body, reply)
    },
  )
}
