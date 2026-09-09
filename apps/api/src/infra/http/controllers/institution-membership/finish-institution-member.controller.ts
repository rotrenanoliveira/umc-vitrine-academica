import type { FastifyReply } from 'fastify'
import { InstitutionMemberNotFoundError } from '@/domain/institution/application/_errors/institution-member-not-found-error'
import type { FinishInstitutionMemberUseCase } from '@/domain/institution/application/use-cases/institution-membership/finish-institution-member'
import { InstitutionMemberPresenter } from '../../presenters/institution-member-presenter'

interface Params {
  memberId: string
}

interface Body {
  actorId: string
}

export class FinishInstitutionMemberController {
  constructor(private readonly useCase: FinishInstitutionMemberUseCase) {}

  async handle({ memberId }: Params, { actorId }: Body, reply: FastifyReply) {
    const result = await this.useCase.execute({ memberId, actorId })

    if (result.isLeft()) {
      if (result.value instanceof InstitutionMemberNotFoundError) {
        return reply.status(404).send({ message: result.value.message })
      }

      return reply.status(400).send({ message: result.value.message })
    }

    return reply.status(200).send({
      member: InstitutionMemberPresenter.toHTTP(result.value.member),
    })
  }
}
