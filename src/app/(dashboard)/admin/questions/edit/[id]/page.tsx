/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { AppSelect } from "@/_component/ui/app-select";

type Question = {
  _id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  course: string;
  createdBy: { username: string };
};

export default function EditQuestion() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams();
  const id = params.id as string;

  const courses = [
    "Algorithms",
    "Operating Systems",
    "Database Systems",
    "Computer Networks",
    "Software Engineering",
    "Artificial Intelligence",
  ];

  // Fetch question data
  const { data: question, isLoading, error } = useQuery<Question>({
    queryKey: ["question", id],
    queryFn: async () => {
      console.log("Fetching question with ID:", id);
      const res = await fetch(`/api/questions/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken || ""}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Fetch error:", errorData);
        throw new Error(errorData.error || "Failed to fetch question");
      }
      const data = await res.json();
      console.log("Fetched question:", data);
      return data;
    },
  });

  // Form state
  const [formData, setFormData] = useState({
    text: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    course: "",
  });
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  // Initialize form with question data
  useEffect(() => {
    if (question && !isFormInitialized) {
      console.log("Initializing form with question:", question);
      const initializedOptions =
        Array.isArray(question.options) && question.options.length === 4
          ? question.options
          : ["", "", "", ""];
      const newFormData = {
        text: typeof question.text === "string" ? question.text : "",
        options: initializedOptions,
        correctAnswer: typeof question.correctAnswer === "string" ? question.correctAnswer : "",
        course: typeof question.course === "string" ? question.course : "",
      };
      console.log("Setting formData to:", newFormData);
      setFormData(newFormData);
      setIsFormInitialized(true);
      // Check for empty options
      setOptionsError(
        initializedOptions.every((opt) => opt.trim() !== "")
          ? null
          : "All options must be filled"
      );
    }
  }, [question, isFormInitialized]);

  // Log formData for debugging
  useEffect(() => {
    console.log("Current formData:", formData);
  }, [formData]);

  // Validate options for dropdown
  const areOptionsValid = formData.options.every((opt) => opt.trim() !== "");

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async () => {
      console.log("Submitting form data:", formData);
      if (!formData.text) throw new Error("Question text is required");
      if (!areOptionsValid) throw new Error("All options must be filled");
      if (!formData.correctAnswer) throw new Error("Correct answer is required");
      if (!formData.course) throw new Error("Course is required");
      if (!formData.options.includes(formData.correctAnswer))
        throw new Error("Correct answer must be one of the options");

      const res = await fetch(`/api/questions/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session?.accessToken || ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
        console.error("Update error:", errorData);
        throw new Error(errorData.error || "Failed to update question");
      }
    },
    onSuccess: () => {
      toast.success("Question updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      router.push("/admin/questions");
    },
    onError: (error: Error) => {
      toast.error(`Error updating question: ${error.message}`);
    },
  });

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value } = e.target;
    console.log(`Input change: ${name}${index !== undefined ? `[${index}]` : ""} = ${value}`);
    if (name === "options" && index !== undefined) {
      const newOptions = [...formData.options];
      newOptions[index] = value;
      setFormData({ ...formData, options: newOptions });
      setOptionsError(
        newOptions.every((opt) => opt.trim() !== "") ? null : "All options must be filled"
      );
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated" || session?.user?.role !== "admin") {
    router.push("/login");
    return null;
  }

  if (isLoading) return <div>Loading question...</div>;
  if (error) {
    console.error("Query error:", error);
    return <div>Error: {(error as Error).message}</div>;
  }

  if (!question || !isFormInitialized) {
    console.error("Waiting for question data or form initialization");
    return <div>Loading question data...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-sm font-bold md:text-2xl mb-6">Edit Question</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateMutation.mutate();
        }}
        className="space-y-4"
      >
        {/* Question Text */}
        <div>
          <label className="block text-sm font-medium">Question Text</label>
          <textarea
            name="text"
            value={formData.text}
            onChange={handleInputChange}
            className="mt-1 block w-full border rounded p-2"
            rows={4}
            required
          />
        </div>

        {/* Options */}
        <div>
          <label className="block text-sm font-medium">Options (exactly 4)</label>
          {formData.options.map((option, index) => (
            <input
              key={index}
              type="text"
              name="options"
              value={option}
              onChange={(e) => handleInputChange(e, index)}
              className="mt-1 block w-full border rounded p-2 mb-2"
              placeholder={`Option ${index + 1}`}
              required
            />
          ))}
          {optionsError && <p className="text-red-500 text-sm">{optionsError}</p>}
        </div>

        {/* Correct Answer */}
        <div>
          <label className="block text-sm font-medium">Correct Answer</label>
          {areOptionsValid ? (
            <AppSelect
              label="Select Correct Answer"
              listItems={formData.options.map((option, index) => ({
                value: option,
                label: option || `Option ${index + 1}`,
              }))}
              value={formData.correctAnswer}
              onChange={(value) => setFormData({ ...formData, correctAnswer: value })}
              placeholder="Choose the correct answer"
            />
          ) : (
            <p className="text-red-500 text-sm">Please fill all options to select a correct answer</p>
          )}
        </div>

        {/* Course */}
        <div>
          <label className="block text-sm font-medium">Course</label>
          <AppSelect
            label="Select Course"
            listItems={courses.map((course) => ({ value: course, label: course }))}
            value={formData.course}
            onChange={(value) => setFormData({ ...formData, course: value })}
            placeholder="Choose a course"
          />
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={updateMutation.isPending || !areOptionsValid}
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
              updateMutation.isPending || !areOptionsValid ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {updateMutation.isPending ? "Updating..." : "Update Question"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/questions")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}