import { Button } from '@/components/ui/Button';
import { Footer } from '@/components/puzzle/Footer';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section with Gradient */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 text-white">
        <div className="max-w-4xl mx-auto px-4 py-24 sm:py-32">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 drop-shadow-lg">
            Ritual Word Search
          </h1>
          <p className="text-lg sm:text-xl text-purple-100 mb-12 max-w-2xl">
            Create and play custom word search puzzles.<br/>
            No account required. Deterministic generation. Full ownership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/maker">
              <Button size="lg" className="w-full sm:w-auto bg-white text-purple-600 hover:bg-gray-100">
                Create Puzzle
              </Button>
            </Link>
            <Link href="/my-puzzles">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white/20"
              >
                My Puzzles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
          <h2 className="text-2xl sm:text-3xl font-bold mb-12 text-center text-gray-800 dark:text-zinc-100">
            WHY RITUAL?
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-zinc-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white mb-4">
                🔓
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-zinc-100">NO LOGIN</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400">
                Create puzzles instantly with secret edit links. No account required.
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mb-4">
                🎲
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-zinc-100">DETERMINISTIC</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400">
                Same words + options + seed = same puzzle. Always reproducible.
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-zinc-700 hover:border-green-500 dark:hover:border-green-500 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white mb-4">
                💾
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-zinc-100">YOUR DATA</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400">
                Full ownership. Export as PNG. Edit anytime with secret link.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
          <h2 className="text-2xl sm:text-3xl font-bold mb-12 text-center text-gray-800 dark:text-zinc-100">
            HOW IT WORKS
          </h2>
          <ol className="space-y-8">
            <li className="flex gap-6 items-start">
              <span className="text-4xl font-bold flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                1
              </span>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-2 text-gray-800 dark:text-zinc-100">CREATE</h3>
                <p className="text-gray-600 dark:text-zinc-400">
                  Add your words, customize options, generate puzzle in seconds.
                </p>
              </div>
            </li>
            <li className="flex gap-6 items-start">
              <span className="text-4xl font-bold flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                2
              </span>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-2 text-gray-800 dark:text-zinc-100">SHARE</h3>
                <p className="text-gray-600 dark:text-zinc-400">
                  Get public play link. Share with friends, family, community.
                </p>
              </div>
            </li>
            <li className="flex gap-6 items-start">
              <span className="text-4xl font-bold flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                3
              </span>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-2 text-gray-800 dark:text-zinc-100">EDIT</h3>
                <p className="text-gray-600 dark:text-zinc-400">
                  Keep secret edit link. Modify or delete anytime. You control your puzzles.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to create?</h2>
          <p className="text-purple-100 mb-8">
            Build your first word search puzzle in under a minute.
          </p>
          <Link href="/maker">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
