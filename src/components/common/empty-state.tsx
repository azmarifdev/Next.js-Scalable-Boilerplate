interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <section className="empty" role="status" aria-live="polite">
      <h3 className="card-title">{title}</h3>
      {description ? <p className="card-subtitle">{description}</p> : null}
    </section>
  );
}
