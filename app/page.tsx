import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b-2 border-black">
        <div className="max-w-4xl mx-auto px-4 py-24 sm:py-32">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            RITUAL WORD SEARCH
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-12 max-w-2xl">
            Create and play custom word search puzzles.<br/>
            No account required. Deterministic generation. Full ownership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/maker">
              <Button size="lg" className="w-full sm:w-auto">
                Create Puzzle
              </Button>
            </Link>
            <Link href="/my-puzzles">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                My Puzzles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b-2 border-black">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
          <h2 className="text-2xl sm:text-3xl font-bold mb-12">
            FEATURES
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="border-2 border-black p-6">
              <h3 className="font-bold text-lg mb-2">NO LOGIN</h3>
              <p className="text-sm text-gray-700">
                Create puzzles instantly with secret edit links. No account required.
              </p>
            </div>
            <div className="border-2 border-black p-6">
              <h3 className="font-bold text-lg mb-2">DETERMINISTIC</h3>
              <p className="text-sm text-gray-700">
                Same words + options + seed = same puzzle. Always reproducible.
              </p>
            </div>
            <div className="border-2 border-black p-6">
              <h3 className="font-bold text-lg mb-2">YOUR DATA</h3>
              <p className="text-sm text-gray-700">
                Full ownership. Export as PNG. Edit anytime with secret link.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section>
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
          <h2 className="text-2xl sm:text-3xl font-bold mb-12">
            HOW IT WORKS
          </h2>
          <ol className="space-y-6">
            <li className="flex gap-4">
              <span className="text-3xl font-bold flex-shrink-0">01</span>
              <div>
                <h3 className="font-bold text-lg mb-1">CREATE</h3>
                <p className="text-gray-700">
                  Add your words, customize options, generate puzzle.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="text-3xl font-bold flex-shrink-0">02</span>
              <div>
                <h3 className="font-bold text-lg mb-1">SHARE</h3>
                <p className="text-gray-700">
                  Get public play link. Share with anyone, anywhere.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="text-3xl font-bold flex-shrink-0">03</span>
              <div>
                <h3 className="font-bold text-lg mb-1">EDIT</h3>
                <p className="text-gray-700">
                  Keep secret edit link. Modify or delete anytime.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}
