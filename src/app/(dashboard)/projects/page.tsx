import { getTranslations } from "next-intl/server";

import { ProjectList } from "@/modules/project/components/ProjectList";

export default async function ProjectsPage() {
  const t = await getTranslations("dashboard");

  return (
    <div className="stack">
      <h1 className="card-title">{t("projectsNav")}</h1>
      <ProjectList />
    </div>
  );
}
