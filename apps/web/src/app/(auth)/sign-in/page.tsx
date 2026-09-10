import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Entrar',
  description: 'Acesse sua conta na Vitrine Acadêmica.',
}

export default function SignInPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-1">
        <h1 className="font-heading text-2xl font-semibold">Entrar</h1>
        <p className="text-sm text-muted-foreground">Em breve você poderá solicitar um código de acesso por e-mail.</p>
      </div>
    </div>
  )
}
