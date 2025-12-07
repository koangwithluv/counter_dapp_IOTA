"use client"

import { useState, useEffect } from "react"
import { useCurrentAccount } from "@iota/dapp-kit"
import { Toaster } from "react-hot-toast"
import { useCounter } from "@/hooks/useCounter"
import { AchievementPopup } from "@/components/AchievementPopup"
import { AchievementGallery } from "@/components/AchievementGallery"
import { getProgressToNext } from "@/lib/achievements"
import type { Achievement } from "@/lib/achievements"

export function Counter() {
  const account = useCurrentAccount()
  const { counter, loading, error, history, lastDigest, createCounter, increment, decrement, reset, addCustom, unlockedAchievement } = useCounter()
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null)

  // Debug: Log counter value whenever it changes
  useEffect(() => {
    if (counter) {
      console.log("📊 Counter value:", counter.value)
    }
  }, [counter])

  // Show achievement popup when unlocked
  useEffect(() => {
    if (unlockedAchievement) {
      console.log("🎉 Achievement unlocked:", unlockedAchievement.name)
      setShowAchievement(unlockedAchievement)
    }
  }, [unlockedAchievement])

  if (!account) {
    return (
      <>
        <div className="w-full max-w-2xl mx-auto mt-8">
          <div className="bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-indigo-500/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-4xl">🔒</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Counter dApp</h3>
              <p className="text-purple-200">
                Please connect your wallet to start counting!
              </p>
            </div>
          </div>
        </div>
        
        {/* Achievement Gallery */}
        <div className="w-full max-w-2xl mx-auto mt-8">
          <AchievementGallery currentValue={0} />
        </div>
      </>
    )
  }

  if (!counter) {
    return (
      <>
        <div className="w-full max-w-2xl mx-auto mt-8">
          <div className="bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-indigo-500/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto animate-bounce">
                <span className="text-4xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Create Your Counter</h3>
              <p className="text-purple-200">
                Start your journey by creating a counter on the IOTA blockchain!
              </p>
              <button
                onClick={createCounter}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Creating...
                  </span>
                ) : (
                  "Create Counter"
                )}
              </button>
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Achievement Gallery - Show latest value from history if available */}
        <div className="w-full max-w-2xl mx-auto mt-8">
          <AchievementGallery currentValue={history.length > 0 ? history[0].value : 0} />
        </div>
      </>
    )
  }

  const progress = counter ? getProgressToNext(counter.value) : null

  return (
    <>
      {/* Toast Notifications */}
      <Toaster />
      
      {/* Achievement Popup */}
      {showAchievement && (
        <AchievementPopup
          achievement={showAchievement}
          onClose={() => setShowAchievement(null)}
        />
      )}

      <div className="w-full max-w-2xl mx-auto mt-8">
        <div className="bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-indigo-500/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-2">Counter dApp</h3>
              <p className="text-purple-200 text-sm">On-chain counting powered by IOTA</p>
            </div>

            {/* Progress to next achievement */}
            {progress && progress.next && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-200">Next: {progress.next.emoji} {progress.next.name}</span>
                  <span className="text-purple-200">{progress.current} / {progress.target}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress.percentage}%` }}
                  ></div>
                </div>
                <div className="text-center text-xs text-purple-300">
                  {progress.target - progress.current} more to go! 🎯
                </div>
              </div>
            )}

          {/* Counter Display */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl p-12 text-center border border-white/10">
              <div className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-pulse">
                {counter.value}
              </div>
              <p className="text-purple-200 mt-4 text-sm">Current Count</p>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={decrement}
              disabled={loading || counter.value === 0}
              className="group relative px-6 py-4 bg-gradient-to-br from-red-500/20 to-pink-500/20 text-white font-bold rounded-xl border border-red-500/30 hover:border-red-400 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span className="text-3xl group-hover:scale-125 transition-transform inline-block">−</span>
              <div className="text-xs mt-1 text-red-200">Decrease</div>
            </button>

            <button
              onClick={reset}
              disabled={loading}
              className="group relative px-6 py-4 bg-gradient-to-br from-gray-500/20 to-slate-500/20 text-white font-bold rounded-xl border border-gray-500/30 hover:border-gray-400 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span className="text-3xl group-hover:rotate-180 transition-transform inline-block">↻</span>
              <div className="text-xs mt-1 text-gray-200">Reset</div>
            </button>

            <button
              onClick={increment}
              disabled={loading}
              className="group relative px-6 py-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-white font-bold rounded-xl border border-green-500/30 hover:border-green-400 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span className="text-3xl group-hover:scale-125 transition-transform inline-block">+</span>
              <div className="text-xs mt-1 text-green-200">Increase</div>
            </button>
          </div>

          {/* Quick Add Buttons */}
          <div>
            <p className="text-purple-200 text-sm text-center mb-3">Quick Add</p>
            <div className="grid grid-cols-4 gap-3">
              {[5, 10, 50, 100].map((amount) => (
                <button
                  key={amount}
                  onClick={() => addCustom(amount)}
                  disabled={loading}
                  className="px-4 py-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-white font-semibold rounded-lg border border-purple-500/30 hover:border-purple-400 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +{amount}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          {loading && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-200 rounded-lg border border-blue-500/30">
                <span className="animate-spin">⏳</span>
                <span>Processing transaction...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-200 rounded-lg border border-red-500/30">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="text-center text-xs text-purple-300/60 space-y-1">
            <p>Counter ID: {counter.id.slice(0, 8)}...{counter.id.slice(-6)}</p>
            <p>Every action is recorded on the IOTA blockchain</p>
          </div>

          {/* Transaction History */}
          {history.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="text-lg font-bold text-white text-center flex items-center justify-center gap-2">
                <span>📜</span>
                Transaction History
              </h4>
              <div className="max-h-64 overflow-y-auto space-y-2 px-2">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:border-purple-400/50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-white">{item.action}</span>
                      <span className="text-xs text-purple-300">{item.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-200">Value: {item.value}</span>
                      <a
                        href={`https://explorer.testnet.iota.cafe/txblock/${item.digest}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 underline"
                      >
                        View on Explorer →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Last Transaction Link */}
          {lastDigest && (
            <div className="text-center">
              <a
                href={`https://explorer.testnet.iota.cafe/txblock/${lastDigest}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 hover:border-blue-400 transition-all text-sm"
              >
                <span>🔗</span>
                View Latest Transaction
              </a>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Achievement Gallery - Always show, even without counter */}
    <div className="mt-8">
      <AchievementGallery currentValue={counter?.value || 0} />
    </div>
    </>
  )
}
