// @ts-nocheck - Suppress Transaction type errors from duplicate @iota/iota-sdk versions
"use client"

import { useState, useEffect } from "react"
import { useCurrentAccount, useSignAndExecuteTransaction, useIotaClient } from "@iota/dapp-kit"
import { Transaction } from "@iota/iota-sdk/transactions"
import { useNetworkVariable } from "@/lib/config"
import { checkAchievement, type Achievement } from "@/lib/achievements"
import toast, { Toaster } from "react-hot-toast"

interface CounterData {
  id: string
  value: number
  owner: string
}

// Track which achievements have been shown to avoid re-showing
const shownAchievements = new Set<string>()

// Helper function to check and show achievement
function handleAchievementCheck(
  newValue: number, 
  setUnlockedAchievement: (achievement: Achievement | null) => void
) {
  const achievement = checkAchievement(newValue)
  if (achievement && !shownAchievements.has(achievement.id)) {
    console.log("🎊 New achievement unlocked:", achievement.name)
    shownAchievements.add(achievement.id)
    setUnlockedAchievement(achievement)
    toast.success(`🎉 Achievement Unlocked: ${achievement.name}!`, {
      duration: 3000,
      position: "top-center",
      style: {
        background: "#1f2937",
        color: "#fff",
        fontSize: "16px",
        fontWeight: "bold"
      }
    })
  }
}

