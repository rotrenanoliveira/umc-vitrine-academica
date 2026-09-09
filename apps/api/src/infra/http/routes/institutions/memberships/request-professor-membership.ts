import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { makeRequestProfessorMembershipController } from '../../../factories/institution-membership/make-request-professor-membership-controller'

const memberResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  institutionId: z.string(),
  type: z.enum(['STUDENT', 'PROFESSOR', 'TEACHER', 'MANAGER', 'ADMINISTRATIVE_OFFICE']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'FINISHED', 'PENDING', 'REJECTED']),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export async function requestProfessorMembershipRoute(app: FastifyInstance) {
  const controller = makeRequestProfessorMembershipController()

  app.withTypeProvider<ZodTypeProvider>().post(
    '/institutions/:institutionId/memberships/professors',
    {
      schema: {
        tags: ['institutions'],
        summary: 'Solicitar vínculo de professor',
        description: 'Solicita ingresso como professor na instituição',
        params: z.object({ institutionId: z.string() }),
        body: z.object({ userId: z.string().min(1) }),
        response: {
          201: z.object({ member: memberResponseSchema }),
          400: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
          409: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => controller.handle(request.params, request.body, reply),
  )
}
