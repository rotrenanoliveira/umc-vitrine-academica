import type { FastifyReply } from 'fastify'
import { InstitutionNotFoundError } from '@/domain/institution/application/_errors/institution-not-found-error'
import type { ConfigureInstitutionDomainUseCase } from '@/domain/institution/application/use-cases/institution-settings/configure-institution-domain'
import { InstitutionSettingsPresenter } from '../../presenters/institution-settings-presenter'

interface ConfigureInstitutionDomainParams {
  institutionId: string
}

interface ConfigureInstitutionDomainBody {
  actorId: string
  domain?: string
}

export class ConfigureInstitutionDomainController {
  constructor(private readonly configureInstitutionDomain: ConfigureInstitutionDomainUseCase) {}

  async handle(
    { institutionId }: ConfigureInstitutionDomainParams,
    body: ConfigureInstitutionDomainBody,
    reply: FastifyReply,
  ) {
    const result = await this.configureInstitutionDomain.execute({
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
