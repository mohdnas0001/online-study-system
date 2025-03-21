"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const role = session?.user?.role || "student"; // Default to student if role is missing
  const isAdmin = role === "admin";

  // Navigation items based on role
  const navItems = isAdmin
    ? [
        { label: "Dashboard", path: "/admin" },
        { label: "Manage Questions", path: "/admin/questions" },
        { label: "Manage Users", path: "/admin/users" },
      ]
    : [
        { label: "Dashboard", path: "/student" },
        { label: "Practice", path: "/student/practice" },
        { label: "Questions", path: "/student/questions" },
      ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-200 text-white p-4">
        <h2 className="text-2xl text-blue-700 font-bold mb-6">Dashboard</h2>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`block p-2 rounded ${
                    pathname === item.path ? "bg-blue-500" : "hover:bg-gray-700"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            {isAdmin ? "Admin Panel" : "Study Platform"}
          </h1>
          <div className="flex items-center space-x-4">
            <span>{session?.user?.name || "User"}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-100 overflow-auto">{children}</main>
      </div>
    </div>
  );
}