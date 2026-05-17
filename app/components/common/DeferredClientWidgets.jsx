"use client"

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const ContactModal = dynamic(() => import('@/app/components/common/ContactModal'), { ssr: false })
const RegisterModal = dynamic(() => import('@/app/components/common/RegisterModal'), { ssr: false })
const FloatingWhatsApp = dynamic(() => import('@/app/components/common/FloatingWhatsApp'), { ssr: false })
const PWAInstallPrompt = dynamic(() => import('@/app/components/common/PWAInstallPrompt'), { ssr: false })

export default function DeferredClientWidgets() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const handleTrigger = () => {
      setMounted(true)
    }

    // Trigger on scroll, touch, or mouse interaction
    window.addEventListener('scroll', handleTrigger, { passive: true })
    window.addEventListener('touchstart', handleTrigger, { passive: true })
    window.addEventListener('mousemove', handleTrigger, { passive: true })

    // Safe fallback after 3.5 seconds
    const timer = setTimeout(handleTrigger, 3500)

    return () => {
      window.removeEventListener('scroll', handleTrigger)
      window.removeEventListener('touchstart', handleTrigger)
      window.removeEventListener('mousemove', handleTrigger)
      clearTimeout(timer)
    }
  }, [])

  if (!mounted) return null

  return (
    <>
      <ContactModal />
      <RegisterModal />
      <FloatingWhatsApp />
      <PWAInstallPrompt />
    </>
  )
}
