import type { FastifyReply } from 'fastify'
import { InstitutionNotFoundError } from '@/domain/institution/application/_errors/institution-not-found-error'
import type { RegisterInstitutionSettingsUseCase } from '@/domain/institution/application/use-cases/institution-settings/register-institution-settings'
import { InstitutionSettingsPresenter } from '../../presenters/institution-settings-presenter'

interface RegisterInstitutionSettingsParams {
  institutionId: string
}

interface RegisterInstitutionSettingsBody {
  shouldProof: boolean
  shouldVerify: boolean
}

export class RegisterInstitutionSettingsController {
  constructor(private readonly registerInstitutionSettings: RegisterInstitutionSettingsUseCase) {}

  async handle(
    { institutionId }: RegisterInstitutionSettingsParams,
    body: RegisterInstitutionSettingsBody,
    reply: FastifyReply,
  ) {
    const result = await this.registerInstitutionSettings.execute({
      institutionId,
      ...body,
    })

    if (result.isLeft()) {
      if (result.value instanceof InstitutionNotFoundError) {
        return reply.status(404).send({ message: result.value.message })
      }

      throw result.value
    }

    return reply.status(201).send({
      settings: InstitutionSettingsPresenter.toHTTP(result.value.settings),
    })
  }
}
