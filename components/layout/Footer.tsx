export function Footer() {
    return (
        <footer className="border-t-2 border-black bg-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm font-mono">
                        © {new Date().getFullYear()} Ritual Word Search
                    </p>
                    <p className="text-sm text-gray-600">
                        Built with{' '}
                        <a
                            href="https://nextjs.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-black"
                        >
                            Next.js
                        </a>
                        {' + '}
                        <a
                            href="https://supabase.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-black"
                        >
                            Supabase
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
