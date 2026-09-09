import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { makeUpdateInstitutionSettingsController } from '../../../factories/institution-settings/make-update-institution-settings-controller'

const settingsResponseSchema = z.object({
  id: z.string(),
  institutionId: z.string(),
  shouldProof: z.boolean(),
  shouldVerify: z.boolean(),
  domain: z.string().nullable(),
  updatedAt: z.string().nullable(),
})

export async function updateInstitutionSettingsRoute(app: FastifyInstance) {
  const controller = makeUpdateInstitutionSettingsController()

  app.withTypeProvider<ZodTypeProvider>().put(
    '/institutions/:institutionId/settings',
    {
      schema: {
        tags: ['institutions'],
        summary: 'Atualizar configurações da instituição',
        description: 'Atualiza as flags de comprovação e verificação da instituição',
        params: z.object({
          institutionId: z.string().describe('O id da instituição'),
        }),
        body: z.object({
          actorId: z.string().min(1).describe('O id do usuário que está atualizando'),
          shouldProof: z.boolean().describe('Se a instituição exige comprovação'),
          shouldVerify: z.boolean().describe('Se a instituição exige verificação'),
        }),
        response: {
          200: z.object({ settings: settingsResponseSchema }),
          400: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      return controller.handle(request.params, request.body, reply)
    },
  )
}
