import { UserTable } from "@/modules/user/components/UserTable";

export default function UsersPage() {
  return (
    <div className="stack">
      <h1 className="card-title">Users</h1>
      <UserTable />
    </div>
  );
}
