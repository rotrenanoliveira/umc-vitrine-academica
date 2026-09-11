import Link from 'next/link'
import type { Project } from '@/utils/type'

type HomeProjectsListProps = {
  projects: Project[]
}

export function HomeProjectsList({ projects }: HomeProjectsListProps) {
  if (projects.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum projeto publicado no momento.</p>
  }

  return (
    <ul className="divide-y divide-border border border-border">
      {projects.map((project) => (
        <li key={project.id} className="space-y-1 px-4 py-4">
          <h2 className="font-heading text-lg font-medium">{project.title}</h2>
          <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
          <p className="text-xs text-muted-foreground">
            Publicado em {new Date(project.createdAt).toLocaleDateString('pt-BR')}
          </p>
        </li>
      ))}
    </ul>
  )
}

export function HomePreferencesBanner() {
  return (
    <div className="border border-border px-4 py-3 text-sm">
      <p>
        Você ainda não cadastrou tags preferidas.{' '}
        <Link href="/conta" className="font-medium underline-offset-4 hover:underline">
          Cadastre em Minha conta
        </Link>{' '}
        para personalizar a vitrine.
      </p>
    </div>
  )
}
