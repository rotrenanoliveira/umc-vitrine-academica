import type { ProjectsRepository } from '@/domain/project/application/repositories/projects-repositories'
import type { Project } from '@/domain/project/enterprise/entities/project'

export class InMemoryProjectsRepository implements ProjectsRepository {
  public items: Project[] = []

  async findAll(): Promise<Project[]> {
    return this.items
  }

  async findById(id: string): Promise<Project | null> {
    return this.items.find((project) => project.id.toString() === id) ?? null
  }

  async create(project: Project): Promise<void> {
    this.items.push(project)
  }

  async save(project: Project): Promise<void> {
    const projectIndex = this.items.findIndex((item) => item.id.toString() === project.id.toString())

    if (projectIndex === -1) {
      return
    }

    this.items[projectIndex] = project
  }

  async delete(project: Project): Promise<void> {
    const projectIndex = this.items.findIndex((item) => item.id.toString() === project.id.toString())

    if (projectIndex === -1) {
      return
    }

    this.items.splice(projectIndex, 1)
  }
}
