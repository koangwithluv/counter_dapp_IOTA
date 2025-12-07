import { WalletConnect } from "@/components/Wallet-connect"
import { Counter } from "@/components/Counter"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform">
                <span className="text-2xl">🔢</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Counter dApp</h1>
                <p className="text-sm text-purple-200">IOTA Blockchain</p>
              </div>
            </div>
            <WalletConnect />
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-8 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Count on the
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text">
                Blockchain
              </span>
            </h2>
            <p className="text-lg text-purple-200">
              A simple counter powered by IOTA smart contracts. Every click is immutable! 🚀
            </p>
          </div>
        </section>

        {/* Main Counter */}
        <section className="container mx-auto px-4 pb-12">
          <Counter />
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Updates</h3>
              <p className="text-sm text-purple-200">Real-time blockchain transactions</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-lg font-bold text-white mb-2">Immutable</h3>
              <p className="text-sm text-purple-200">Every count is permanent on-chain</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-3xl mb-3">🌐</div>
              <h3 className="text-lg font-bold text-white mb-2">Decentralized</h3>
              <p className="text-sm text-purple-200">No central server needed</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-6 text-center text-purple-300/60 text-sm">
          <p>Built with ❤️ on IOTA Blockchain</p>
        </footer>
      </div>
    </div>
  )
}
