import type { FastifyReply } from 'fastify'
import { InstitutionNotFoundError } from '@/domain/institution/application/_errors/institution-not-found-error'
import type { FetchPendingProfessorMembershipsUseCase } from '@/domain/institution/application/use-cases/institution-membership/fetch-pending-professor-memberships'
import { InstitutionMemberPresenter } from '../../presenters/institution-member-presenter'

interface Params {
  institutionId: string
}

interface Query {
  actorId: string
}

export class FetchPendingProfessorMembershipsController {
  constructor(private readonly useCase: FetchPendingProfessorMembershipsUseCase) {}

  async handle({ institutionId }: Params, { actorId }: Query, reply: FastifyReply) {
    const result = await this.useCase.execute({ institutionId, actorId })

    if (result.isLeft()) {
      if (result.value instanceof InstitutionNotFoundError) {
        return reply.status(404).send({ message: result.value.message })
      }

      return reply.status(400).send({ message: result.value.message })
    }

    return reply.status(200).send({
      members: result.value.members.map(InstitutionMemberPresenter.toHTTP),
    })
  }
}
