import type { FastifyReply } from 'fastify'
import type { UpdateTagUseCase } from '@/domain/tag/application/use-cases/update-tag'
import { TagPresenter } from '../../presenters/tag-presenter'

interface UpdateTagParams {
  tagId: string
}

interface UpdateTagBody {
  status: 'ACTIVE' | 'INACTIVE'
}

export class UpdateTagController {
  constructor(private readonly updateTag: UpdateTagUseCase) {}

  async handle({ tagId }: UpdateTagParams, { status }: UpdateTagBody, reply: FastifyReply) {
    const result = await this.updateTag.execute({
      id: tagId,
      status,
    })

    if (result.isLeft()) {
      // TODO: Validar erros no fastify error handler
      return reply.status(404).send({
        message: result.value.message,
      })
    }

    return reply.status(200).send({
      tag: TagPresenter.toHTTP(result.value.tag),
    })
  }
}
