"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { CHAPTERS, type Chapter, type StoryOption } from "@/lib/story-data"
import { useFlightStore } from "@/stores/flight-store"

export default function StoryPage() {
  const router = useRouter()
  const { storySecretUnlocked, unlockChapter } = useFlightStore()
  const [mode, setMode] = useState<'grid' | 'play'>('grid')
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null)
  const [sceneIdx, setSceneIdx] = useState(0)
  const [displayedNarration, setDisplayedNarration] = useState("")
  const [dialogueIdx, setDialogueIdx] = useState(0)
  const [dialogueText, setDialogueText] = useState("")
  const [showOptions, setShowOptions] = useState(false)
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 计算章节解锁状态
  const chapters = CHAPTERS.map((ch) => {
    if (ch.id === 1) return { ...ch, locked: false }
    const prevCompleted = storySecretUnlocked[ch.id - 1]
    return { ...ch, locked: !prevCompleted }
  })

  const scene = currentChapter?.scenes[sceneIdx]
  const dialogues = scene?.dialogues || []

  // 打字机效果 - 旁白
  function typeNarration(text: string, onDone: () => void) {
    setDisplayedNarration("")
    let i = 0
    typingRef.current = setInterval(() => {
      i++
      setDisplayedNarration(text.slice(0, i))
      if (i >= text.length) {
        if (typingRef.current) clearInterval(typingRef.current)
        setTimeout(onDone, 300)
      }
    }, 40)
  }

  function startDialogue(onDone: () => void) {
    setDialogueIdx(0)
    typeDialogueLine(0, onDone)
  }

  function typeDialogueLine(idx: number, onDone: () => void) {
    if (idx >= dialogues.length) { setTimeout(onDone, 300); return }
    setDialogueText("")
    const line = dialogues[idx].text
    let i = 0
    typingRef.current = setInterval(() => {
      i++
      setDialogueText(line.slice(0, i))
      if (i >= line.length) {
        if (typingRef.current) clearInterval(typingRef.current)
        setDialogueIdx(idx)
        setTimeout(() => typeDialogueLine(idx + 1, onDone), 400)
      }
    }, 30)
  }

  function startScene() {
    if (!scene) return
    setShowOptions(false)
    typeNarration(scene.narration, () => {
      if (dialogues.length > 0) {
        startDialogue(() => setShowOptions(true))
      } else {
        setShowOptions(true)
      }
    })
  }

  function openChapter(ch: Chapter) {
    if (ch.locked) return
    setCurrentChapter(ch)
    setSceneIdx(0)
    setMode('play')
    // delay to let render
    setTimeout(() => {
      const chap = CHAPTERS.find((c) => c.id === ch.id)
      if (chap) startScene()
    }, 50)
  }

  function handleOption(opt: StoryOption) {
    if (typingRef.current) clearInterval(typingRef.current)

    if (opt.secretTrigger) {
      if (currentChapter) unlockChapter(currentChapter.id)
    }

    if (opt.nextChapter) {
      const nextChap = CHAPTERS.find((c) => c.id === opt.nextChapter)
      if (nextChap) {
        unlockChapter(currentChapter?.id || 0)
        setCurrentChapter(nextChap)
        setSceneIdx(0)
        setTimeout(() => startScene(), 100)
        return
      }
    }

    if (typeof opt.nextScene === 'string') {
      if (opt.nextScene.startsWith('secret')) {
        alert('🔮 隐藏结局！你发现了故事的真谛——无人机不仅仅是工具，它们是人类探索天空的伙伴，是连接人与人之间的纽带。')
        if (currentChapter) unlockChapter(currentChapter.id)
        setMode('grid')
        return
      }
      if (opt.nextScene === 'ending_main') {
        alert('🌟 剧情完成！恭喜你完成了剧情模式的主线结局！')
        if (currentChapter) unlockChapter(currentChapter.id)
        setMode('grid')
        return
      }
      if (opt.nextScene === 'ending_secret') {
        alert('🔮 隐藏结局：你发现了所有人的真心。在这个充满挑战的世界里，正是信任创造了最美好的未来。')
        if (currentChapter) unlockChapter(currentChapter.id)
        setMode('grid')
        return
      }
    }

    const nextIdx = typeof opt.nextScene === 'number' ? opt.nextScene : sceneIdx + 1
    if (currentChapter && nextIdx < currentChapter.scenes.length) {
      setSceneIdx(nextIdx)
      setTimeout(() => startScene(), 100)
    } else {
      // chapter end
      if (currentChapter) unlockChapter(currentChapter.id)
      alert(`🎉 章节完成！恭喜你完成了第${currentChapter?.id}章：${currentChapter?.title}`)
      setMode('grid')
    }
  }

  // GRID MODE
  if (mode === 'grid') {
    return (
      <main className="relative min-h-screen bg-gradient-to-b from-[#03040a] via-[#05060d] to-[#0a0d1c] px-5 pt-12 pb-32">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="text-2xl text-white">←</button>
          <div>
            <p className="text-[10px] font-mono tracking-[0.3em] text-[#5cf3ff]">// ARC MODE</p>
            <h1 className="text-2xl font-bold text-white tracking-wide">剧情模式</h1>
          </div>
        </div>
        <p className="text-xs text-white/50 mb-6 text-center">MULTI-CHAPTER FLIGHT ADVENTURE</p>
        <div className="space-y-4">
          {chapters.map((ch) => (
            <button
              key={ch.id}
              onClick={() => openChapter(ch)}
              disabled={ch.locked}
              className={`w-full text-left p-5 rounded-2xl border transition-all ${ch.locked ? 'border-white/5 bg-white/[0.02] opacity-40 cursor-not-allowed' : 'border-[#a78bff]/20 bg-[#11152a] hover:border-[#a78bff]'}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#a78bff]/10 text-3xl flex-shrink-0">{ch.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono tracking-[0.2em] text-[#a78bff]">CH.0{ch.id}</span>
                    {ch.locked && <span className="text-[10px] text-white/30">🔒</span>}
                    {!ch.locked && !storySecretUnlocked[ch.id] && <span className="text-[10px] text-[#22c55e]">NEW</span>}
                    {storySecretUnlocked[ch.id] && <span className="text-[10px] text-[#ffb547]">✓</span>}
                  </div>
                  <p className="text-base font-bold text-white">{ch.title}</p>
                  <p className="text-xs text-white/40 mt-0.5">{ch.description}</p>
                </div>
                <span className="text-2xl text-white/30">›</span>
              </div>
            </button>
          ))}
        </div>
      </main>
    )
  }

  // PLAY MODE
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#03040a] via-[#05060d] to-[#0a0d1c] px-5 pt-12 pb-32">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setMode('grid')} className="text-2xl text-white">←</button>
        <span className="text-[10px] font-mono text-white/40">{currentChapter?.title}</span>
      </div>

      {/* Narration */}
      {displayedNarration && (
        <div className="mb-6 p-4 rounded-2xl border border-[#5cf3ff]/15 bg-[#11152a]">
          <p className="text-sm text-white/85 leading-relaxed">{displayedNarration}</p>
        </div>
      )}

      {/* Dialogues */}
      {dialogues.slice(0, dialogueIdx + 1).map((d, i) => (
        <div key={i} className="mb-3 flex gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#11152a] border border-white/10 text-lg flex-shrink-0">{d.characterIcon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-mono tracking-[0.2em] text-[#ffb547] mb-1">{d.character}</p>
            <p className="text-sm text-white/80 leading-relaxed">{i < dialogueIdx ? d.text : dialogueText}</p>
          </div>
        </div>
      ))}

      {/* Options */}
      {showOptions && scene && (
        <div className="mt-6 space-y-2">
          {scene.options.map((opt) => (
            <button key={opt.id} onClick={() => handleOption(opt)}
              className="w-full text-left p-3 rounded-xl border border-white/10 bg-[#11152a] hover:border-[#ffb547] transition-all">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${opt.tag === 'main' ? 'bg-blue-500/20 text-blue-400' : opt.tag === 'branch' ? 'bg-purple-500/20 text-purple-400' : 'bg-amber-500/20 text-amber-400'}`}>{opt.tagText}</span>
                <span className="text-sm font-semibold text-white">{opt.text}</span>
              </div>
              <p className="text-xs text-white/40">{opt.resultPreview}</p>
            </button>
          ))}
        </div>
      )}
    </main>
  )
}
