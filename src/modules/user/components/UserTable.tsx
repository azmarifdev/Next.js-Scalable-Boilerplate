"use client";

import { EmptyState } from "@/components/common/empty-state";
import { Loader } from "@/components/common/loader";
import { useUsers } from "@/modules/user/hooks/useUsers";

export function UserTable() {
  const { users, isLoading } = useUsers();

  if (isLoading) {
    return <Loader />;
  }

  if (users.length === 0) {
    return (
      <EmptyState title="No users found" description="Users will appear here when available." />
    );
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
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
