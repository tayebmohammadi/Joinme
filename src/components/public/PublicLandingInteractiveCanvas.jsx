import { useEffect, useRef } from 'react'

const COLORS = [
  'rgba(159, 232, 112, 0.55)',
  'rgba(5, 77, 40, 0.4)',
  'rgba(255, 209, 26, 0.45)',
  'rgba(14, 165, 233, 0.38)',
  'rgba(139, 92, 246, 0.32)',
  'rgba(205, 255, 173, 0.5)',
  'rgba(255, 192, 145, 0.4)',
]

function mulberry32(seed) {
  return function rand() {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildNodes(rand, w, h, count) {
  const nodes = []
  for (let i = 0; i < count; i += 1) {
    const bx = rand() * w
    const by = rand() * h
    const size = 2.5 + rand() * 5.5
    const kind = Math.floor(rand() * 4) // 0 circle, 1 tri, 2 diamond, 3 hex
    const rot = rand() * Math.PI * 2
    nodes.push({
      bx,
      by,
      cx: bx,
      cy: by,
      vx: 0,
      vy: 0,
      size,
      kind,
      rot,
      rotSpeed: (rand() - 0.5) * 0.0005,
      color: COLORS[Math.floor(rand() * COLORS.length)],
    })
  }

  const edges = []
  const maxDist2 = Math.min(w, h) * 0.09
  const maxDist22 = maxDist2 * maxDist2
  for (let i = 0; i < nodes.length; i += 1) {
    const dists = []
    for (let j = 0; j < nodes.length; j += 1) {
      if (i === j) continue
      const dx = nodes[i].bx - nodes[j].bx
      const dy = nodes[i].by - nodes[j].by
      const d2 = dx * dx + dy * dy
      if (d2 < maxDist22 * (1.2 + rand() * 0.8)) dists.push({ j, d2 })
    }
    dists.sort((a, b) => a.d2 - b.d2)
    const k = 1 + Math.floor(rand() * 2)
    for (let e = 0; e < Math.min(k, dists.length); e += 1) {
      const j = dists[e].j
      if (i < j) edges.push([i, j])
    }
  }
  return { nodes, edges }
}

function drawShape(ctx, kind, size) {
  ctx.beginPath()
  if (kind === 0) {
    ctx.arc(0, 0, size, 0, Math.PI * 2)
  } else if (kind === 1) {
    const s = size * 1.15
    ctx.moveTo(0, -s)
    ctx.lineTo(s * 0.866, s * 0.5)
    ctx.lineTo(-s * 0.866, s * 0.5)
    ctx.closePath()
  } else if (kind === 2) {
    const s = size * 1.1
    ctx.moveTo(0, -s)
    ctx.lineTo(s, 0)
    ctx.lineTo(0, s)
    ctx.lineTo(-s, 0)
    ctx.closePath()
  } else {
    const s = size
    for (let i = 0; i < 6; i += 1) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2
      const x = Math.cos(a) * s
      const y = Math.sin(a) * s
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
  }
  ctx.fill()
}

/** Smoothstep for a softer falloff at the edge of the repulsion radius. */
function smoothstep01(t) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

/**
 * Pointer-driven graph: shapes only flee the cursor (repel), with spring-damped motion
 * so they respond quickly but glide smoothly back to rest.
 */
export default function PublicLandingInteractiveCanvas() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -1e6, y: -1e6 })
  const dataRef = useRef(null)
  const reducedRef = useRef(false)

  useEffect(() => {
    reducedRef.current =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let raf = 0
    let w = 0
    let h = 0
    let dpr = 1

    const pointer = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const leave = () => {
      mouseRef.current = { x: -1e6, y: -1e6 }
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const rand = mulberry32(0x4a6f696e)
      dataRef.current = buildNodes(rand, w, h, 132)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', pointer, { passive: true })
    window.addEventListener('pointerdown', pointer, { passive: true })
    window.addEventListener('blur', leave)

    const tick = () => {
      const data = dataRef.current
      if (!data) {
        raf = requestAnimationFrame(tick)
        return
      }
      const { nodes, edges } = data
      const { x: mx, y: my } = mouseRef.current

      const minDim = Math.min(w, h)
      /** Radius where repulsion starts (earlier = feels more responsive). */
      const R = minDim * 0.26
      /** Max displacement from rest, at cursor center. */
      const push = minDim * 0.072
      const stiffness = 0.38
      const damping = 0.78

      for (const n of nodes) {
        const dx = n.cx - mx
        const dy = n.cy - my
        const d = Math.max(Math.hypot(dx, dy), 0.01)

        let rx = 0
        let ry = 0
        if (d < R) {
          const t = 1 - d / R
          const f = smoothstep01(t)
          const inv = 1 / d
          rx = dx * inv * push * f
          ry = dy * inv * push * f
        }

        const tx = n.bx + rx
        const ty = n.by + ry

        if (reducedRef.current) {
          n.cx = tx
          n.cy = ty
          n.vx = 0
          n.vy = 0
        } else {
          n.vx = (n.vx + (tx - n.cx) * stiffness) * damping
          n.vy = (n.vy + (ty - n.cy) * stiffness) * damping
          n.cx += n.vx
          n.cy += n.vy
          const dMouse = Math.hypot(n.cx - mx, n.cy - my)
          n.rot += n.rotSpeed * (1 + smoothstep01(1 - Math.min(dMouse / R, 1)) * 1.2)
        }
      }

      ctx.clearRect(0, 0, w, h)

      ctx.lineWidth = 1
      for (const [a, b] of edges) {
        const na = nodes[a]
        const nb = nodes[b]
        ctx.strokeStyle = 'rgba(14, 15, 12, 0.06)'
        ctx.beginPath()
        ctx.moveTo(na.cx, na.cy)
        ctx.lineTo(nb.cx, nb.cy)
        ctx.stroke()
      }

      for (const n of nodes) {
        ctx.save()
        ctx.translate(n.cx, n.cy)
        ctx.rotate(n.rot)
        ctx.fillStyle = n.color
        drawShape(ctx, n.kind, n.size)
        ctx.restore()
      }

      if (!reducedRef.current) raf = requestAnimationFrame(tick)
    }

    if (reducedRef.current) {
      tick()
    } else {
      raf = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', pointer)
      window.removeEventListener('pointerdown', pointer)
      window.removeEventListener('blur', leave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[2] w-full h-full pointer-events-none mix-blend-multiply opacity-[0.88] motion-reduce:opacity-[0.5]"
      aria-hidden
    />
  )
}
