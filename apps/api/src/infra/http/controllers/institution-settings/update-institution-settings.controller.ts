import type { FastifyReply } from 'fastify'
import { InstitutionNotFoundError } from '@/domain/institution/application/_errors/institution-not-found-error'
import type { UpdateInstitutionSettingsUseCase } from '@/domain/institution/application/use-cases/institution-settings/update-institution-settings'
import { InstitutionSettingsPresenter } from '../../presenters/institution-settings-presenter'

interface UpdateInstitutionSettingsParams {
  institutionId: string
}

interface UpdateInstitutionSettingsBody {
  actorId: string
  shouldProof: boolean
  shouldVerify: boolean
}

export class UpdateInstitutionSettingsController {
  constructor(private readonly updateInstitutionSettings: UpdateInstitutionSettingsUseCase) {}

  async handle(
    { institutionId }: UpdateInstitutionSettingsParams,
    body: UpdateInstitutionSettingsBody,
    reply: FastifyReply,
  ) {
    const result = await this.updateInstitutionSettings.execute({
      institutionId,
      ...body,
    })

    if (result.isLeft()) {
      if (result.value instanceof InstitutionNotFoundError) {
        return reply.status(404).send({ message: result.value.message })
      }

      return reply.status(400).send({ message: result.value.message })
    }

    return reply.status(200).send({
      settings: InstitutionSettingsPresenter.toHTTP(result.value.settings),
    })
  }
}
