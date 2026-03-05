export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-text-primary font-display tracking-tight">404</h1>
        <p className="text-text-secondary mb-8">Page not found</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-accent hover:bg-accent/90 text-black font-mono text-sm uppercase tracking-wider font-semibold rounded-xl transition-all"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
