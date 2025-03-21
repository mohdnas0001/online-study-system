import Questions from "@/_lib/models/Questions";
import dbConnect from "@/_lib/mongodb";
import mongoose from "mongoose";


const questions = [
  {
    text: "What is the time complexity of QuickSort in its average case?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: "O(n log n)",
    course: "Algorithms",
    createdBy: "67d6b86e9fa9ccaa6ed0f65d",
  },
  {
    text: "Which scheduling algorithm can lead to starvation?",
    options: ["Round Robin", "Shortest Job First", "First Come First Serve", "Priority Scheduling"],
    correctAnswer: "Priority Scheduling",
    course: "Operating Systems",
    createdBy: "67d6b86e9fa9ccaa6ed0f65d",
  },
  {
    text: "What does ACID stand for in database transactions?",
    options: [
      "Atomicity, Consistency, Isolation, Durability",
      "Availability, Consistency, Integrity, Durability",
      "Atomicity, Concurrency, Isolation, Dependability",
      "Accuracy, Consistency, Isolation, Durability",
    ],
    correctAnswer: "Atomicity, Consistency, Isolation, Durability",
    course: "Database Systems",
    createdBy: "67d6b86e9fa9ccaa6ed0f65d",
  },
  {
    text: "Which protocol is used to translate IP addresses to MAC addresses?",
    options: ["DHCP", "DNS", "ARP", "FTP"],
    correctAnswer: "ARP",
    course: "Computer Networks",
    createdBy: "67d6b86e9fa9ccaa6ed0f65d",
  },
  {
    text: "Which design pattern ensures a class has only one instance?",
    options: ["Factory", "Singleton", "Observer", "Decorator"],
    correctAnswer: "Singleton",
    course: "Software Engineering",
    createdBy: "67d6b86e9fa9ccaa6ed0f65d",
  },
  {
    text: "What is the primary goal of supervised learning?",
    options: [
      "To cluster data into groups",
      "To predict outcomes based on labeled data",
      "To reduce data dimensionality",
      "To explore data without labels",
    ],
    correctAnswer: "To predict outcomes based on labeled data",
    course: "Artificial Intelligence",
    createdBy: "67d6b86e9fa9ccaa6ed0f65d",
  },
  {
    text: "Which data structure is typically used in Depth-First Search?",
    options: ["Queue", "Stack", "Heap", "Array"],
    correctAnswer: "Stack",
    course: "Algorithms",
    createdBy: "67d6b86e9fa9ccaa6ed0f65d",
  },
  {
    text: "What is a deadlock in operating systems?",
    options: [
      "A process waiting indefinitely for a resource",
      "A system crash due to memory overflow",
      "A thread executing too quickly",
      "A process completing its task",
    ],
    correctAnswer: "A process waiting indefinitely for a resource",
    course: "Operating Systems",
    createdBy: "67d6b86e9fa9ccaa6ed0f65d",
  },
  {
    text: "Which SQL command is used to remove a table from a database?",
    options: ["DELETE", "DROP", "TRUNCATE", "REMOVE"],
    correctAnswer: "DROP",
    course: "Database Systems",
    createdBy: "67d6b86e9fa9ccaa6ed0f65d",
  },
  {
    text: "What layer of the OSI model handles routing?",
    options: ["Data Link", "Network", "Transport", "Application"],
    correctAnswer: "Network",
    course: "Computer Networks",
    createdBy: "67d6b86e9fa9ccaa6ed0f65d",
  },
];

async function seedQuestions() {
  try {
    await dbConnect();
    await Questions.deleteMany({}); // Optional: Clear existing questions
    await Questions.insertMany(questions);
    console.log("Questions seeded successfully!");
  } catch (error) {
    console.error("Error seeding questions:", error);
  } finally {
    await mongoose.connection.close();
  }
}

seedQuestions();