import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Project } from '@/utils/type'

const statusLabels: Record<Project['status'], string> = {
  SKETCH: 'Rascunho',
  SCHEDULED: 'Agendado',
  PUBLISHED: 'Publicado',
  ARCHIVED: 'Arquivado',
}

type ProjectsTableProps = {
  data: Project[]
}

export function ProjectsTable({ data }: ProjectsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Criado em</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                <Link href={`/projetos/${project.id}`} className="font-medium underline-offset-4 hover:underline">
                  {project.title}
                </Link>
              </TableCell>
              <TableCell>{statusLabels[project.status]}</TableCell>
              <TableCell>
                {new Date(project.createdAt).toLocaleString('pt-BR')}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
              Nenhum projeto encontrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
