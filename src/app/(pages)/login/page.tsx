"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import Appbutton from "@/_component/ui/app-button";
import AppInputText from "@/_component/ui/input-text";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; 

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
      if (!result?.ok) {
        throw new Error(result?.error || "Login failed");
      }
      return result;
    },
    onSuccess: async () => {
      const response = await fetch("/api/auth/session");
      const session = await response.json();
      const role = session?.user?.role || "student";

      toast.success("Login successful!", { position: "top-right" });
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/student");
      }
    },
    onError: (error: Error) => {
      console.log("Login error:", error.message);
      if (error.message === "CredentialsSignin") {
        toast.error("Wrong username or password", { position: "top-right" });
      } else if (error.message === "Username and password are required") {
        toast.error("Please enter both username and password", { position: "top-right" });
      } else {
        toast.error(`Login error: ${error.message}`, { position: "top-right" });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter both username and password", { position: "top-right" });
      return;
    }
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Online Study System - Login</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8 sm:p-20">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Sign In
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <AppInputText
              label="Username"
              id="username"
              name="username"
              placeholder="Enter your username"
              requiredField={true}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <AppInputText
              label="Password"
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              requiredField={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Appbutton
              buttonText={loginMutation.isPending ? "Logging in..." : "Login"}
              className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
              type="submit"
              disabled={!username || !password || loginMutation.isPending}
              loading={loginMutation.isPending}
            />
          </form>
          <p className="mt-4 text-center text-gray-600 text-sm">
            Don’t have an account? Contact your administrator.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Online Study System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}