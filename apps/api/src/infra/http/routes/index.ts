import type { FastifyInstance } from 'fastify'
import { deleteAttachmentRoute } from './attachments/delete-attachment'
import { getAttachmentRoute } from './attachments/get-attachment'
import { uploadAttachmentRoute } from './attachments/upload-attachment'
import { activateInstitutionRoute } from './institutions/activate-institution'
import { deactivateInstitutionRoute } from './institutions/deactivate-institution'
import { editInstitutionRoute } from './institutions/edit-institution'
import { fetchActiveInstitutionsRoute } from './institutions/fetch-active-institutions'
import { fetchInstitutionsRoute } from './institutions/fetch-institutions'
import { finishInstitutionMemberRoute } from './institutions/members/finish-institution-member'
import { inactivateInstitutionMemberRoute } from './institutions/members/inactivate-institution-member'
import { removeProfessorFromInstitutionRoute } from './institutions/members/remove-professor-from-institution'
import { removeStudentFromInstitutionRoute } from './institutions/members/remove-student-from-institution'
import { suspendInstitutionMemberRoute } from './institutions/members/suspend-institution-member'
import { addProfessorToInstitutionRoute } from './institutions/memberships/add-professor-to-institution'
import { addStudentToInstitutionRoute } from './institutions/memberships/add-student-to-institution'
import { fetchPendingProfessorMembershipsRoute } from './institutions/memberships/fetch-pending-professor-memberships'
import { fetchPendingStudentMembershipsRoute } from './institutions/memberships/fetch-pending-student-memberships'
import { leaveInstitutionRoute } from './institutions/memberships/leave-institution'
import { requestProfessorMembershipRoute } from './institutions/memberships/request-professor-membership'
import { requestStudentMembershipRoute } from './institutions/memberships/request-student-membership'
import { registerInstitutionRoute } from './institutions/register-institution'
import { configureInstitutionDomainRoute } from './institutions/settings/configure-institution-domain'
import { registerInstitutionSettingsRoute } from './institutions/settings/register-institution-settings'
import { updateInstitutionSettingsRoute } from './institutions/settings/update-institution-settings'
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

  /** Institutions routes */
  /** POST /institutions */
  await app.register(registerInstitutionRoute)
  /** GET /institutions */
  await app.register(fetchInstitutionsRoute)
  /** GET /institutions/active */
  await app.register(fetchActiveInstitutionsRoute)
  /** PUT /institutions/:institutionId */
  await app.register(editInstitutionRoute)
  /** PUT /institutions/:institutionId/activate */
  await app.register(activateInstitutionRoute)
  /** PUT /institutions/:institutionId/deactivate */
  await app.register(deactivateInstitutionRoute)

  /** Institution settings */
  /** POST /institutions/:institutionId/settings */
  await app.register(registerInstitutionSettingsRoute)
  /** PUT /institutions/:institutionId/settings */
  await app.register(updateInstitutionSettingsRoute)
  /** PUT /institutions/:institutionId/domain */
  await app.register(configureInstitutionDomainRoute)

  /** Institution memberships */
  /** POST /institutions/:institutionId/students */
  await app.register(addStudentToInstitutionRoute)
  /** POST /institutions/:institutionId/professors */
  await app.register(addProfessorToInstitutionRoute)
  /** POST /institutions/:institutionId/memberships/students */
  await app.register(requestStudentMembershipRoute)
  /** POST /institutions/:institutionId/memberships/professors */
  await app.register(requestProfessorMembershipRoute)
  /** POST /institutions/:institutionId/leave */
  await app.register(leaveInstitutionRoute)
  /** GET /institutions/:institutionId/memberships/students/pending */
  await app.register(fetchPendingStudentMembershipsRoute)
  /** GET /institutions/:institutionId/memberships/professors/pending */
  await app.register(fetchPendingProfessorMembershipsRoute)
  /** PUT /institutions/members/:memberId/students/remove */
  await app.register(removeStudentFromInstitutionRoute)
  /** PUT /institutions/members/:memberId/professors/remove */
  await app.register(removeProfessorFromInstitutionRoute)
  /** PUT /institutions/members/:memberId/suspend */
  await app.register(suspendInstitutionMemberRoute)
  /** PUT /institutions/members/:memberId/inactivate */
  await app.register(inactivateInstitutionMemberRoute)
  /** PUT /institutions/members/:memberId/finish */
  await app.register(finishInstitutionMemberRoute)

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
