"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Question = {
  _id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  course: string;
};

export default function Practice() {
  const { status } = useSession();
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const courses = [
    "Algorithms",
    "Operating Systems",
    "Database Systems",
    "Computer Networks",
    "Software Engineering",
    "Artificial Intelligence",
  ];

  const { data: questions, isLoading, error } = useQuery<Question[]>({
    queryKey: ["practiceQuestions", selectedCourse],
    queryFn: async () => {
      if (!selectedCourse) return [];
      const res = await fetch(`/api/questions?course=${selectedCourse}`);
      if (!res.ok) throw new Error("Failed to fetch questions");
      return res.json();
    },
    enabled: !!selectedCourse, 
    staleTime : 1000 * 60 * 5,
  });

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    // Refetching will automatically happen due to useQuery
  };

  const calculateScore = () => {
    if (!questions) return 0;
    return questions.reduce((score, q) => {
      return score + (answers[q._id] === q.correctAnswer ? 1 : 0);
    }, 0);
  };

  if (isLoading) return <div>Loading questions...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <main className="p-10 flex flex-col justify-center items-center space-y-4">
      <h1 className="text-2xl font-bold mb-6">Practice - Computer Science Department</h1>

      {!selectedCourse ? (
        <div>
          <h2 className="text-base text-center  mb-4">Select a Course</h2>
          <ul className="space-x-2 max-w-[700px] items-center justify-center flex flex-row flex-wrap">
            {courses.map((course) => (
              <li key={course}>
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="bg-blue-400 text-white px-2 text-sm rounded hover:bg-blue-500"
                >
                  {course}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : !submitted ? (
        <div>
          <h2 className="text-xl mb-4">{selectedCourse} Practice</h2>
          {questions?.map((q) => (
            <div key={q._id} className="mb-6 border p-4 rounded">
              <p className="font-semibold">{q.text}</p>
              <ul className="space-y-2 mt-2">
                {q.options.map((opt) => (
                  <li key={opt}>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={q._id}
                        value={opt}
                        checked={answers[q._id] === opt}
                        onChange={() => handleAnswer(q._id, opt)}
                        className="mr-2"
                      />
                      {opt}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500"
            disabled={Object.keys(answers).length < (questions?.length || 0)}
          >
            Submit Answers
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl mb-4">Results - {selectedCourse}</h2>
          <p>
            Score: {calculateScore()} / {questions?.length}
          </p>
          <h3 className="text-lg mt-4 mb-2">Review</h3>
          <ul className="space-y-4">
            {questions?.map((q) => (
              <li key={q._id} className="border p-4 rounded">
                <p>{q.text}</p>
                <p>Your Answer: {answers[q._id] || "Not answered"}</p>
                <p>Correct Answer: {q.correctAnswer}</p>
                <p className={answers[q._id] === q.correctAnswer ? "text-green-500" : "text-red-500"}>
                  {answers[q._id] === q.correctAnswer ? "Correct" : "Incorrect"}
                </p>
              </li>
            ))}
          </ul>
          <button
            onClick={handleRetry}
            className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 mt-4"
          >
            Retry
          </button>
        </div>
      )}
    </main>
  );
}