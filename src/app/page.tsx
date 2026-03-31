import Link from "next/link";

import { APP_NAME } from "@/lib/constants";

export default function HomePage() {
  return (
    <main className="page-section container">
      <section className="card stack">
        <h1 className="card-title">{APP_NAME}</h1>
        <p className="help-text">
          A scalable Next.js starter with feature modules, auth, services, and testing setup.
        </p>
        <div className="topbar-actions">
          <Link className="btn btn-primary" href="/login">
            Login
          </Link>
          <Link className="btn btn-secondary" href="/register">
            Register
          </Link>
        </div>
      </section>
    </main>
  );
}
