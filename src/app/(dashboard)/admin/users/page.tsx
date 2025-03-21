// app/(dashboard)/admin/users/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type User = {
  _id: string;
  username: string;
  role: string;
};

export default function ManageUsers() {
  const { data: session, status } = useSession();

  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users", {
        headers: {
          "Authorization": `Bearer ${session?.accessToken || ""}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
    enabled: status === "authenticated" && session?.user?.role === "admin", // Only fetch if admin
  });

  if (status === "loading" || isLoading) return <div>Loading...</div>;
  if (status === "unauthenticated" || session?.user?.role !== "admin") {
    return <div>Access denied. Admin only.</div>;
  }
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <ul className="space-y-4">
        {users?.map((user) => (
          <li key={user._id} className="border p-4 rounded">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}