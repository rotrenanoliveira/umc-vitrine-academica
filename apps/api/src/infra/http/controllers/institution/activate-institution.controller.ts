import type { FastifyReply } from 'fastify'
import { InstitutionNotFoundError } from '@/domain/institution/application/_errors/institution-not-found-error'
import type { ActivateInstitutionUseCase } from '@/domain/institution/application/use-cases/institution/activate-institution'
import { InstitutionPresenter } from '../../presenters/institution-presenter'

interface ActivateInstitutionParams {
  institutionId: string
}

interface ActivateInstitutionBody {
  actorId: string
}

export class ActivateInstitutionController {
  constructor(private readonly activateInstitution: ActivateInstitutionUseCase) {}

  async handle(
    { institutionId }: ActivateInstitutionParams,
    { actorId }: ActivateInstitutionBody,
    reply: FastifyReply,
  ) {
    const result = await this.activateInstitution.execute({
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
