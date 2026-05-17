'use client'

import { useEffect, useRef, useState } from 'react'

interface FrameProps {
  path: string
  viewportWidth: number
  screenW: number
  screenH: number
  label: string
}

function LiveIframe({ path, viewportWidth, screenW, screenH, label }: FrameProps) {
  const [src, setSrc] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef    = useRef<HTMLIFrameElement>(null)
  const overlayRef   = useRef<HTMLDivElement>(null)
  const drag    = useRef({ active: false, startY: 0, baseScroll: 0 })
  const rafId   = useRef(0)
  const latestY = useRef(0)

  const scale  = screenW / viewportWidth
  const frameH = Math.ceil(screenH / scale) + 600

  // Lazy-load - mount iframe only when section nears viewport.
  // requestIdleCallback defers the actual src assignment to idle time
  // so iframe JS parsing doesn't stutter the Three.js RAF loop.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let idleCb = 0
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        obs.disconnect()
        const origin = window.location.origin + path
        if (typeof requestIdleCallback !== 'undefined') {
          idleCb = requestIdleCallback(() => setSrc(origin), { timeout: 2500 })
        } else {
          setTimeout(() => setSrc(origin), 100)
        }
      },
      { rootMargin: '300px' }
    )
    obs.observe(el)
    return () => {
      obs.disconnect()
      if (idleCb) cancelIdleCallback(idleCb)
    }
  }, [path])

  // Release drag on global mouseup (even if cursor leaves overlay)
  useEffect(() => {
    const stop = () => {
      drag.current.active = false
      if (rafId.current) { cancelAnimationFrame(rafId.current); rafId.current = 0 }
      overlayRef.current?.removeAttribute('data-drag')
    }
    window.addEventListener('mouseup', stop)
    return () => window.removeEventListener('mouseup', stop)
  }, [])

  // Native passive wheel - React synthetic wheel can't be passive, causing jank
  useEffect(() => {
    const el = overlayRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      iframeRef.current?.contentWindow?.scrollBy(0, e.deltaY / scale)
    }
    el.addEventListener('wheel', onWheel, { passive: true })
    return () => el.removeEventListener('wheel', onWheel)
  }, [scale])

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    const win = iframeRef.current?.contentWindow
    if (!win) return
    drag.current = { active: true, startY: e.clientY, baseScroll: win.scrollY }
    overlayRef.current?.setAttribute('data-drag', '')
  }

  // RAF-throttled drag - one scroll update per animation frame max
  const onMouseMove = (e: React.MouseEvent) => {
    if (!drag.current.active) return
    latestY.current = e.clientY
    if (rafId.current) return
    rafId.current = requestAnimationFrame(() => {
      rafId.current = 0
      const win = iframeRef.current?.contentWindow
      if (!win || !drag.current.active) return
      const delta = (latestY.current - drag.current.startY) / scale
      win.scrollTo(0, drag.current.baseScroll - delta)
    })
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: screenW,
        height: screenH,
        overflow: 'hidden',
        position: 'relative',
        borderRadius: 'inherit',
        // Isolates iframe repaints - prevents them from triggering parent layout
        contain: 'strict',
      }}
    >
      {!src && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #0b0e14 0%, #111827 100%)',
        }} />
      )}
      {src && (
        <iframe
          ref={iframeRef}
          src={src}
          title={label}
          style={{
            position: 'absolute', top: 0, left: 0,
            width: viewportWidth, height: frameH,
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
            border: 'none', display: 'block',
            pointerEvents: 'none',
          }}
        />
      )}
      <div
        ref={overlayRef}
        className="ds-overlay"
        style={{ position: 'absolute', inset: 0, zIndex: 15 }}
        onContextMenu={e => e.preventDefault()}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
      />
    </div>
  )
}

/* ─── Section ─── */
export default function DeviceShowcase() {
  return (
    <section className="mag-section ds-sec" aria-label="Hiển thị trên mọi thiết bị">
      <div className="ds-wrap">

        <header className="ds-hd">
          <p className="ds-label">3 viewport · 1 codebase</p>
          <h2 className="ds-h2">Mỗi kích thước<br />code riêng.</h2>
        </header>

        <div className="ds-scene" aria-label="Device mockups">

          {/* ── iPad Pro M4 - left ── */}
          <figure className="ds-ipad ds-fig">
            <div className="ds-ipad-body">
              {/* Front camera pill - top center */}
              <div className="ds-ipad-cam"  aria-hidden="true" />
              {/* Power button + Touch ID - top right edge */}
              <div className="ds-ipad-pwr"  aria-hidden="true" />
              {/* USB-C - bottom center */}
              <div className="ds-ipad-usbc" aria-hidden="true" />
              <div className="ds-ipad-screen">
                <LiveIframe
                  path="/dich-vu"
                  viewportWidth={768}
                  screenW={202}
                  screenH={289}
                  label="Trang dịch vụ trên iPad"
                />
              </div>
            </div>
          </figure>

          {/* ── MacBook Pro M4 - center hero ── */}
          <figure className="ds-browser ds-fig">
            <div className="ds-mac-lid">
              {/* Camera notch - 7.6% of display width, extends into screen from top */}
              <div className="ds-mac-notch" aria-hidden="true">
                <div className="ds-mac-cam" aria-hidden="true" />
              </div>
              <div className="ds-mac-screen">
                <div className="ds-chrome">
                  <div className="ds-tl"><i /><i /><i /></div>
                  <div className="ds-url">
                    <svg width="7" height="9" viewBox="0 0 8 10" fill="none" aria-hidden="true">
                      <rect x=".75" y="4.25" width="6.5" height="5" rx="1" fill="rgba(255,255,255,.18)" />
                      <path d="M2 4.25V2.75a1.75 1.75 0 013.5 0v1.5" stroke="rgba(255,255,255,.18)" strokeWidth="1.1" fill="none" />
                    </svg>
                    <span>alodev.vn/du-an</span>
                  </div>
                  <div className="ds-chrome-r"><i /><i /><i /></div>
                </div>
                <div className="ds-browser-screen">
                  <LiveIframe
                    path="/du-an"
                    viewportWidth={1440}
                    screenW={576}
                    screenH={380}
                    label="Trang dự án trên Desktop"
                  />
                </div>
              </div>
            </div>
          </figure>

          {/* ── iPhone 16 Pro - right ── */}
          <figure className="ds-iphone ds-fig">
            <div className="ds-iphone-body">
              <div className="ds-iphone-screen">
                <div className="ds-di" aria-hidden="true" />
                <LiveIframe
                  path="/du-an"
                  viewportWidth={390}
                  screenW={152}
                  screenH={329}
                  label="Trang dự án trên iPhone"
                />
              </div>
              <div className="ds-act"      aria-hidden="true" />
              <div className="ds-vol1"     aria-hidden="true" />
              <div className="ds-vol2"     aria-hidden="true" />
              <div className="ds-pwr"      aria-hidden="true" />
              <div className="ds-cam-ctrl" aria-hidden="true" />
            </div>
          </figure>

        </div>
      </div>
    </section>
  )
}
