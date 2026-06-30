/**
 * momentum-bg
 *
 * A calm, homepage-only ambient background: small accent-blue "cursor block"
 * pixels (echoing the typewriter's █) drift very slowly left -> right with a
 * gentle vertical wander, wrapping seamlessly for continuous flow.
 *
 * Built to be light and soothing: canvas + requestAnimationFrame with
 * delta-time, rounded coordinates, the loop pauses when the tab is hidden, and
 * it fully respects prefers-reduced-motion (renders a single static field).
 */

interface Particle {
  x: number
  y: number
  size: number
  vx: number // px/sec, horizontal drift
  vy: number // px/sec, slow vertical wander baseline
  baseAlpha: number
  phase: number // for gentle opacity "breathing"
  twinkle: number // breathing speed
}

const ACCENT = '85, 170, 255' // #55aaff
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)')

function initMomentumBg() {
  // Homepage-only: the intro typewriter marker exists only on index.html.
  if (!document.querySelector('[data-typing-effect]')) return

  const canvas = document.createElement('canvas')
  canvas.className = 'momentum-bg-canvas'
  canvas.setAttribute('aria-hidden', 'true')
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let width = 0
  let height = 0
  let dpr = Math.min(window.devicePixelRatio || 1, 2)
  let particles: Particle[] = []

  function rand(min: number, max: number) {
    return min + Math.random() * (max - min)
  }

  function particleCount() {
    // Modest, and lighter on small screens.
    return Math.max(18, Math.min(60, Math.floor(width / 24)))
  }

  function makeParticle(seedAcrossX: boolean): Particle {
    return {
      x: seedAcrossX ? rand(0, width) : rand(-40, -2),
      y: rand(0, height),
      size: Math.round(rand(2, 4)),
      vx: rand(8, 22),
      vy: rand(-3, 3),
      baseAlpha: rand(0.06, 0.18),
      phase: rand(0, Math.PI * 2),
      twinkle: rand(0.15, 0.5)
    }
  }

  function buildParticles() {
    const n = particleCount()
    particles = []
    for (let i = 0; i < n; i++) particles.push(makeParticle(true))
  }

  function resize() {
    width = window.innerWidth
    height = window.innerHeight
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function draw(alphaScale: number, t: number) {
    ctx!.clearRect(0, 0, width, height)
    for (const p of particles) {
      const breathe = 0.65 + 0.35 * Math.sin(t * p.twinkle + p.phase)
      const a = p.baseAlpha * breathe * alphaScale
      if (a <= 0.001) continue
      ctx!.fillStyle = `rgba(${ACCENT}, ${a})`
      ctx!.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size)
    }
  }

  // ---- Reduced motion: one static, motion-free field. ----
  if (REDUCED.matches) {
    resize()
    buildParticles()
    draw(1, 0)
    canvas.classList.add('is-visible')
    window.addEventListener('resize', () => {
      resize()
      buildParticles()
      draw(1, 0)
    })
    return
  }

  // ---- Animated field. ----
  resize()
  buildParticles()

  let last = 0
  let elapsed = 0
  let running = true
  let rafId = 0

  function frame(now: number) {
    if (!running) return
    if (!last) last = now
    // Cap dt so returning to a hidden tab doesn't cause a jump.
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    elapsed += dt

    for (const p of particles) {
      p.x += p.vx * dt
      p.y += Math.sin(elapsed * 0.4 + p.phase) * 4 * dt + p.vy * dt * 0.05
      // Wrap horizontally (continuous left -> right flow).
      if (p.x - p.size > width) {
        Object.assign(p, makeParticle(false))
        p.x = -p.size
      }
      // Soft vertical wrap.
      if (p.y > height + p.size) p.y = -p.size
      else if (p.y < -p.size) p.y = height + p.size
    }

    draw(1, elapsed)
    rafId = window.requestAnimationFrame(frame)
  }

  function start() {
    if (running) return
    running = true
    last = 0
    rafId = window.requestAnimationFrame(frame)
  }

  function stop() {
    running = false
    if (rafId) window.cancelAnimationFrame(rafId)
  }

  // Clean fade-in once the first frame is on screen.
  requestAnimationFrame(() => canvas.classList.add('is-visible'))
  rafId = window.requestAnimationFrame(frame)

  // Pause work while the tab is hidden.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop()
    else start()
  })

  // Debounced resize.
  let resizeTimer = 0
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      resize()
      buildParticles()
    }, 150)
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMomentumBg)
} else {
  initMomentumBg()
}
