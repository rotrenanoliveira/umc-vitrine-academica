import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { InstitutionType } from '@/domain/institution/enterprise/entities/institution'
import { makeRegisterInstitutionController } from '../../factories/institution/make-register-institution-controller'

const institutionResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  type: z.enum(InstitutionType),
  status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'ARCHIVED']),
  origin: z.enum(['SEED', 'USER_REGISTRATION', 'ADMIN']),
  description: z.string(),
  registerBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

const settingsResponseSchema = z.object({
  id: z.string(),
  institutionId: z.string(),
  shouldProof: z.boolean(),
  shouldVerify: z.boolean(),
  domain: z.string().nullable(),
  updatedAt: z.string().nullable(),
})

export async function registerInstitutionRoute(app: FastifyInstance) {
  const registerInstitutionController = makeRegisterInstitutionController()

  app.withTypeProvider<ZodTypeProvider>().post(
    '/institutions',
    {
      schema: {
        tags: ['institutions'],
        summary: 'Registrar uma nova instituição',
        description: 'Registra uma nova instituição e suas configurações padrão',
        body: z.object({
          name: z.string().min(1).describe('O nome da instituição'),
          type: z.enum(InstitutionType).describe('O tipo da instituição'),
          description: z.string().min(1).describe('A descrição da instituição'),
          registeredBy: z.string().min(1).describe('O id do usuário que registrou a instituição'),
          shouldProof: z.boolean().optional().describe('Se a instituição exige comprovação'),
          shouldVerify: z.boolean().optional().describe('Se a instituição exige verificação'),
        }),
        response: {
          201: z.object({
            institution: institutionResponseSchema,
            settings: settingsResponseSchema,
          }),
          400: z.object({
            message: z.string(),
          }),
          409: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      return registerInstitutionController.handle(request.body, reply)
    },
  )
}
