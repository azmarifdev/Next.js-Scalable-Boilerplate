"use client";

import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/common/skeleton";
import { useTasks } from "@/modules/task/hooks/use-tasks.hook";

export function TaskList() {
  const t = useTranslations("tasks");
  const { tasks, isLoading, isError } = useTasks();

  if (isLoading) {
    return <Skeleton lines={4} />;
  }

  if (isError) {
    return <EmptyState title={t("errorTitle")} description={t("errorDescription")} />;
  }

  if (tasks.length === 0) {
    return <EmptyState title={t("emptyTitle")} description={t("emptyDescription")} />;
  }

  return (
    <div className="stack">
      {tasks.map((task) => (
        <article key={task.id} className="card">
          <h3 className="card-title text-title-xs">{task.title}</h3>
          <p className="help-text">
            {t("assignee")}: {task.assignee}
          </p>
          <p className="help-text">
            {t("priority")}: {task.priority}
          </p>
          <span className="badge">{task.status}</span>
        </article>
      ))}
    </div>
  );
}
