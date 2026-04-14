export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}
