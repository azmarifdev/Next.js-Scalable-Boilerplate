"use client";

import { useProjects } from "@/modules/project/hooks/useProjects";

export function ProjectList() {
  const { projects } = useProjects();

  return (
    <div className="grid-two">
      {projects.map((project) => (
        <article key={project.id} className="card">
          <h3 className="card-title text-title-sm">{project.name}</h3>
          <p className="help-text">Owner: {project.owner}</p>
          <span className="badge">{project.status}</span>
        </article>
      ))}
    </div>
  );
}
