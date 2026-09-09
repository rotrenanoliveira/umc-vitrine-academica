import type { FastifyReply } from 'fastify'
import { InstitutionAlreadyExistsError } from '@/domain/institution/application/_errors/institution-already-exists-error'
import type { RegisterInstitutionUseCase } from '@/domain/institution/application/use-cases/institution/register-institution'
import type { InstitutionType } from '@/domain/institution/enterprise/entities/institution'
import { InstitutionPresenter } from '../../presenters/institution-presenter'
import { InstitutionSettingsPresenter } from '../../presenters/institution-settings-presenter'

interface RegisterInstitutionBody {
  name: string
  type: InstitutionType
  description: string
  registeredBy: string
  shouldProof?: boolean
  shouldVerify?: boolean
}

export class RegisterInstitutionController {
  constructor(private readonly registerInstitution: RegisterInstitutionUseCase) {}

  async handle(body: RegisterInstitutionBody, reply: FastifyReply) {
    const result = await this.registerInstitution.execute(body)

    if (result.isLeft()) {
      const status = result.value instanceof InstitutionAlreadyExistsError ? 409 : 400

      return reply.status(status).send({
        message: result.value.message,
      })
    }

    return reply.status(201).send({
      institution: InstitutionPresenter.toHTTP(result.value.institution),
      settings: InstitutionSettingsPresenter.toHTTP(result.value.settings),
    })
  }
}
