import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { makeRegisterInstitutionSettingsController } from '../../../factories/institution-settings/make-register-institution-settings-controller'

const settingsResponseSchema = z.object({
  id: z.string(),
  institutionId: z.string(),
  shouldProof: z.boolean(),
  shouldVerify: z.boolean(),
  domain: z.string().nullable(),
  updatedAt: z.string().nullable(),
})

export async function registerInstitutionSettingsRoute(app: FastifyInstance) {
  const controller = makeRegisterInstitutionSettingsController()

  app.withTypeProvider<ZodTypeProvider>().post(
    '/institutions/:institutionId/settings',
    {
      schema: {
        tags: ['institutions'],
        summary: 'Registrar configurações da instituição',
        description: 'Registra as configurações iniciais de uma instituição',
        params: z.object({
          institutionId: z.string().describe('O id da instituição'),
        }),
        body: z.object({
          shouldProof: z.boolean().describe('Se a instituição exige comprovação'),
          shouldVerify: z.boolean().describe('Se a instituição exige verificação'),
        }),
        response: {
          201: z.object({ settings: settingsResponseSchema }),
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
