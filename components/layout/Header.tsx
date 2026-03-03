import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Header() {
    return (
        <header className="border-b-2 border-black bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                            RITUAL WORD SEARCH
                        </h1>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex gap-4">
                        <Link href="/maker">
                            <Button variant="primary" size="sm">
                                Create
                            </Button>
                        </Link>
                        <Link href="/my-puzzles">
                            <Button variant="secondary" size="sm">
                                My Puzzles
                            </Button>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
