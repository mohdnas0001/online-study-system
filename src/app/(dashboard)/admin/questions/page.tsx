/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppSelect } from "@/_component/ui/app-select";
import toast from "react-hot-toast";

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
  const queryClient = useQueryClient();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

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
          Authorization: `Bearer ${session?.accessToken || ""}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch questions");
      }
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Sending DELETE request for question ID:", id);
      // Set loading state for this question
      setLoadingStates((prev) => ({ ...prev, [id]: true }));
      const res = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.accessToken || ""}`,
        },
      });
      if (!res.ok) {
        const responseText = await res.text();
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          console.error("Received non-JSON response:", responseText);
          throw new Error("Server returned an unexpected response");
        }
        console.error("Delete request failed:", errorData);
        throw new Error(errorData.error || "Failed to delete question");
      }
    },
    onSuccess: (_, id) => {
      toast.success("Question deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      // Clear loading state for this question
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    },
    onError: (error: Error, id) => {
      toast.error(`Error deleting question: ${error.message}`);
      // Clear loading state for this question
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    },
  });

  // Set default course using useEffect to avoid infinite renders
  useEffect(() => {
    if (!selectedCourse && courses.length > 0) {
      setSelectedCourse(courses[0]);
    }
  }, [selectedCourse, courses]);

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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold md:text-2xl ">Manage Questions</h2>
        <Link href="/admin/questions/add">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Question
          </button>
        </Link>
      </div>

      {/* Course Dropdown */}
      <div className="mb-6">
        <AppSelect
          label="Select Course"
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
              <p>
                <strong>Question:</strong> {q.text}
              </p>
              <p>
                <strong>Options:</strong> {q.options.join(", ")}
              </p>
              <p>
                <strong>Correct Answer:</strong> {q.correctAnswer}
              </p>
              <p>
                <strong>Created By:</strong> {q.createdBy.username}
              </p>
              <div className="flex space-x-4 mt-4">
                <Link href={`/admin/questions/edit/${q._id}`}>
                  <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => deleteMutation.mutate(q._id)}
                  disabled={loadingStates[q._id] || false}
                  className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ${
                    loadingStates[q._id] ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loadingStates[q._id] ? "Deleting..." : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No questions available for this course.</p>
      )}
    </div>
  );
}