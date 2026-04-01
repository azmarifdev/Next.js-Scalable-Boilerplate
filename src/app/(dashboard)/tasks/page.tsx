import { TaskList } from "@/modules/task/components/TaskList";

export default function TasksPage() {
  return (
    <div className="stack">
      <h1 className="card-title">Tasks</h1>
      <TaskList />
    </div>
  );
}
