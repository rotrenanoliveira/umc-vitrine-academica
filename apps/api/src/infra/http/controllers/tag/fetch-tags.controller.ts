import type { FastifyReply } from 'fastify'
import type { FetchTagsUseCase } from '@/domain/tag/application/use-cases/fetch-tags'
import { TagPresenter } from '../../presenters/tag-presenter'

export class FetchTagsController {
  constructor(private readonly fetchTags: FetchTagsUseCase) {}

  async handle(reply: FastifyReply) {
    const result = await this.fetchTags.execute()

    if (result.isLeft()) {
      return reply.status(400).send({
        message: result.value.message,
      })
    }

    return reply.status(200).send({
      tags: result.value.tags.map(TagPresenter.toHTTP),
    })
  }
}
