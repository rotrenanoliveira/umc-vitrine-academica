import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { makeFetchInstitutionsController } from '../../factories/institution/make-fetch-institutions-controller'

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

export async function fetchInstitutionsRoute(app: FastifyInstance) {
  const fetchInstitutionsController = makeFetchInstitutionsController()

  app.withTypeProvider<ZodTypeProvider>().get(
    '/institutions',
    {
      schema: {
        tags: ['institutions'],
        summary: 'Buscar todas as instituições',
        description: 'Busca todas as instituições na aplicação',
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
      return fetchInstitutionsController.handle(reply)
    },
  )
}
