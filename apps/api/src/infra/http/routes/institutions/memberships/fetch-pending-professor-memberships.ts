import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { makeFetchPendingProfessorMembershipsController } from '../../../factories/institution-membership/make-fetch-pending-professor-memberships-controller'

const memberResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  institutionId: z.string(),
  type: z.enum(['STUDENT', 'PROFESSOR', 'TEACHER', 'MANAGER', 'ADMINISTRATIVE_OFFICE']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'FINISHED', 'PENDING', 'REJECTED']),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export async function fetchPendingProfessorMembershipsRoute(app: FastifyInstance) {
  const controller = makeFetchPendingProfessorMembershipsController()

  app.withTypeProvider<ZodTypeProvider>().get(
    '/institutions/:institutionId/memberships/professors/pending',
    {
      schema: {
        tags: ['institutions'],
        summary: 'Listar solicitações pendentes de professores',
        description: 'Lista vínculos de professores com status PENDING',
        params: z.object({ institutionId: z.string() }),
        querystring: z.object({ actorId: z.string().min(1) }),
        response: {
          200: z.object({ members: z.array(memberResponseSchema) }),
          400: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => controller.handle(request.params, request.query, reply),
  )
}
