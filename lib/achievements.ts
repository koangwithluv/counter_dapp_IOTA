// Achievement definitions and types

export interface Achievement {
  id: string
  name: string
  description: string
  emoji: string
  milestone: number
  reward: number
  rarity: "common" | "rare" | "epic" | "legendary"
  color: string
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_count",
    name: "First Step",
    description: "Your journey begins! First count achieved.",
    emoji: "🎯",
    milestone: 1,
    reward: 5,
    rarity: "common",
    color: "from-gray-400 to-gray-600"
  },
  {
    id: "ten_club",
    name: "Ten Club",
    description: "Double digits! You're on fire!",
    emoji: "🔥",
    milestone: 10,
    reward: 10,
    rarity: "common",
    color: "from-orange-400 to-red-600"
  },
  {
    id: "half_century",
    name: "Half Century",
    description: "50 counts! You're halfway to greatness!",
    emoji: "🎖️",
    milestone: 50,
    reward: 25,
    rarity: "rare",
    color: "from-blue-400 to-blue-600"
  },
  {
    id: "the_century",
    name: "The Century!",
    description: "100 counts! You're a counting champion!",
    emoji: "💯",
    milestone: 100,
    reward: 50,
    rarity: "rare",
    color: "from-purple-400 to-purple-600"
  },
  {
    id: "double_century",
    name: "Double Century",
    description: "200 counts! Unstoppable force!",
    emoji: "⚡",
    milestone: 200,
    reward: 100,
    rarity: "epic",
    color: "from-yellow-400 to-orange-600"
  },
  {
    id: "half_thousand",
    name: "Half Thousand",
    description: "500 counts! You're a legend in the making!",
    emoji: "🏅",
    milestone: 500,
    reward: 250,
    rarity: "epic",
    color: "from-pink-400 to-rose-600"
  },
  {
    id: "the_legend",
    name: "The Legend",
    description: "1000 counts! Welcome to the Hall of Fame!",
    emoji: "👑",
    milestone: 1000,
    reward: 500,
    rarity: "legendary",
    color: "from-yellow-300 via-amber-400 to-yellow-600"
  },
  {
    id: "master",
    name: "Counter Master",
    description: "5000 counts! You've mastered the art!",
    emoji: "🎭",
    milestone: 5000,
    reward: 2500,
    rarity: "legendary",
    color: "from-indigo-400 via-purple-500 to-pink-600"
  },
  {
    id: "god_mode",
    name: "GOD MODE",
    description: "10000 counts! You are the chosen one!",
    emoji: "⚡",
    milestone: 10000,
    reward: 5000,
    rarity: "legendary",
    color: "from-cyan-400 via-blue-500 to-purple-600"
  }
]

export const RARITY_COLORS = {
  common: "text-gray-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-yellow-400"
}

export const RARITY_STARS = {
  common: "⭐",
  rare: "⭐⭐",
  epic: "⭐⭐⭐",
  legendary: "⭐⭐⭐⭐"
}

// Check if a value unlocks an achievement
export function checkAchievement(value: number): Achievement | null {
  return ACHIEVEMENTS.find(achievement => achievement.milestone === value) || null
}

// Get all unlocked achievements for a value
export function getUnlockedAchievements(value: number): Achievement[] {
  return ACHIEVEMENTS.filter(achievement => value >= achievement.milestone)
}

// Get next achievement to unlock
export function getNextAchievement(value: number): Achievement | null {
  return ACHIEVEMENTS.find(achievement => value < achievement.milestone) || null
}

// Calculate progress to next achievement
export function getProgressToNext(value: number): { current: number; target: number; percentage: number; next: Achievement | null } {
  const next = getNextAchievement(value)
  if (!next) {
    return { current: value, target: value, percentage: 100, next: null }
  }
  
  const previous = ACHIEVEMENTS.filter(a => a.milestone < next.milestone).pop()
  const start = previous?.milestone || 0
  const progress = value - start
  const total = next.milestone - start
  const percentage = Math.floor((progress / total) * 100)
  
  return {
    current: value,
    target: next.milestone,
    percentage,
    next
  }
}
