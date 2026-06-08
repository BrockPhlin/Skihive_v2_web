"use client"

import { useEffect, useRef } from "react"

interface ParticleBgProps {
  count?: number
  color?: string
}

export function ParticleBg({ count = 40, color = "rgba(133, 94, 227, 0.3)" }: ParticleBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let raf = 0
    let stopped = false

    const setSize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio
      canvas.height = window.innerHeight * window.devicePixelRatio
      canvas.style.width = window.innerWidth + "px"
      canvas.style.height = window.innerHeight + "px"
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    setSize()
    window.addEventListener("resize", setSize)

    const W = () => window.innerWidth
    const H = () => window.innerHeight

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      size: 2 + Math.random() * 4,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: 0.2 + Math.random() * 0.4,
    }))

    const draw = () => {
      if (stopped) return
      ctx.clearRect(0, 0, W(), H())
      for (const p of particles) {
        p.x += p.speedX
        p.y += p.speedY
        if (p.x < 0) p.x = W()
        if (p.x > W()) p.x = 0
        if (p.y < 0) p.y = H()
        if (p.y > H()) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = color.replace(/[\d.]+\)$/, `${p.opacity})`)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      stopped = true
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", setSize)
    }
  }, [count, color])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}
