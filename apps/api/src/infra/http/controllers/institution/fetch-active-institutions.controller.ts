import type { FastifyReply } from 'fastify'
import type { FetchActiveInstitutionsUseCase } from '@/domain/institution/application/use-cases/institution/fetch-active-institutions'
import { InstitutionPresenter } from '../../presenters/institution-presenter'

export class FetchActiveInstitutionsController {
  constructor(private readonly fetchActiveInstitutions: FetchActiveInstitutionsUseCase) {}

  async handle(reply: FastifyReply) {
    const result = await this.fetchActiveInstitutions.execute()

    if (!result.isRight()) {
      throw result.value
    }

    return reply.status(200).send({
      institutions: result.value.institutions.map(InstitutionPresenter.toHTTP),
    })
  }
}
