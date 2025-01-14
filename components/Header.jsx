'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [userName, setUserName] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName')
    if (storedUserName) {
      setUserName(storedUserName)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    setUserName(null)
    router.push('/login')
  }

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            Portnest
          </Link>
          <nav className="hidden md:flex space-x-10">
            <Link href="/" className="text-blue-600 hover:text-blue-700 transition-colors">
              Accueil
            </Link>
            <Link href="/create" className="text-blue-600 hover:text-blue-700 transition-colors">
              Créer
            </Link>
            <Link href="/contact" className="text-blue-600 hover:text-blue-700 transition-colors">
              Contact
            </Link>
            {userName ? (
              <button onClick={handleLogout} className="text-blue-600 hover:text-blue-700 transition-colors">
                Se déconnecter
              </button>
            ) : (
              <Link href="/login" className="text-blue-600 hover:text-blue-700 transition-colors">
                Se connecter
              </Link>
            )}
          </nav>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-blue-600 hover:text-blue-700 focus:outline-none focus:text-blue-700"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isOpen ? (
                  <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828 4.828z" />
                ) : (
                  <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                Accueil
              </Link>
              <Link href="/create" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                Créer
              </Link>
              <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                Contact
              </Link>
              <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                Se connecter
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}



