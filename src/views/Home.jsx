

import { useEffect, useState } from "react"
import Nav from "../components/Nav"
import "../global.css"

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="home-theme w-full min-h-screen bg-background text-foreground overflow-hidden">
      <Nav />

      {/* Animated grid background */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            backgroundPosition: `${mousePosition.x * 0.02}px ${mousePosition.y * 0.02}px`,
            transition: "background-position 0.1s ease-out",
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 z-10">
              <div className="space-y-4">
                <p className="text-sm font-mono text-accent tracking-widest uppercase">Blockchain Certificate</p>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-balance">
                  Immutable Digital Credentials
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                  Secure, verifiable, and permanently recorded on the blockchain. Eliminate fraud and verify
                  authenticity in seconds.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-6">
                <button className="px-8 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-300 hover:scale-105">
                  Get Started
                </button>
                <button className="px-8 py-3 border border-accent text-accent font-semibold rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Visual - Animated Hexagon */}
            <div className="relative h-96 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Outer rotating ring */}
                <div
                  className="absolute w-72 h-72 border border-accent/30 rounded-full"
                  style={{
                    animation: "spin 20s linear infinite",
                  }}
                />
                {/* Middle rotating ring */}
                <div
                  className="absolute w-56 h-56 border border-accent/50 rounded-full"
                  style={{
                    animation: "spin 15s linear infinite reverse",
                  }}
                />
                {/* Core element */}
                <div className="absolute w-32 h-32 bg-gradient-to-br from-accent/40 to-accent/10 rounded-lg border border-accent/80 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-mono font-bold text-accent">✓</div>
                    <p className="text-xs font-mono text-muted-foreground">VERIFIED</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative w-full py-32 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <p className="text-sm font-mono text-accent tracking-widest uppercase">FEATURES</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-balance">Blockchain Power. Simplified.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "◆", title: "Immutable Records", desc: "Certificates permanently recorded and tamper-proof" },
              { icon: "⬡", title: "Instant Verification", desc: "Verify authenticity in seconds from anywhere" },
              { icon: "★", title: "Global Access", desc: "Recipients control their digital credentials" },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 border border-border/50 rounded-lg hover:border-accent/50 transition-all duration-300 hover:bg-secondary/30"
              >
                <div className="text-3xl font-bold text-accent mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
