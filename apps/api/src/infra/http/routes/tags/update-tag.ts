import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { makeUpdateTagController } from '../../factories/tag/make-update-tag-controller'

export async function updateTagRoute(app: FastifyInstance) {
  const updateTagController = makeUpdateTagController()

  app.withTypeProvider<ZodTypeProvider>().put(
    '/tags/:tagId',
    {
      schema: {
        tags: ['tags'],
        summary: 'Atualiza uma tag',
        description: 'A uma nova tag na aplicação',
        params: z.object({
          tagId: z.string().describe('O id da tag'),
        }),
        body: z.object({
          status: z.enum(['ACTIVE', 'INACTIVE']).describe('O status da tag'),
        }),
        response: {
          201: z.object({
            tag: z.object({
              id: z.string(),
              name: z.string(),
              slug: z.string(),
              status: z.enum(['ACTIVE', 'INACTIVE']),
            }),
          }),
          409: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      return updateTagController.handle(request.params, request.body, reply)
    },
  )
}
