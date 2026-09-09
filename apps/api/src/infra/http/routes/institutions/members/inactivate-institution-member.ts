import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { makeInactivateInstitutionMemberController } from '../../../factories/institution-membership/make-inactivate-institution-member-controller'

const memberResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  institutionId: z.string(),
  type: z.enum(['STUDENT', 'PROFESSOR', 'TEACHER', 'MANAGER', 'ADMINISTRATIVE_OFFICE']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'FINISHED', 'PENDING', 'REJECTED']),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export async function inactivateInstitutionMemberRoute(app: FastifyInstance) {
  const controller = makeInactivateInstitutionMemberController()

  app.withTypeProvider<ZodTypeProvider>().put(
    '/institutions/members/:memberId/inactivate',
    {
      schema: {
        tags: ['institutions'],
        summary: 'Inativar membro',
        description: 'Inativar membro da instituição (requer permissão de gestão)',
        params: z.object({ memberId: z.string() }),
        body: z.object({ actorId: z.string().min(1) }),
        response: {
          200: z.object({ member: memberResponseSchema }),
          400: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => controller.handle(request.params, request.body, reply),
  )
}
