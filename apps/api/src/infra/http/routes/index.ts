import type { FastifyInstance } from 'fastify'
import { deleteAttachmentRoute } from './attachments/delete-attachment'
import { getAttachmentRoute } from './attachments/get-attachment'
import { uploadAttachmentRoute } from './attachments/upload-attachment'
import { fetchTagsRoute } from './tags/fetch-tags'
import { findTagByIdRoute } from './tags/find-tag-by-id'
import { findTagBySlugRoute } from './tags/find-tag-by-slug'
import { registerTagRoute } from './tags/register-tag'
import { updateTagRoute } from './tags/update-tag'
import { registerUserRoute } from './users/register-user'

/**
 * Routes prefix: /api/v1
 */
export async function routes(app: FastifyInstance) {
  /** Attachments routes */
  /** POST /attachments */
  await app.register(uploadAttachmentRoute)
  /** GET /attachments/:attachmentId */
  await app.register(getAttachmentRoute)
  /** DELETE /attachments/:attachmentId */
  await app.register(deleteAttachmentRoute)

  /** Users routes */
  /** POST /users */
  await app.register(registerUserRoute)

  /** Tags routes */
  /** POST /tags */
  await app.register(registerTagRoute)
  /** GET /tags */
  await app.register(fetchTagsRoute)
  /** GET /tags/:tagId */
  await app.register(findTagByIdRoute)
  /** GET /tags/:slug */
  await app.register(findTagBySlugRoute)
  /** POST /tags/:tagId */
  await app.register(updateTagRoute)
}
