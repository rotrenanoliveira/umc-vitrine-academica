import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/utils/type'

type ProjectWithCover = Project & { coverUrl: string | null }

type HomeProjectsListProps = {
  projects: ProjectWithCover[]
}

export function HomeProjectsList({ projects }: HomeProjectsListProps) {
  if (projects.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum projeto publicado no momento.</p>
  }

  return (
    <ul className="divide-y divide-border border border-border">
      {projects.map((project) => (
        <li key={project.id} className="flex gap-4 px-4 py-4">
          {project.coverUrl ? (
            <Image
              src={project.coverUrl}
              alt={`Capa de ${project.title}`}
              width={80}
              height={80}
              unoptimized
              className="size-20 shrink-0 object-cover"
            />
          ) : (
            <div className="size-20 shrink-0 bg-muted" aria-hidden />
          )}
          <div className="min-w-0 space-y-1">
            <h2 className="font-heading text-lg font-medium">{project.title}</h2>
            <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
            <p className="text-xs text-muted-foreground">
              Publicado em {new Date(project.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
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
