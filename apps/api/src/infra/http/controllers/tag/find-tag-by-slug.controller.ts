import type { FastifyReply } from 'fastify'
import type { FindTagBySlugUseCase } from '@/domain/tag/application/use-cases/find-tag-by-slug'
import { TagPresenter } from '../../presenters/tag-presenter'

interface FindTagBySlugParams {
  slug: string
}

export class FindTagBySlugController {
  constructor(private readonly findTagBySlug: FindTagBySlugUseCase) {}

  async handle({ slug }: FindTagBySlugParams, reply: FastifyReply) {
    const result = await this.findTagBySlug.execute({ slug })

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
