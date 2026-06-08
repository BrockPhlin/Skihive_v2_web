// stores/flight-store.ts — 替代 app.globalData 飞行相关字段
import { create } from 'zustand'

interface DroneConfig {
  module: string
  body: string
  shell: string
  color: string
  accessory: string
  imageUrl: string
}

interface Stats {
  duration: number
  stability: number
  fun: number
  [key: string]: number
}

interface Task {
  id: number
  name: string
  image: string
}

interface FlightStore {
  task: Task | null
  environment: { selectedId: number | null; name: string; description: string }
  assemblySelection: string[]
  currentFlight: { droneConfig: DroneConfig; stats: { duration: number; [key: string]: number }; totalScore: number; match: number } | null
  flightSession: any | null
  finalStats: Stats | null
  finalScore: number | null
  flightSuccess: boolean | null
  flightScores: any | null
  storySecretUnlocked: Record<number, boolean>

  setTask: (task: Task) => void
  setEnvironment: (env: { selectedId: number; name: string; description: string }) => void
  setAssemblySelection: (sel: string[]) => void
  setCurrentFlight: (f: { droneConfig: DroneConfig; stats: Stats; totalScore: number; match: number }) => void
  setFlightSession: (s: any) => void
  setFinalStats: (s: Stats) => void
  setFinalScore: (s: number) => void
  setFlightSuccess: (v: boolean) => void
  setFlightScores: (s: any) => void
  unlockChapter: (chapterId: number) => void
  clearFlight: () => void
}

export const useFlightStore = create<FlightStore>((set) => ({
  task: null,
  environment: { selectedId: null, name: '', description: '' },
  assemblySelection: [],
  currentFlight: null,
  flightSession: null,
  finalStats: null,
  finalScore: null,
  flightSuccess: null,
  flightScores: null,
  storySecretUnlocked: {},
  setTask: (task) => set({ task }),
  setEnvironment: (env) => set({ environment: env }),
  setAssemblySelection: (sel) => set({ assemblySelection: sel }),
  setCurrentFlight: (f) => set({ currentFlight: f }),
  setFlightSession: (s) => set({ flightSession: s }),
  setFinalStats: (s) => set({ finalStats: s }),
  setFinalScore: (s) => set({ finalScore: s }),
  setFlightSuccess: (v) => set({ flightSuccess: v }),
  setFlightScores: (s) => set({ flightScores: s }),
  unlockChapter: (id) =>
    set((s) => ({ storySecretUnlocked: { ...s.storySecretUnlocked, [id]: true } })),
  clearFlight: () =>
    set({
      currentFlight: null,
      flightSession: null,
      finalStats: null,
      finalScore: null,
      flightSuccess: null,
      flightScores: null,
    }),
}))
