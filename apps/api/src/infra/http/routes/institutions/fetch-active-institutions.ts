import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { makeFetchActiveInstitutionsController } from '../../factories/institution/make-fetch-active-institutions-controller'

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

export async function fetchActiveInstitutionsRoute(app: FastifyInstance) {
  const fetchActiveInstitutionsController = makeFetchActiveInstitutionsController()

  app.withTypeProvider<ZodTypeProvider>().get(
    '/institutions/active',
    {
      schema: {
        tags: ['institutions'],
        summary: 'Buscar instituições ativas',
        description: 'Busca todas as instituições com status ACTIVE',
        response: {
          200: z.object({
            institutions: z.array(institutionResponseSchema),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (_, reply) => {
      return fetchActiveInstitutionsController.handle(reply)
    },
  )
}
