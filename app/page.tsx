import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function Home() {
  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Splitter
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
            <Link href="#about" className="text-gray-300 hover:text-white transition-colors">About</Link>
            <Link href="/dashboard" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              Go to Dashboard
            </Link>
          </nav>
          <button className="md:hidden text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 bg-transparent">
        <section className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight">
            Stop stressing, <br /> start <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">splitting.</span>
          </h1>
          <p className="text-gray-300 mt-6 text-xl md:text-2xl max-w-3xl mx-auto">
            The simplest and most beautiful way to manage group expenses and settle up with friends.
          </p>
          <Link href="/dashboard" className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold px-10 py-4 rounded-full mt-12 inline-block shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-lg">
            Get Started for Free
          </Link>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white/5">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center text-white">Why you&apos;ll love Splitter</h2>
            <div className="grid md:grid-cols-3 gap-12 mt-16">
              <div className="bg-white/10 p-8 rounded-2xl shadow-lg border border-white/20 transform hover:scale-105 transition-transform duration-300">
                <CheckCircleIcon className="h-10 w-10 text-green-400 mb-4" />
                <h3 className="text-2xl font-bold text-white">Seamless Group Creation</h3>
                <p className="text-gray-300 mt-2">Create and join groups for any occasion in just a few clicks. Trips, roommates, parties, and more.</p>
              </div>
              <div className="bg-white/10 p-8 rounded-2xl shadow-lg border border-white/20 transform hover:scale-105 transition-transform duration-300">
                <CheckCircleIcon className="h-10 w-10 text-green-400 mb-4" />
                <h3 className="text-2xl font-bold text-white">Intuitive Expense Logging</h3>
                <p className="text-gray-300 mt-2">Log expenses with our beautiful interface. Add custom splits and attach receipts effortlessly.</p>
              </div>
              <div className="bg-white/10 p-8 rounded-2xl shadow-lg border border-white/20 transform hover:scale-105 transition-transform duration-300">
                <CheckCircleIcon className="h-10 w-10 text-green-400 mb-4" />
                <h3 className="text-2xl font-bold text-white">Intelligent Debt Settlement</h3>
                <p className="text-gray-300 mt-2">Our smart algorithm finds the simplest way to settle up, minimizing the number of payments.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-transparent text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 Splitter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
