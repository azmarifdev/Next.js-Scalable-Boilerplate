import type { ReactNode } from "react";

import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <Navbar />
      <div className="dashboard-shell">
        <Sidebar />
        <section className="dashboard-content">{children}</section>
      </div>
    </main>
  );
}
