"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppSelect } from "@/_component/ui/app-select";

type Question = {
  _id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  course: string;
  createdBy: { username: string };
};

export default function AdminQuestions() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const courses = [
    "Algorithms",
    "Operating Systems",
    "Database Systems",
    "Computer Networks",
    "Software Engineering",
    "Artificial Intelligence",
  ];

  const { data: questions, isLoading, error } = useQuery<Question[]>({
    queryKey: ["questions"],
    queryFn: async () => {
      const res = await fetch("/api/questions", {
        headers: {
          "Authorization": `Bearer ${session?.accessToken || ""}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch questions");
      return res.json();
    },
  });

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated" || session?.user?.role !== "admin") {
    router.push("/login");
    return null;
  }

  if (isLoading) return <div>Loading questions...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  // Group questions by course
  const groupedQuestions = questions?.reduce((acc, q) => {
    acc[q.course] = acc[q.course] || [];
    acc[q.course].push(q);
    return acc;
  }, {} as Record<string, Question[]>);

  // Default to the first course if none selected
  if (!selectedCourse && courses.length > 0) {
    setSelectedCourse(courses[0]);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Questions</h2>
        <Link href="/questions/add">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Question
          </button>
        </Link>
      </div>

      {/* Course Dropdown */}
      <div className="mb-6">
      
         <AppSelect
         label = "Select Course"
          listItems={courses.map((course) => ({ value: course, label: course }))}
          value={selectedCourse || ""}
          onChange={(value) => setSelectedCourse(value)}
          placeholder="Choose a course"
        />
       
      </div>

      {/* Questions for Selected Course */}
      {selectedCourse && groupedQuestions?.[selectedCourse] ? (
        <ul className="space-y-4">
          {groupedQuestions[selectedCourse].map((q) => (
            <li key={q._id} className="border p-4 rounded">
              <p><strong>Question:</strong> {q.text}</p>
              <p><strong>Options:</strong> {q.options.join(", ")}</p>
              <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
              <p><strong>Created By:</strong> {q.createdBy.username}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No questions available for this course.</p>
      )}
    </div>
  );
}