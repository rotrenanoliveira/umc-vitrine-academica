import type { FastifyInstance } from 'fastify'
import { deleteAttachmentRoute } from './attachments/delete-attachment'
import { getAttachmentRoute } from './attachments/get-attachment'
import { uploadAttachmentRoute } from './attachments/upload-attachment'
import { fetchUserPreferenceTagsRoute } from './preference-tags/fetch-user-preference-tags'
import { registerPreferenceTagRoute } from './preference-tags/register-preference-tag'
import { fetchProjectsOfInterestRoute } from './projects/fetch-projects-of-interest'
import { publishScheduledProjectsRoute } from './projects/publish-scheduled-projects'
import { registerProjectRoute } from './projects/register-project'
import { registerProjectTagRoute } from './projects/register-project-tag'
import { scheduleProjectRoute } from './projects/schedule-project'
import { fetchProjectsByTagRoute } from './tags/fetch-projects-by-tag'
import { fetchTagsRoute } from './tags/fetch-tags'
import { registerTagRoute } from './tags/register-tag'
import { findUserByIdRoute } from './users/find-user-by-id'
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
  /** GET /users/:userId */
  await app.register(findUserByIdRoute)

  /** Tags routes */
  /** POST /tags */
  await app.register(registerTagRoute)
  /** GET /tags */
  await app.register(fetchTagsRoute)
  /** GET /tags/:tagId/projects */
  await app.register(fetchProjectsByTagRoute)

  /** Preference tags routes */
  /** POST /preference-tags */
  await app.register(registerPreferenceTagRoute)
  /** GET /users/:userId/preference-tags */
  await app.register(fetchUserPreferenceTagsRoute)

  /** Projects routes */
  /** POST /projects */
  await app.register(registerProjectRoute)
  /** POST /projects/publish-scheduled */
  await app.register(publishScheduledProjectsRoute)
  /** POST /projects/:projectId/schedule */
  await app.register(scheduleProjectRoute)

  /** Project tags routes */
  /** POST /projects/:projectId/tags */
  await app.register(registerProjectTagRoute)
  /** GET /users/:userId/projects-of-interest */
  await app.register(fetchProjectsOfInterestRoute)
}
