import { getTranslations } from "next-intl/server";

import { TaskList } from "@/modules/task/components/TaskList";

export default async function TasksPage() {
  const t = await getTranslations("dashboard");

  return (
    <div className="stack">
      <h1 className="card-title">{t("tasksNav")}</h1>
      <TaskList />
    </div>
  );
}
