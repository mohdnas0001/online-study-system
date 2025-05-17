export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Online Study System</h1>
          <a
            href="/login"
            className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-100 transition-colors"
          >
            Login
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8 sm:p-20">
        <div className="text-center max-w-2xl">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Your Learning Journey
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            The Online Study System is designed to help Computer Science students practice and master key concepts through interactive quizzes. Log in to access personalized practice sessions or manage educational content as an admin.
          </p>
          <a
            href="/login"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-blue-600 transition-colors shadow-lg"
          >
            Get Started
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Online Study System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}