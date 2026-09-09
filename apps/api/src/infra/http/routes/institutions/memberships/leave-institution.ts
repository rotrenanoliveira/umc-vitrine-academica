import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { makeLeaveInstitutionController } from '../../../factories/institution-membership/make-leave-institution-controller'

const memberResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  institutionId: z.string(),
  type: z.enum(['STUDENT', 'PROFESSOR', 'TEACHER', 'MANAGER', 'ADMINISTRATIVE_OFFICE']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'FINISHED', 'PENDING', 'REJECTED']),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export async function leaveInstitutionRoute(app: FastifyInstance) {
  const controller = makeLeaveInstitutionController()

  app.withTypeProvider<ZodTypeProvider>().post(
    '/institutions/:institutionId/leave',
    {
      schema: {
        tags: ['institutions'],
        summary: 'Sair da instituição',
        description: 'Finaliza o vínculo do usuário com a instituição',
        params: z.object({ institutionId: z.string() }),
        body: z.object({ userId: z.string().min(1) }),
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
