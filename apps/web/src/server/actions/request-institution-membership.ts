'use server'

import z from 'zod'
import { institutionMemberRoleSchema } from '@/utils/type'
import { requestInstitutionMembership } from '../http/routes/institutions/request-institution-membership'
import { revalidateInstitutionMembershipRequests } from '../revalidate-institution-membership-requests'

const requestInstitutionMembershipSchema = z.object({
  'institution-id': z.uuid('Instituição inválida.'),
  'institution-slug': z.string().min(1, 'Slug inválido.'),
  role: institutionMemberRoleSchema,
  'proof-attachment-id': z.preprocess(
    (value) => (value === '' || value == null ? undefined : value),
    z.uuid('Informe um ID de anexo válido.').optional(),
  ),
})

export async function actionRequestInstitutionMembership(data: FormData) {
  const formResult = requestInstitutionMembershipSchema.safeParse(Object.fromEntries(data))

  if (formResult.success === false) {
    return {
      success: false,
      message: z.prettifyError(formResult.error).replace('✖ ', '').split('\n')[0],
    }
  }

  const institutionId = formResult.data['institution-id']
  const slug = formResult.data['institution-slug']
  const [_, responseError] = await requestInstitutionMembership({
    institutionId,
    role: formResult.data.role,
    proofAttachmentId: formResult.data['proof-attachment-id'],
  })

  if (responseError) {
    return {
      success: false,
      message: responseError.message ?? 'Não foi possível enviar a solicitação.',
    }
  }

  revalidateInstitutionMembershipRequests(slug)

  return { success: true, message: 'Solicitação enviada.' }
}
