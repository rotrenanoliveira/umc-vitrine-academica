import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { makeEditInstitutionController } from '../../factories/institution/make-edit-institution-controller'

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

export async function editInstitutionRoute(app: FastifyInstance) {
  const editInstitutionController = makeEditInstitutionController()

  app.withTypeProvider<ZodTypeProvider>().put(
    '/institutions/:institutionId',
    {
      schema: {
        tags: ['institutions'],
        summary: 'Editar uma instituição',
        description: 'Edita os dados de uma instituição existente',
        params: z.object({
          institutionId: z.string().describe('O id da instituição'),
        }),
        body: z.object({
          actorId: z.string().min(1).describe('O id do usuário que está editando'),
          name: z.string().min(1).optional().describe('O novo nome da instituição'),
          slug: z.string().min(1).optional().describe('O novo slug da instituição'),
          description: z.string().min(1).optional().describe('A nova descrição da instituição'),
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
          409: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      return editInstitutionController.handle(request.params, request.body, reply)
    },
  )
}
