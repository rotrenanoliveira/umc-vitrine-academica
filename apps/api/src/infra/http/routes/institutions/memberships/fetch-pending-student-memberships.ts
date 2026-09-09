import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { makeFetchPendingStudentMembershipsController } from '../../../factories/institution-membership/make-fetch-pending-student-memberships-controller'

const memberResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  institutionId: z.string(),
  type: z.enum(['STUDENT', 'PROFESSOR', 'TEACHER', 'MANAGER', 'ADMINISTRATIVE_OFFICE']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'FINISHED', 'PENDING', 'REJECTED']),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export async function fetchPendingStudentMembershipsRoute(app: FastifyInstance) {
  const controller = makeFetchPendingStudentMembershipsController()

  app.withTypeProvider<ZodTypeProvider>().get(
    '/institutions/:institutionId/memberships/students/pending',
    {
      schema: {
        tags: ['institutions'],
        summary: 'Listar solicitações pendentes de estudantes',
        description: 'Lista vínculos de estudantes com status PENDING',
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
