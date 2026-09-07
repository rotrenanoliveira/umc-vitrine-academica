import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Slug } from '@/core/entities/value-objects/slug'
import type { Optional } from '@/core/types/optional'

export interface TagProps {
  name: string
  slug: Slug
  status: 'ACTIVE' | 'INACTIVE'
}

export class Tag extends Entity<TagProps> {
  get name() {
    return this.props.name
  }

  get slug() {
    return this.props.slug
  }

  get status() {
    return this.props.status
  }

  set status(status: TagProps['status']) {
    this.props.status = status
  }

  get isActive() {
    return this.status === 'ACTIVE'
  }

  static create(props: Optional<TagProps, 'slug' | 'status'>, id?: UniqueEntityId) {
    return new Tag(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.name),
        status: props.status ?? 'ACTIVE',
      },
      id,
    )
  }
}
