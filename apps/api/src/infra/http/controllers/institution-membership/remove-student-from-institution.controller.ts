import type { FastifyReply } from 'fastify'
import { InstitutionMemberNotFoundError } from '@/domain/institution/application/_errors/institution-member-not-found-error'
import type { RemoveStudentFromInstitutionUseCase } from '@/domain/institution/application/use-cases/institution-membership/remove-student-from-institution'
import type { InstitutionMemberStatus } from '@/domain/institution/enterprise/entities/institution-member'
import { InstitutionMemberPresenter } from '../../presenters/institution-member-presenter'

type RemoveStudentStatus =
  | InstitutionMemberStatus.INACTIVE
  | InstitutionMemberStatus.FINISHED
  | InstitutionMemberStatus.SUSPENDED

interface Params {
  memberId: string
}

interface Body {
  actorId: string
  status: 'INACTIVE' | 'FINISHED' | 'SUSPENDED'
}

export class RemoveStudentFromInstitutionController {
  constructor(private readonly useCase: RemoveStudentFromInstitutionUseCase) {}

  async handle({ memberId }: Params, body: Body, reply: FastifyReply) {
    const result = await this.useCase.execute({
      memberId,
      actorId: body.actorId,
      status: body.status as RemoveStudentStatus,
    })

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
