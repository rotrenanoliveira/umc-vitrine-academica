import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { makeConfigureInstitutionDomainController } from '../../../factories/institution-settings/make-configure-institution-domain-controller'

const settingsResponseSchema = z.object({
  id: z.string(),
  institutionId: z.string(),
  shouldProof: z.boolean(),
  shouldVerify: z.boolean(),
  domain: z.string().nullable(),
  updatedAt: z.string().nullable(),
})

export async function configureInstitutionDomainRoute(app: FastifyInstance) {
  const controller = makeConfigureInstitutionDomainController()

  app.withTypeProvider<ZodTypeProvider>().put(
    '/institutions/:institutionId/domain',
    {
      schema: {
        tags: ['institutions'],
        summary: 'Configurar domínio da instituição',
        description: 'Configura o domínio institucional usado em verificações',
        params: z.object({
          institutionId: z.string().describe('O id da instituição'),
        }),
        body: z.object({
          actorId: z.string().min(1).describe('O id do usuário que está configurando'),
          domain: z.string().min(1).optional().describe('O domínio da instituição'),
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
