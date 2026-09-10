import type { Metadata } from 'next'
import { LogoutButton } from '@/components/auth/logout-button'
import { requireUser } from '@/server/auth/require-user'

export const metadata: Metadata = {
  title: 'Minha conta',
}

export default async function AccountPage() {
  const user = await requireUser()

  return (
    <div className="flex min-h-full w-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-4">
        <h1 className="font-heading text-2xl font-semibold">Minha conta</h1>
        <p className="text-sm text-muted-foreground">Sessão autenticada.</p>
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-muted-foreground">Nome</dt>
            <dd>{user.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">E-mail</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd>{user.status}</dd>
          </div>
        </dl>
        <LogoutButton />
      </div>
    </div>
  )
}
