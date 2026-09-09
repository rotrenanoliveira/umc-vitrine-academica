import type { FastifyReply } from 'fastify'
import { InstitutionNotFoundError } from '@/domain/institution/application/_errors/institution-not-found-error'
import { UserAlreadyMemberOfInstitutionError } from '@/domain/institution/application/_errors/user-already-member-of-institution-error'
import type { RequestProfessorMembershipUseCase } from '@/domain/institution/application/use-cases/institution-membership/request-professor-membership'
import { InstitutionMemberPresenter } from '../../presenters/institution-member-presenter'

interface Params {
  institutionId: string
}

interface Body {
  userId: string
}

export class RequestProfessorMembershipController {
  constructor(private readonly useCase: RequestProfessorMembershipUseCase) {}

  async handle({ institutionId }: Params, { userId }: Body, reply: FastifyReply) {
    const result = await this.useCase.execute({ institutionId, userId })

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
