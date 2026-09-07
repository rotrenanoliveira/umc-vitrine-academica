import type { Mail } from '@/domain/mail/application/mail/mail'
import { env } from '@/environment-variables'
import { ResendMail } from './resend-mail'

export function makeEmail(): Mail {
  return new ResendMail({
    apiKey: env.RESEND_API_KEY,
    from: env.MAIL_FROM,
  })
}
