'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────────────────
// TUNING CONSTANTS
// ─────────────────────────────────────────────────────────────────────────
const PARTICLE_COUNT_DESKTOP = 200
const PARTICLE_COUNT_MOBILE = 70
const MOBILE_BREAKPOINT = 768
const CONNECTION_DISTANCE = 28          // world units, tuned for camera.z = 100
const MAX_CONNECTIONS_PER_PARTICLE = 5  // hard cap — prevents O(n²) blowup
const PIXEL_RATIO_CAP = 1.5             // caps GPU fill-rate cost on retina/4K
const THROTTLE_MS = 33;                 // Target roughly ~30fps max if device is struggling

export default function ThreeBackground() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    // ── A11Y / BATTERY: respect prefers-reduced-motion entirely ──────────
    // Users who've opted out of motion don't get the WebGL canvas at all.
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduceMotionQuery.matches) return

    const canvas = canvasRef.current
    if (!canvas) return

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT
    const particleCount = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP

    // ── Scene setup ────────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 100

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,        // AA is invisible on a particle field, costs ~15-20% GPU
      powerPreference: 'low-power', // Suggests GPU to enter low-power state
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, PIXEL_RATIO_CAP))
    renderer.setSize(window.innerWidth, window.innerHeight)

    // ── Particle buffer ──────────────────────────────────────────────────
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 200
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200

      velocities[i * 3]     = (Math.random() - 0.5) * 0.04
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.04
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.04
    }

    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.2,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    // ── Connection lines (sage-green) ───────────────────────────────────
    // Pre-allocate the max possible buffer once to prevent GC stutters.
    const maxSegments = particleCount * MAX_CONNECTIONS_PER_PARTICLE
    const linePositions = new Float32Array(maxSegments * 2 * 3)

    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    lineGeometry.setDrawRange(0, 0)

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xc2d099,
      transparent: true,
      opacity: 0.15,
    })

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(lines)

    // ── Mouse parallax (lerped, not instant) ─────────────────────────────
    let mouseX = 0
    let mouseY = 0
    let rotX = 0
    let rotY = 0

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // ── Pause when tab hidden (laptop battery / background tabs) ────────
    let isTabVisible = true
    const handleVisibility = () => {
      isTabVisible = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', handleVisibility)

    // ── Pause when canvas scrolled out of viewport ───────────────────────
    let isInViewport = true
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => { isInViewport = entry.isIntersecting },
      { threshold: 0 }
    )
    if (containerRef.current) intersectionObserver.observe(containerRef.current)

    // ── Debounced Resize handler ──────────────────────────────────────────
    let resizeTimeout;
    const handleResize = () => {
      if(resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }, 150); // Debounce by 150ms to prevent Matrix thrashing
    }
    window.addEventListener('resize', handleResize)

    // ── Reduced-motion can change mid-session (OS setting toggle) ───────
    let reduceMotion = false
    const handleMotionChange = (e) => { reduceMotion = e.matches }
    reduceMotionQuery.addEventListener?.('change', handleMotionChange)

    // ── Animation loop with Dynamic Throttling ───────────────────────────
    let frameId
    let lastTime = 0

    const animate = (time) => {
      frameId = requestAnimationFrame(animate)

      // Hard skip — zero CPU/GPU work when not visible or motion disabled.
      if (!isTabVisible || !isInViewport || reduceMotion) return

      // Dynamic Throttling: If device is lagging, lock to ~30fps to save battery
      const delta = time - lastTime;
      if (delta < THROTTLE_MS && isMobile) return; 
      lastTime = time;

      const posArray = particleGeometry.attributes.position.array

      // Update positions + bounce off bounds
      for (let i = 0; i < particleCount; i++) {
        for (let axis = 0; axis < 3; axis++) {
          const idx = i * 3 + axis
          posArray[idx] += velocities[idx]
          if (posArray[idx] > 100 || posArray[idx] < -100) {
            velocities[idx] *= -1
          }
        }
      }
      particleGeometry.attributes.position.needsUpdate = true

      // Recompute connection lines (Optimized O(n²))
      const lineArray = lineGeometry.attributes.position.array
      let segmentIndex = 0
      const maxDistSq = CONNECTION_DISTANCE * CONNECTION_DISTANCE

      for (let i = 0; i < particleCount && segmentIndex < maxSegments; i++) {
        let connectionsForI = 0
        const ix = posArray[i * 3]
        const iy = posArray[i * 3 + 1]
        const iz = posArray[i * 3 + 2]

        for (let j = i + 1; j < particleCount; j++) {
          if (connectionsForI >= MAX_CONNECTIONS_PER_PARTICLE) break
          if (segmentIndex >= maxSegments) break

          const dx = ix - posArray[j * 3]
          const dy = iy - posArray[j * 3 + 1]
          const dz = iz - posArray[j * 3 + 2]
          const distSq = dx * dx + dy * dy + dz * dz // avoid sqrt entirely

          if (distSq < maxDistSq) {
            const base = segmentIndex * 6
            lineArray[base]     = ix
            lineArray[base + 1] = iy
            lineArray[base + 2] = iz
            lineArray[base + 3] = posArray[j * 3]
            lineArray[base + 4] = posArray[j * 3 + 1]
            lineArray[base + 5] = posArray[j * 3 + 2]
            segmentIndex++
            connectionsForI++
          }
        }
      }

      lineGeometry.setDrawRange(0, segmentIndex * 2)
      lineGeometry.attributes.position.needsUpdate = true

      // Lerped parallax rotation — smoother and frame-rate independent enough
      rotX += (mouseY * 0.05 - rotX) * 0.05
      rotY += (mouseX * 0.05 - rotY) * 0.05
      scene.rotation.x = rotX
      scene.rotation.y = rotY

      renderer.render(scene, camera)
    }

    animate(0)

    // ── Cleanup — prevents memory leaks across client-side route changes ──
    return () => {
      cancelAnimationFrame(frameId)
      if(resizeTimeout) clearTimeout(resizeTimeout);
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibility)
      reduceMotionQuery.removeEventListener?.('change', handleMotionChange)
      intersectionObserver.disconnect()

      particleGeometry.dispose()
      particleMaterial.dispose()
      lineGeometry.dispose()
      lineMaterial.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
