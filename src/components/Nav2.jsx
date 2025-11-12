"use client"

export default function Nav2() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-background font-bold text-sm">◆</span>
          </div>
          <span className="font-bold text-lg tracking-tight">ChainCert</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium hover:text-accent transition-colors">
            Features
          </a>
          <a href="#" className="text-sm font-medium hover:text-accent transition-colors">
            Docs
          </a>
          <a href="#" className="text-sm font-medium hover:text-accent transition-colors">
            Contact
          </a>
          <button className="px-6 py-2 border border-accent/50 text-accent rounded-lg text-sm font-medium hover:bg-accent/10 transition-colors">
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  )
}
