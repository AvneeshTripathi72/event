"use client"

import { useState, useEffect, useRef } from 'react'

export default function LazyScrollSection({ children, placeholderHeight = '150px', rootMargin = '150px' }) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (!('IntersectionObserver' in window)) {
      setIsIntersecting(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [rootMargin])

  return (
    <div 
      ref={ref} 
      style={{ 
        minHeight: isIntersecting ? 'auto' : placeholderHeight,
        width: '100%'
      }}
    >
      {isIntersecting ? children : null}
    </div>
  )
}
