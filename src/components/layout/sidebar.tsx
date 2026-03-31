import { Boxes, LayoutDashboard, ShoppingCart, Users } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users },
  { href: "/products", label: "Products", icon: Boxes },
  { href: "/orders", label: "Orders", icon: ShoppingCart }
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href as Route} className="sidebar-link">
              <span className="icon-inline icon-gap-sm">
                <Icon size={16} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
