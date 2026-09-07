import type { FastifyReply } from 'fastify'
import type { FindTagByIdUseCase } from '@/domain/tag/application/use-cases/find-tag-by-id'
import { TagPresenter } from '../../presenters/tag-presenter'

interface FindTagByIdParams {
  tagId: string
}

export class FindTagByIdController {
  constructor(private readonly findTagById: FindTagByIdUseCase) {}

  async handle({ tagId }: FindTagByIdParams, reply: FastifyReply) {
    const result = await this.findTagById.execute({ id: tagId })

    if (result.isLeft()) {
      return reply.status(404).send({
        message: result.value.message,
      })
    }

    return reply.status(200).send({
      tag: TagPresenter.toHTTP(result.value.tag),
    })
  }
}
