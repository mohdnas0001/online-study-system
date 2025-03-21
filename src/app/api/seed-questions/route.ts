import { NextResponse } from "next/server";
import Questions from "@/_lib/models/Questions";
import dbConnect from "@/_lib/mongodb";

export async function POST() {
  try {
    await dbConnect();
    await Questions.deleteMany({});

    await Questions.insertMany([
      // Original 10 questions
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
      // Additional 20 questions
      {
        text: "What is the worst-case time complexity of Binary Search?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: "O(log n)",
        course: "Algorithms",
        createdBy: "67d6b86e9fa9ccaa6ed0f65d",
      },
      {
        text: "Which OS uses a microkernel architecture?",
        options: ["Linux", "Windows", "macOS", "Minix"],
        correctAnswer: "Minix",
        course: "Operating Systems",
        createdBy: "67d6b86e9fa9ccaa6ed0f65d",
      },
      {
        text: "What is a primary key in a database?",
        options: [
          "A unique identifier for a record",
          "A foreign key link",
          "A duplicate value",
          "An index for sorting",
        ],
        correctAnswer: "A unique identifier for a record",
        course: "Database Systems",
        createdBy: "67d6b86e9fa9ccaa6ed0f65d",
      },
      {
        text: "Which protocol ensures reliable data transfer?",
        options: ["UDP", "TCP", "IP", "HTTP"],
        correctAnswer: "TCP",
        course: "Computer Networks",
        createdBy: "67d6b86e9fa9ccaa6ed0f65d",
      },
      {
        text: "What is the purpose of the Agile methodology?",
        options: [
          "To enforce strict deadlines",
          "To promote iterative development",
          "To eliminate testing",
          "To increase documentation",
        ],
        correctAnswer: "To promote iterative development",
        course: "Software Engineering",
        createdBy: "67d6b86e9fa9ccaa6ed0f65d",
      },
      {
        text: "What algorithm does reinforcement learning use?",
        options: ["K-Means", "Q-Learning", "Linear Regression", "SVM"],
        correctAnswer: "Q-Learning",
        course: "Artificial Intelligence",
        createdBy: "67d6b86e9fa9ccaa6ed0f65d",
      },
      {
        text: "Which sorting algorithm is stable?",
        options: ["QuickSort", "HeapSort", "MergeSort", "BubbleSort"],
        correctAnswer: "MergeSort",
        course: "Algorithms",
        createdBy: "67d6b86e9fa9ccaa6ed0f65d",
      },
      {
        text: "What is virtual memory used for?",
        options: [
          "To increase CPU speed",
          "To extend RAM using disk space",
          "To store permanent data",
          "To manage network connections",
        ],
        correctAnswer: "To extend RAM using disk space",
        course: "Operating Systems",
        createdBy: "67d6b86e9fa9ccaa6ed0f65d",
      },
      {
        text: "What is normalization in databases?",
        options: [
          "Removing all data",
          "Reducing redundancy",
          "Increasing table size",
          "Adding duplicate records",
        ],
        correctAnswer: "Reducing redundancy",
        course: "Database Systems",
        createdBy: "67d6b86e9fa9ccaa6ed0f65d",
      },
      {
        text: "What does DNS stand for?",
        options: [
          "Dynamic Network Service",
          "Domain Name System",
          "Data Network Standard",
          "Distributed Name Server",
        ],
        correctAnswer: "Domain Name System",
        course: "Computer Networks",
        createdBy: "67d6b86e9fa9ccaa6ed0f65d",
      },
      {
        text: "What is pair programming?",
        options: [
          "Two developers writing code together",
          "Pairing bugs with fixes",
          "Writing code in pairs of lines",
          "Testing in pairs",
        ],
        correctAnswer: "Two developers writing code together",
        course: "Software Engineering",
        createdBy: "67d6b86e9fa9ccaa6ed0f65d",
      },
      {
        text: "What does NLP stand for in AI?",
        options: [
          "Neural Learning Process",
          "Natural Language Processing",
          "Network Logic Programming",
          "Non-Linear Prediction",
        ],
        correctAnswer: "Natural Language Processing",
        course: "Artificial Intelligence",
        createdBy: "67d6b86e9fa9ccaa6ed0f65d",
      },
      {
        text: "Which algorithm finds the shortest path in a graph?",
        options: ["Bubble Sort", "Dijkstra’s", "Merge Sort", "DFS"],
        correctAnswer: "Dijkstra’s",
        course: "Algorithms",
        createdBy: "67d6b86e9fa9ccaa6ed0f65d",
      },
      {
        text: "What is a page fault in OS?",
        options: [
          "A hardware failure",
          "A memory access error",
          "A network timeout",
          "A software crash",
        ],
        correctAnswer: "A memory access error",
        course: "Operating Systems",
        createdBy: "67d6b86e9fa9ccaa6ed0f65d",
      },
      {
        text: "What is a foreign key?",
        options: [
          "A key to unlock a database",
          "A field linking to another table",
          "A duplicate primary key",
          "A hidden column",
        ],
        correctAnswer: "A field linking to another table",
        course: "Database Systems",
        createdBy: "67d6b86e9fa9ccaa6ed0f65d",
      },
      {
        text: "Which layer encapsulates data into packets?",
        options: ["Physical", "Data Link", "Network", "Transport"],
        correctAnswer: "Network",
        course: "Computer Networks",
        createdBy: "67d6b86e9fa9ccaa6ed0f65d",
      },
      {
        text: "What does UML stand for?",
        options: [
          "Unified Modeling Language",
          "Universal Machine Learning",
          "User Management Layer",
          "Unified Method Logic",
        ],
        correctAnswer: "Unified Modeling Language",
        course: "Software Engineering",
        createdBy: "67d6b86e9fa9ccaa6ed0f65d",
      },
      {
        text: "Which technique reduces overfitting in neural networks?",
        options: ["Dropout", "Increasing layers", "More data", "Higher learning rate"],
        correctAnswer: "Dropout",
        course: "Artificial Intelligence",
        createdBy: "67d6b86e9fa9ccaa6ed0f65d",
      },
      {
        text: "What is the space complexity of a binary tree traversal?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: "O(n)",
        course: "Algorithms",
        createdBy: "67d6b86e9fa9ccaa6ed0f65d",
      },
      {
        text: "What manages process synchronization in OS?",
        options: ["Semaphore", "Thread", "Cache", "Interrupt"],
        correctAnswer: "Semaphore",
        course: "Operating Systems",
        createdBy: "67d6b86e9fa9ccaa6ed0f65d",
      },
    ]);

    return NextResponse.json({ status: true, message: "Questions seeded successfully" });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Seeding failed", error: String(error) },
      { status: 500 }
    );
  }
}