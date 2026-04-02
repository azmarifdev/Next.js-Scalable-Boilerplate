"use client";

import { BriefcaseBusiness, CheckSquare, LayoutDashboard, Users } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { useAuth } from "@/hooks/useAuth";
import { isFeatureEnabled } from "@/lib/config/feature-flags";

const links = [
  { href: "/dashboard", key: "overviewNav", icon: LayoutDashboard },
  { href: "/users", key: "usersNav", icon: Users, requiresFeature: "admin", requiresRole: "admin" },
  { href: "/projects", key: "projectsNav", icon: BriefcaseBusiness },
  { href: "/tasks", key: "tasksNav", icon: CheckSquare }
] as const;

export function Sidebar() {
  const t = useTranslations("dashboard");
  const { user } = useAuth();
  const visibleLinks = links.filter((link) => {
    if (
      "requiresFeature" in link &&
      link.requiresFeature &&
      !isFeatureEnabled(link.requiresFeature)
    ) {
      return false;
    }

    if ("requiresRole" in link && link.requiresRole && user?.role !== link.requiresRole) {
      return false;
    }

    return true;
  });

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {visibleLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href as Route} className="sidebar-link">
              <span className="icon-inline icon-gap-sm">
                <Icon size={16} />
              </span>
              {t(item.key)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
