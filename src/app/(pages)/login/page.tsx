"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import Appbutton from "@/_component/ui/app-button";
import AppInputText from "@/_component/ui/input-text";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false, // Prevent automatic redirect so we can handle it
      });
      if (!result?.ok) {
        throw new Error(result?.error || "Login failed");
      }
      return result;
    },
    onSuccess: async () => {
      // Fetch session data to get the user's role
      const response = await fetch("/api/auth/session");
      const session = await response.json();
      const role = session?.user?.role || "student"; // Default to "student" if role is missing

      toast.success("Login successful!");
      
      // Redirect based on role
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/student");
      }
    },
    onError: (error: Error) => {
      console.log("Login error:", error.message);
      if (error.message === "CredentialsSignin") {
        toast.error("Wrong username or password");
      } else if (error.message === "Username and password are required") {
        toast.error("Please enter both username and password");
      } else {
        toast.error(`Login error: ${error.message}`);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }
    loginMutation.mutate({ username, password });
  };

  return (
    <main className="p-20 flex flex-col justify-center items-center space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center space-y-4 w-64">
        <AppInputText
          label="Username"
          id="username"
          name="username"
          placeholder="Enter username"
          requiredField={true}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <AppInputText
          label="Password"
          id="password"
          name="password"
          type="password"
          placeholder="Enter password"
          requiredField={true}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Appbutton
          buttonText="Login"
          className="bg-blue-400 w-full"
          type="submit"
          disabled={!username || !password}
          loading={loginMutation.isPending}
        />
      </form>
    </main>
  );
}