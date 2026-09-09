import type { FastifyReply } from 'fastify'
import { InstitutionAlreadyExistsError } from '@/domain/institution/application/_errors/institution-already-exists-error'
import { InstitutionNotFoundError } from '@/domain/institution/application/_errors/institution-not-found-error'
import type { EditInstitutionUseCase } from '@/domain/institution/application/use-cases/institution/edit-institution'
import { InstitutionPresenter } from '../../presenters/institution-presenter'

interface EditInstitutionParams {
  institutionId: string
}

interface EditInstitutionBody {
  actorId: string
  name?: string
  slug?: string
  description?: string
}

export class EditInstitutionController {
  constructor(private readonly editInstitution: EditInstitutionUseCase) {}

  async handle({ institutionId }: EditInstitutionParams, body: EditInstitutionBody, reply: FastifyReply) {
    const result = await this.editInstitution.execute({
      institutionId,
      ...body,
    })

    if (result.isLeft()) {
      if (result.value instanceof InstitutionNotFoundError) {
        return reply.status(404).send({
          message: result.value.message,
        })
      }

      if (result.value instanceof InstitutionAlreadyExistsError) {
        return reply.status(409).send({
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
