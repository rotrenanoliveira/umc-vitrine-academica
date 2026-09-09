import type { FastifyReply } from 'fastify'
import { InstitutionMemberNotFoundError } from '@/domain/institution/application/_errors/institution-member-not-found-error'
import { InstitutionNotFoundError } from '@/domain/institution/application/_errors/institution-not-found-error'
import type { LeaveInstitutionUseCase } from '@/domain/institution/application/use-cases/institution-membership/leave-institution'
import { InstitutionMemberPresenter } from '../../presenters/institution-member-presenter'

interface Params {
  institutionId: string
}

interface Body {
  userId: string
}

export class LeaveInstitutionController {
  constructor(private readonly leaveInstitution: LeaveInstitutionUseCase) {}

  async handle({ institutionId }: Params, { userId }: Body, reply: FastifyReply) {
    const result = await this.leaveInstitution.execute({ institutionId, userId })

    if (result.isLeft()) {
      if (result.value instanceof InstitutionNotFoundError || result.value instanceof InstitutionMemberNotFoundError) {
        return reply.status(404).send({ message: result.value.message })
      }

      throw result.value
    }

    return reply.status(200).send({
      member: InstitutionMemberPresenter.toHTTP(result.value.member),
    })
  }
}
