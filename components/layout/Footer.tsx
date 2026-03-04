export function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-zinc-950 text-gray-800 dark:text-zinc-200 border-t border-gray-200 dark:border-zinc-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-600 dark:text-zinc-400">
                        © {new Date().getFullYear()} Ritual Word Search
                    </p>
                    <div className="flex gap-6 text-sm text-gray-600 dark:text-zinc-400">
                        <a
                            href="https://nextjs.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-900 dark:hover:text-zinc-100 transition-colors"
                        >
                            Next.js
                        </a>
                        <a
                            href="https://supabase.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-900 dark:hover:text-zinc-100 transition-colors"
                        >
                            Supabase
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
