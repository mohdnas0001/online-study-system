"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Appbutton from "@/_component/ui/app-button";
import AppInputText from "@/_component/ui/input-text";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import { AppSelect } from "@/_component/ui/app-select";

export default function AddQuestion() {
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [course, setCourse] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  // Sample Computer Science courses formatted for AppSelect
  const courses = [
    { label: "Algorithms", value: "Algorithms" },
    { label: "Operating Systems", value: "Operating Systems" },
    { label: "Database Systems", value: "Database Systems" },
    { label: "Computer Networks", value: "Computer Networks" },
    { label: "Software Engineering", value: "Software Engineering" },
    { label: "Artificial Intelligence", value: "Artificial Intelligence" },
  ];

  const createQuestion = useMutation({
    mutationFn: async (data: {
      text: string;
      options: string[];
      correctAnswer: string;
      course: string;
    }) => {
      const token = session?.accessToken;
      if (!token) throw new Error("No access token available");

      const res = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      console.log("Response status:", res.status);
      if (!res.ok) {
        const error = await res.json();
        console.log("Error response:", error);
        throw new Error(error.error || "Failed to create question");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Question added!");
      router.push("/questions");
    },
    onError: (error: Error) => {
      console.log("Mutation error:", error.message);
      toast.error(error.message);
    },
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || options.some((opt) => !opt) || !correctAnswer || !course) {
      toast.error("All fields are required");
      return;
    }
    if (!options.includes(correctAnswer)) {
      toast.error("Correct answer must match one of the options");
      return;
    }
    console.log("Submitting:", { text, options, correctAnswer, course });
    createQuestion.mutate({ text, options, correctAnswer, course });
  };

  return (
    <main className="p-20 flex flex-col items-center space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-64">
        <AppInputText
          label="Question"
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter question"
          requiredField
        />
        {options.map((opt, idx) => (
          <AppInputText
            key={idx}
            label={`Option ${idx + 1}`}
            id={`option-${idx}`}
            value={opt}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[idx] = e.target.value;
              setOptions(newOptions);
            }}
            placeholder={`Option ${idx + 1}`}
            requiredField
          />
        ))}
        <AppInputText
          label="Correct Answer"
          id="correctAnswer"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          placeholder="Correct answer"
          requiredField
        />
        <AppSelect
          label="Course"
          requiredField
          listItems={courses}
          placeholder="Select a course"
          value={course}
          onChange={(value) => setCourse(value)}
              />
        <Appbutton
          buttonText="Add Question"
          className="bg-blue-400 w-full"
          type="submit"
          loading={createQuestion.isPending}
        />
      </form>
    </main>
  );
}