export function useCounter() {
  const account = useCurrentAccount()
  const client = useIotaClient()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()
  const packageId = useNetworkVariable("packageId")
  
  const [counter, setCounter] = useState<CounterData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<Array<{action: string, value: number, time: string, digest: string}>>([])
  const [lastDigest, setLastDigest] = useState<string>("")
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null)
  const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now())

  // Fetch counter objects owned by user
  useEffect(() => {
    if (!account?.address) {
      setCounter(null)
      return
    }

    const fetchCounter = async () => {
      try {
        // Try to get counter ID from localStorage (shared objects are not owned)
        const storedCounterId = localStorage.getItem("counterObjectId")
        
        if (storedCounterId) {
          try {
            const counterObj = await client.getObject({
              id: storedCounterId,
              options: {
                showContent: true,
              },
            })
            
            const content = counterObj.data?.content as any
            if (content?.fields) {
              const counterData = {
                id: storedCounterId,
                value: Number(content.fields.value),
                owner: content.fields.owner,
              }
              setCounter(counterData)
              return
            }
          } catch (err) {
            console.error("❌ Counter not found, clearing storage")
            // Counter might have been deleted, clear storage
            localStorage.removeItem("counterObjectId")
          }
        }
        
        setCounter(null)
      } catch (err) {
        console.error("Error fetching counter:", err)
      }
    }

    fetchCounter()
    
    // Poll for updates, but stop after 30 seconds of inactivity
    const interval = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivityTime
      const maxInactiveTime = 30000 // 30 seconds
      
      if (timeSinceActivity > maxInactiveTime) {
        console.log("⏸️ Polling paused (inactive for 30s)")
        clearInterval(interval)
        return
      }
      
      fetchCounter()
    }, 3000)
    
    return () => clearInterval(interval)
  }, [account?.address, client, lastActivityTime])

  const createCounter = async () => {
    if (!account) {
      setError("Please connect your wallet first")
      return
    }

    setLoading(true)
    setError(null)
    setLastActivityTime(Date.now()) // Reset polling timer

    try {
      const tx = new Transaction()
      tx.moveCall({
        target: `${packageId}::counter::create`,
      })

      // @ts-ignore - Transaction type mismatch due to duplicate packages
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: async (result) => {
            console.log("Counter created successfully!", result)
            const digest = result.digest
            setLastDigest(digest)
            
            // Extract counter ID from transaction effects (shared object)
            try {
              const txResult = await client.waitForTransaction({
                digest: digest,
                options: {
                  showEffects: true,
                  showObjectChanges: true,
                },
              })
              
              console.log("📋 Transaction result:", txResult)
              
              // Find the created Counter object
              const createdObjects = txResult.objectChanges?.filter(
                (change: any) => change.type === "created" && 
                change.objectType?.includes("::counter::Counter")
              ) as any[]
              
              if (createdObjects && createdObjects.length > 0) {
                const counterObjectId = createdObjects[0].objectId as string
                console.log("🎯 Counter ID from transaction:", counterObjectId)
                
                // Store counter ID in localStorage so we can fetch it later
                localStorage.setItem("counterObjectId", counterObjectId)
                
                // Fetch the counter object
                const counterObj = await client.getObject({
                  id: counterObjectId,
                  options: {
                    showContent: true,
                  },
                })
                
                const content = counterObj.data?.content as any
                if (content?.fields) {
                  const counterData = {
                    id: counterObjectId,
                    value: Number(content.fields.value),
                    owner: content.fields.owner,
                  }
                  console.log("✅ Counter fetched:", counterData)
                  setCounter(counterData)
                  
                  setHistory(prev => [{
                    action: "Created Counter",
                    value: 0,
                    time: new Date().toLocaleTimeString(),
                    digest
                  }, ...prev])
                  
                  toast.success("✅ Counter created successfully!", {
                    duration: 2000,
                    position: "top-center"
                  })
                }
              } else {
                console.error("❌ No counter object found in transaction")
                toast.error("Failed to create counter", {
                  duration: 3000,
                  position: "top-center"
                })
              }
            } catch (err) {
              console.error("Error processing transaction result:", err)
              toast.error("Error fetching counter", {
                duration: 3000,
                position: "top-center"
              })
            }
            
            setLoading(false)
          },
          onError: (err) => {
            console.error("Error creating counter:", err)
            const errorMsg = err instanceof Error && err.message.includes('Rejected') 
              ? 'Transaction rejected by user' 
              : 'Failed to create counter'
            setError(errorMsg)
            setLoading(false)
          },
        }
      )
    } catch (err) {
      console.error("Error:", err)
      setError("Failed to create counter")
      setLoading(false)
    }
  }

  const increment = async () => {
    if (!counter) return
    
    const oldValue = counter.value // Save current value before transaction
    setLoading(true)
    setError(null)
    setLastActivityTime(Date.now()) // Reset polling timer

    try {
      const tx = new Transaction()
      tx.moveCall({
        target: `${packageId}::counter::increment`,
        arguments: [tx.object(counter.id)],
      })

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("Incremented successfully!", result)
            const digest = result.digest
            const newValue = oldValue + 1 // Use saved oldValue
            setLastDigest(digest)
            setHistory(prev => [{
              action: "Incremented",
              value: newValue,
              time: new Date().toLocaleTimeString(),
              digest
            }, ...prev].slice(0, 10))
            
            toast.success(`✅ Counter increased to ${newValue}!`, {
              duration: 1500,
              position: "top-center"
            })
            
            // Check for achievement
            handleAchievementCheck(newValue, setUnlockedAchievement)
            
            // Force refetch to sync with blockchain
            setTimeout(() => {
              fetchCounter()
            }, 500)
            
            setLoading(false)
          },
          onError: (err) => {
            console.error("Error incrementing:", err)
            const errorMsg = String(err).includes('Rejected') ? '❌ Transaction rejected' : 'Failed to increment'
            toast.error(errorMsg)
            setLoading(false)
          },
        }
      )
    } catch (err) {
      console.error("Error:", err)
      setError("Failed to increment")
      setLoading(false)
    }
  }

  const decrement = async () => {
    if (!counter) return
    
    const oldValue = counter.value // Save current value before transaction
    setLoading(true)
    setError(null)
    setLastActivityTime(Date.now()) // Reset polling timer

    try {
      const tx = new Transaction()
      tx.moveCall({
        target: `${packageId}::counter::decrement`,
        arguments: [tx.object(counter.id)],
      })

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("Decremented!", result)
            const digest = result.digest
            const newValue = oldValue - 1 // Use saved oldValue
            setLastDigest(digest)
            setHistory(prev => [{
              action: "Decremented",
              value: newValue,
              time: new Date().toLocaleTimeString(),
              digest
            }, ...prev].slice(0, 10))
            
            toast.success(`✅ Counter decreased to ${newValue}!`, {
              duration: 1500,
              position: "top-center"
            })
            
            // Force refetch to sync with blockchain
            setTimeout(() => {
              fetchCounter()
            }, 500)
            
            setLoading(false)
          },
          onError: (err) => {
            console.error("Error decrementing:", err)
            const errorMsg = String(err).includes('Rejected') ? '❌ Transaction rejected' : 'Failed to decrement'
            toast.error(errorMsg)
            setLoading(false)
          },
        }
      )
    } catch (err) {
      console.error("Error:", err)
      setError("Failed to decrement")
      setLoading(false)
    }
  }

  const reset = async () => {
    if (!counter) return
    
    setLoading(true)
    setError(null)
    setLastActivityTime(Date.now()) // Reset polling timer

    try {
      const tx = new Transaction()
      tx.moveCall({
        target: `${packageId}::counter::reset`,
        arguments: [tx.object(counter.id)],
      })

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("Reset successfully!", result)
            const digest = result.digest
            setLastDigest(digest)
            setHistory(prev => [{
              action: "Reset to 0",
              value: 0,
              time: new Date().toLocaleTimeString(),
              digest
            }, ...prev].slice(0, 10))
            
            toast.success("✅ Counter reset to 0!", {
              duration: 1500,
              position: "top-center"
            })
            
            // Force refetch to sync with blockchain
            setTimeout(() => {
              fetchCounter()
            }, 500)
            
            setLoading(false)
          },
          onError: (err) => {
            console.error("Error resetting:", err)
            const errorMsg = String(err).includes('Rejected') ? '❌ Transaction rejected' : 'Failed to reset'
            toast.error(errorMsg)
            setLoading(false)
          },
        }
      )
    } catch (err) {
      console.error("Error:", err)
      setError("Failed to reset")
      setLoading(false)
    }
  }

  const addCustom = async (amount: number) => {
    if (!counter) return
    
    const oldValue = counter.value // Save current value before transaction
    setLoading(true)
    setError(null)
    setLastActivityTime(Date.now()) // Reset polling timer

    try {
      const tx = new Transaction()
      tx.moveCall({
        target: `${packageId}::counter::add`,
        arguments: [tx.object(counter.id), tx.pure.u64(amount)],
      })

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("Added successfully!", result)
            const digest = result.digest
            const newValue = oldValue + amount // Use saved oldValue
            setLastDigest(digest)
            setHistory(prev => [{
              action: `Added +${amount}`,
              value: newValue,
              time: new Date().toLocaleTimeString(),
              digest
            }, ...prev].slice(0, 10))
            
            toast.success(`✅ Added +${amount}! New value: ${newValue}`, {
              duration: 1500,
              position: "top-center"
            })
            
            // Check for achievement
            handleAchievementCheck(newValue, setUnlockedAchievement)
            
            // Force refetch to sync with blockchain
            setTimeout(() => {
              fetchCounter()
            }, 500)
            
            setLoading(false)
          },
          onError: (err) => {
            console.error("Error adding:", err)
            const errorMsg = String(err).includes('Rejected') ? '❌ Transaction rejected' : 'Failed to add'
            toast.error(errorMsg)
            setLoading(false)
          },
        }
      )
    } catch (err) {
      console.error("Error:", err)
      setError("Failed to add")
      setLoading(false)
    }
  }

  return {
    counter,
    loading,
    error,
    history,
    lastDigest,
    unlockedAchievement,
    createCounter,
    increment,
    decrement,
    reset,
    addCustom,
  }
}
