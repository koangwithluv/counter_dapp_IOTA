"use client"

import { useEffect } from "react"
import confetti from "canvas-confetti"
import { Achievement } from "@/lib/achievements"

interface AchievementPopupProps {
  achievement: Achievement
  onClose: () => void
}

export function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        clearInterval(interval)
        return
      }

      const particleCount = 50 * (timeLeft / duration)
      
      // Confetti from left
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      
      // Confetti from right
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)

    // Auto close after 5 seconds
    const timeout = setTimeout(() => {
      onClose()
    }, 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [achievement, onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative max-w-md mx-4">
        {/* Glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${achievement.color} rounded-3xl blur-2xl opacity-60 animate-pulse`}></div>
        
        {/* Main card */}
        <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border-4 border-white/20 shadow-2xl animate-in zoom-in duration-500">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            ×
          </button>

          {/* Content */}
          <div className="text-center space-y-4">
            {/* Achievement unlocked text */}
            <div className="text-sm font-bold text-yellow-400 tracking-widest animate-pulse">
              🎊 ACHIEVEMENT UNLOCKED! 🎊
            </div>

            {/* Emoji */}
            <div className="text-8xl animate-bounce">
              {achievement.emoji}
            </div>

            {/* Achievement name */}
            <h2 className={`text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${achievement.color}`}>
              {achievement.name}
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-300">
              {achievement.description}
            </p>

            {/* Milestone badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-400/30">
              <span className="text-2xl font-bold text-white">{achievement.milestone}</span>
              <span className="text-sm text-purple-200">counts reached!</span>
            </div>

            {/* Reward */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                <span className="text-xl">💰</span>
                <span className="text-lg font-bold text-yellow-300">+{achievement.reward} Points</span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
                <span className="text-lg font-bold text-blue-300">{achievement.rarity.toUpperCase()}</span>
              </div>
            </div>

            {/* Rarity stars */}
            <div className="text-2xl">
              {achievement.rarity === "common" && "⭐"}
              {achievement.rarity === "rare" && "⭐⭐"}
              {achievement.rarity === "epic" && "⭐⭐⭐"}
              {achievement.rarity === "legendary" && "⭐⭐⭐⭐"}
            </div>

            {/* Action button */}
            <button
              onClick={onClose}
              className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Awesome! 🎉
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
