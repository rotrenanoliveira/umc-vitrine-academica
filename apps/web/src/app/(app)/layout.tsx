import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { AppNav } from '@/components/app-nav'

export default function AppLayout({ children, sheet }: { children: React.ReactNode; sheet: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <div className="flex h-screen">
        <AppNav />
        <div className="flex h-screen min-w-0 flex-1 flex-col">
          {children}
          {sheet}
        </div>
      </div>
    </NuqsAdapter>
  )
}
