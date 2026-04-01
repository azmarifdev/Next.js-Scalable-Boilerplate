"use client";

import { useTasks } from "@/modules/task/hooks/useTasks";

export function TaskList() {
  const { tasks } = useTasks();

  return (
    <div className="stack">
      {tasks.map((task) => (
        <article key={task.id} className="card">
          <h3 className="card-title text-title-xs">{task.title}</h3>
          <p className="help-text">Assignee: {task.assignee}</p>
          <p className="help-text">Priority: {task.priority}</p>
          <span className="badge">{task.status}</span>
        </article>
      ))}
    </div>
  );
}
