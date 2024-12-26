'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Footer from '@/components/Footer'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
  const [userName, setUserName] = useState(null)

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName')
    if (storedUserName) {
      setUserName(storedUserName)
    }

    const handleStorage = () => {
      const currentUserName = localStorage.getItem('userName')
      setUserName(currentUserName)
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <Hero />
      <Features />
      <Footer />
    </main>
  )
}

