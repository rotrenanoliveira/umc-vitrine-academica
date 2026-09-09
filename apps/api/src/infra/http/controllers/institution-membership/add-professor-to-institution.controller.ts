import type { FastifyReply } from 'fastify'
import { InstitutionNotFoundError } from '@/domain/institution/application/_errors/institution-not-found-error'
import { UserAlreadyMemberOfInstitutionError } from '@/domain/institution/application/_errors/user-already-member-of-institution-error'
import type { AddProfessorToInstitutionUseCase } from '@/domain/institution/application/use-cases/institution-membership/add-professor-to-institution'
import { InstitutionMemberPresenter } from '../../presenters/institution-member-presenter'

interface Params {
  institutionId: string
}

interface Body {
  userId: string
  actorId: string
}

export class AddProfessorToInstitutionController {
  constructor(private readonly useCase: AddProfessorToInstitutionUseCase) {}

  async handle({ institutionId }: Params, body: Body, reply: FastifyReply) {
    const result = await this.useCase.execute({ institutionId, ...body })

    if (result.isLeft()) {
      if (result.value instanceof InstitutionNotFoundError) {
        return reply.status(404).send({ message: result.value.message })
      }

      if (result.value instanceof UserAlreadyMemberOfInstitutionError) {
        return reply.status(409).send({ message: result.value.message })
      }

      return reply.status(400).send({ message: result.value.message })
    }

    return reply.status(201).send({
      member: InstitutionMemberPresenter.toHTTP(result.value.member),
    })
  }
}
