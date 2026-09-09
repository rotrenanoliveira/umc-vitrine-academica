import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { makeAddProfessorToInstitutionController } from '../../../factories/institution-membership/make-add-professor-to-institution-controller'

const memberResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  institutionId: z.string(),
  type: z.enum(['STUDENT', 'PROFESSOR', 'TEACHER', 'MANAGER', 'ADMINISTRATIVE_OFFICE']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'FINISHED', 'PENDING', 'REJECTED']),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export async function addProfessorToInstitutionRoute(app: FastifyInstance) {
  const controller = makeAddProfessorToInstitutionController()

  app.withTypeProvider<ZodTypeProvider>().post(
    '/institutions/:institutionId/professors',
    {
      schema: {
        tags: ['institutions'],
        summary: 'Adicionar professor à instituição',
        description: 'Adiciona um professor à instituição (requer permissão de gestão)',
        params: z.object({ institutionId: z.string() }),
        body: z.object({
          userId: z.string().min(1),
          actorId: z.string().min(1),
        }),
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
