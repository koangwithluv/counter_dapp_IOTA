"use client"

import { ACHIEVEMENTS, getUnlockedAchievements, RARITY_STARS } from "@/lib/achievements"

interface AchievementGalleryProps {
  currentValue: number
}

export function AchievementGallery({ currentValue }: AchievementGalleryProps) {
  const unlockedAchievements = getUnlockedAchievements(currentValue)
  const unlockedIds = new Set(unlockedAchievements.map(a => a.id))

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-indigo-500/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <span>🏆</span>
            Achievement Gallery
            <span>🏆</span>
          </h3>
          <p className="text-purple-200 text-sm">
            {unlockedAchievements.length} / {ACHIEVEMENTS.length} Unlocked
          </p>
          <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedAchievements.length / ACHIEVEMENTS.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = unlockedIds.has(achievement.id)

            return (
              <div
                key={achievement.id}
                className={`relative rounded-2xl p-4 border-2 transition-all duration-300 ${
                  isUnlocked
                    ? `bg-gradient-to-br ${achievement.color} border-white/30 hover:scale-105 cursor-pointer shadow-lg`
                    : "bg-gray-800/50 border-gray-700 grayscale opacity-50"
                }`}
              >
                {/* Lock overlay */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
                    <span className="text-4xl">🔒</span>
                  </div>
                )}

                {/* Content */}
                <div className="text-center space-y-2">
                  {/* Emoji */}
                  <div className={`text-4xl ${isUnlocked ? "animate-bounce" : ""}`}>
                    {achievement.emoji}
                  </div>

                  {/* Name */}
                  <h4 className={`font-bold ${isUnlocked ? "text-white" : "text-gray-500"}`}>
                    {achievement.name}
                  </h4>

                  {/* Milestone */}
                  <div className={`text-xs ${isUnlocked ? "text-white/80" : "text-gray-600"}`}>
                    {achievement.milestone} counts
                  </div>

                  {/* Rarity */}
                  <div className="text-sm">
                    {RARITY_STARS[achievement.rarity]}
                  </div>

                  {/* Reward (only show if unlocked) */}
                  {isUnlocked && (
                    <div className="text-xs text-yellow-300 font-semibold">
                      +{achievement.reward} pts
                    </div>
                  )}

                  {/* Description (only show if unlocked) */}
                  {isUnlocked && (
                    <p className="text-xs text-white/60 mt-2">
                      {achievement.description}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">{unlockedAchievements.length}</div>
            <div className="text-xs text-purple-200">Unlocked</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">{ACHIEVEMENTS.length - unlockedAchievements.length}</div>
            <div className="text-xs text-purple-200">Locked</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {unlockedAchievements.reduce((sum, a) => sum + a.reward, 0)}
            </div>
            <div className="text-xs text-purple-200">Total Points</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">
              {Math.floor((unlockedAchievements.length / ACHIEVEMENTS.length) * 100)}%
            </div>
            <div className="text-xs text-purple-200">Complete</div>
          </div>
        </div>
      </div>
    </div>
  )
}
