'use server'

import z from 'zod'
import { registerProject } from '../http/routes/projects/register-project'
import { revalidateProjects } from '../revalidate-projects'

const registerProjectSchema = z.object({
  title: z.string().min(1, 'Informe o título.').max(200),
  description: z.string().min(1, 'Informe a descrição.'),
})

export async function actionRegisterProject(data: FormData) {
  const formResult = registerProjectSchema.safeParse(Object.fromEntries(data))

  if (formResult.success === false) {
    return {
      success: false,
      message: z.prettifyError(formResult.error).replace('✖ ', '').split('\n')[0],
    }
  }

  const [_, responseError] = await registerProject(formResult.data)

  if (responseError) {
    return { success: false, message: responseError.message ?? 'Não foi possível criar o projeto.' }
  }

  revalidateProjects()

  return { success: true, message: 'Projeto criado como rascunho.' }
}
