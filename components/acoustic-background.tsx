'use client'

import { useEffect, useRef } from 'react'

export function AcousticBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const drawWave = (
      yOffset: number,
      amplitude: number,
      frequency: number,
      speed: number,
      opacity: number
    ) => {
      if (!ctx || !canvas) return
      
      ctx.beginPath()
      ctx.moveTo(0, canvas.height / 2 + yOffset)

      for (let x = 0; x < canvas.width; x++) {
        const y =
          canvas.height / 2 +
          yOffset +
          Math.sin((x * frequency) / 100 + time * speed) * amplitude +
          Math.sin((x * frequency * 0.5) / 100 + time * speed * 0.7) * (amplitude * 0.5)
        ctx.lineTo(x, y)
      }

      ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`
      ctx.lineWidth = 1
      ctx.stroke()
    }

    const drawGrid = () => {
      if (!ctx || !canvas) return
      
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)'
      ctx.lineWidth = 1

      // Vertical lines
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    const drawFrequencyBars = () => {
      if (!ctx || !canvas) return
      
      const barCount = 32
      const barWidth = 3
      const maxHeight = 150
      const spacing = canvas.width / barCount

      for (let i = 0; i < barCount; i++) {
        const x = spacing * i + spacing / 2
        const height =
          Math.abs(Math.sin(time * 0.5 + i * 0.3)) * maxHeight * 0.3 +
          Math.abs(Math.sin(time * 0.8 + i * 0.5)) * maxHeight * 0.2

        const gradient = ctx.createLinearGradient(x, canvas.height, x, canvas.height - height)
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.15)')
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.02)')

        ctx.fillStyle = gradient
        ctx.fillRect(x - barWidth / 2, canvas.height - height, barWidth, height)
      }
    }

    const animate = () => {
      if (!ctx || !canvas) return
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      drawGrid()

      // Draw frequency bars at bottom
      drawFrequencyBars()

      // Draw multiple waves
      drawWave(-100, 30, 2, 0.02, 0.1)
      drawWave(-50, 20, 3, 0.03, 0.08)
      drawWave(0, 40, 1.5, 0.015, 0.12)
      drawWave(50, 25, 2.5, 0.025, 0.08)
      drawWave(100, 35, 1.8, 0.018, 0.1)

      time += 1
      animationId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
