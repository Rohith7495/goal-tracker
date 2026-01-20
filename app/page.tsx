import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Goal Tracker</h1>
        <p className="text-xl text-blue-100 mb-8">
          Set your goals and track your progress
        </p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="inline-block bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
