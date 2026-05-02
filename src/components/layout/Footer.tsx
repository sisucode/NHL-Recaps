export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border-subtle bg-background-secondary/50 py-8 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <span className="text-lg font-bold tracking-tighter text-text-primary">
              NHL <span className="text-neon-orange">PULSE</span>
            </span>
            <p className="text-xs text-text-secondary">
              © {new Date().getFullYear()} NHL Pulse. All NHL logos and marks are property of the NHL.
            </p>
          </div>
          <div className="flex gap-6 text-xs text-text-secondary">
            <a href="https://www.nhl.com" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">
              NHL.com
            </a>
            <span className="cursor-default">Version 1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
