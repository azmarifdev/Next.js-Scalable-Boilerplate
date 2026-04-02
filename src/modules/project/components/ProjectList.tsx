"use client";

import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/common/skeleton";
import { useProjects } from "@/modules/project/hooks/useProjects";

export function ProjectList() {
  const t = useTranslations("projects");
  const { projects, isLoading, isError } = useProjects();

  if (isLoading) {
    return <Skeleton lines={4} />;
  }

  if (isError) {
    return <EmptyState title={t("errorTitle")} description={t("errorDescription")} />;
  }

  if (projects.length === 0) {
    return <EmptyState title={t("emptyTitle")} description={t("emptyDescription")} />;
  }

  return (
    <div className="grid-two">
      {projects.map((project) => (
        <article key={project.id} className="card">
          <h3 className="card-title text-title-sm">{project.name}</h3>
          <p className="help-text">
            {t("owner")}: {project.owner}
          </p>
          <span className="badge">{project.status}</span>
        </article>
      ))}
    </div>
  );
}
