import type { FastifyReply } from 'fastify'
import { InstitutionNotFoundError } from '@/domain/institution/application/_errors/institution-not-found-error'
import type { DeactivateInstitutionUseCase } from '@/domain/institution/application/use-cases/institution/deactivate-institution'
import { InstitutionPresenter } from '../../presenters/institution-presenter'

interface DeactivateInstitutionParams {
  institutionId: string
}

interface DeactivateInstitutionBody {
  actorId: string
}

export class DeactivateInstitutionController {
  constructor(private readonly deactivateInstitution: DeactivateInstitutionUseCase) {}

  async handle(
    { institutionId }: DeactivateInstitutionParams,
    { actorId }: DeactivateInstitutionBody,
    reply: FastifyReply,
  ) {
    const result = await this.deactivateInstitution.execute({
      institutionId,
      actorId,
    })

    if (result.isLeft()) {
      if (result.value instanceof InstitutionNotFoundError) {
        return reply.status(404).send({
          message: result.value.message,
        })
      }

      return reply.status(400).send({
        message: result.value.message,
      })
    }

    return reply.status(200).send({
      institution: InstitutionPresenter.toHTTP(result.value.institution),
    })
  }
}
