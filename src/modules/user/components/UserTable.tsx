"use client";

import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/common/skeleton";
import { useUsers } from "@/modules/user/hooks/use-users.hook";

export function UserTable() {
  const t = useTranslations("users");
  const { users, isLoading, isError } = useUsers();

  if (isLoading) {
    return <Skeleton lines={5} />;
  }

  if (isError) {
    return <EmptyState title={t("errorTitle")} description={t("errorDescription")} />;
  }

  if (users.length === 0) {
    return <EmptyState title={t("emptyTitle")} description={t("emptyDescription")} />;
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>{t("columns.name")}</th>
            <th>{t("columns.email")}</th>
            <th>{t("columns.role")}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
