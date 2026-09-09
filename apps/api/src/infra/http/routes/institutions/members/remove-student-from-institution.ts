import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { makeRemoveStudentFromInstitutionController } from '../../../factories/institution-membership/make-remove-student-from-institution-controller'

const memberResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  institutionId: z.string(),
  type: z.enum(['STUDENT', 'PROFESSOR', 'TEACHER', 'MANAGER', 'ADMINISTRATIVE_OFFICE']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'FINISHED', 'PENDING', 'REJECTED']),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export async function removeStudentFromInstitutionRoute(app: FastifyInstance) {
  const controller = makeRemoveStudentFromInstitutionController()

  app.withTypeProvider<ZodTypeProvider>().put(
    '/institutions/members/:memberId/students/remove',
    {
      schema: {
        tags: ['institutions'],
        summary: 'Remover estudante da instituição',
        description: 'Altera o status de um membro estudante (INACTIVE, FINISHED ou SUSPENDED)',
        params: z.object({ memberId: z.string() }),
        body: z.object({
          actorId: z.string().min(1),
          status: z.enum(['INACTIVE', 'FINISHED', 'SUSPENDED']),
        }),
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
