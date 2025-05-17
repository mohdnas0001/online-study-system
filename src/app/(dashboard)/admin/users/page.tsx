"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import toast from "react-hot-toast";

type User = {
  _id: string;
  username: string;
  role: string;
};

export default function ManageUsers() {
  const { data: session, status } = useSession();

  const { data: users, isLoading, error, refetch } = useQuery<User[]>({
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
    enabled: status === "authenticated" && session?.user?.role === "admin",
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${session?.accessToken || ""}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete user");
    },
    onSuccess: () => {
      toast.success("User deleted successfully!", { position: "top-right" });
      refetch();
    },
    onError: (error: Error) => {
      toast.error(`Delete failed: ${error.message}`, { position: "top-right" });
    },
  });

  // Placeholder handlers
  const handleEdit = (user: User) => {
    toast("Edit functionality coming soon!", { position: "top-right" });
    console.log("Edit user:", user);
  };

  const handleChangeRole = (user: User) => {
    toast("Change role functionality coming soon!", { position: "top-right" });
    console.log("Change role for user:", user);
  };

  const handleDelete = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(userId);
    }
  };

  if (status === "loading" || isLoading) return <div className="p-4">Loading...</div>;
  if (status === "unauthenticated" || session?.user?.role !== "admin") {
    return <div className="p-4">Access denied. Admin only.</div>;
  }
  if (error) return <div className="p-4">Error: {(error as Error).message}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
      {users?.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Menu as="div" className="relative inline-block text-left">
                      <Menu.Button className="p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <BsThreeDotsVertical className="h-5 w-5 text-gray-600" />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }: { active: boolean }) => (
                                <button
                                  onClick={() => handleEdit(user)}
                                  className={`${
                                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                                  } block w-full text-left px-4 py-2 text-sm`}
                                >
                                  Edit
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }: { active: boolean }) => (
                                <button
                                  onClick={() => handleChangeRole(user)}
                                  className={`${
                                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                                  } block w-full text-left px-4 py-2 text-sm`}
                                >
                                  Change Role
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }: { active: boolean }) => (
                                <button
                                  onClick={() => handleDelete(user._id)}
                                  className={`${
                                    active ? "bg-red-100 text-red-700" : "text-red-600"
                                  } block w-full text-left px-4 py-2 text-sm`}
                                >
                                  Delete
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No users found.</p>
      )}
    </div>
  );
}