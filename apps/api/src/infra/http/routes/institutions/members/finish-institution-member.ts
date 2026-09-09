import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { makeFinishInstitutionMemberController } from '../../../factories/institution-membership/make-finish-institution-member-controller'

const memberResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  institutionId: z.string(),
  type: z.enum(['STUDENT', 'PROFESSOR', 'TEACHER', 'MANAGER', 'ADMINISTRATIVE_OFFICE']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'FINISHED', 'PENDING', 'REJECTED']),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export async function finishInstitutionMemberRoute(app: FastifyInstance) {
  const controller = makeFinishInstitutionMemberController()

  app.withTypeProvider<ZodTypeProvider>().put(
    '/institutions/members/:memberId/finish',
    {
      schema: {
        tags: ['institutions'],
        summary: 'Finalizar membro',
        description: 'Finalizar membro da instituição (requer permissão de gestão)',
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
