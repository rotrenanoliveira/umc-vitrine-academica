'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'Início' },
  { href: '/projetos', label: 'Projetos' },
  { href: '/instituicoes', label: 'Instituições' },
  { href: '/conta', label: 'Conta' },
]

export function AppNav() {
  const pathname = usePathname()

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-muted/30 px-4 py-6">
      <p className="font-heading mb-6 text-sm font-semibold tracking-wider uppercase">Vitrine Acadêmica</p>
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const active =
            link.href === '/' ? pathname === '/' : pathname === link.href || pathname.startsWith(`${link.href}/`)

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
