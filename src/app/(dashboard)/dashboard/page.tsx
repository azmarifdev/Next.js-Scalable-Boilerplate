export default function DashboardMainPage() {
  return (
    <div className="stack">
      <section className="card">
        <h1 className="card-title">Dashboard Overview</h1>
        <p className="card-subtitle">
          This is a domain-neutral starter template for SaaS, internal tools, and admin dashboards.
        </p>
      </section>

      <section className="grid-two">
        <article className="card">
          <h2 className="card-title text-title-sm">Projects at a glance</h2>
          <p className="help-text">Track project progress, ownership, and status in one place.</p>
        </article>

        <article className="card">
          <h2 className="card-title text-title-sm">Task workflow</h2>
          <p className="help-text">
            Use tasks to model work queues for any product or operations team.
          </p>
        </article>
      </section>
    </div>
  );
}
