'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Contact() {
const [formState, setFormState] = useState({
  name: '',
  email: '',
  message: ''
})
const [isSubmitting, setIsSubmitting] = useState(false)
const [submitMessage, setSubmitMessage] = useState('')

const handleChange = (e) => {
  setFormState({
    ...formState,
    [e.target.name]: e.target.value
  })
}

const handleSubmit = async (e) => {
  e.preventDefault()
  setIsSubmitting(true)
  // Simulate form submission
  await new Promise(resolve => setTimeout(resolve, 2000))
  setIsSubmitting(false)
  setSubmitMessage('Merci pour votre message. Nous vous contacterons bientôt!')
  setFormState({ name: '', email: '', message: '' })
}

useEffect(() => {
  const handleMouseMove = (e) => {
    const shapes = document.querySelectorAll('.bg-shape')
    const x = e.clientX / window.innerWidth
    const y = e.clientY / window.innerHeight

    shapes.forEach((shape) => {
      const shapeX = parseFloat(shape.getAttribute('data-x') || '0')
      const shapeY = parseFloat(shape.getAttribute('data-y') || '0')
      shape.style.transform = `translate(${x * shapeX}px, ${y * shapeY}px)`
    })
  }

  window.addEventListener('mousemove', handleMouseMove)
  return () => {
    window.removeEventListener('mousemove', handleMouseMove)
  }
}, [])

return (
  <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden">
    <Header />
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="bg-shape absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{top: '-32px', left: '-32px'}} data-x="20" data-y="20"></div>
      <div className="bg-shape absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" style={{top: '-48px', right: '-48px'}} data-x="-20" data-y="20"></div>
      <div className="bg-shape absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" style={{bottom: '-48px', left: '-48px'}} data-x="20" data-y="-20"></div>
    </div>
    <main className="flex-grow container mx-auto px-4 py-8 pb-16 mt-16 relative z-10">
      <motion.h1 
        className="text-3xl font-bold text-center mb-8 text-blue-900"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Contactez-nous
      </motion.h1>
      <motion.div 
        className="max-w-md mx-auto bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg overflow-hidden relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-blue-900">
                Nom
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm py-2 px-3 bg-white bg-opacity-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-900">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm py-2 px-3 bg-white bg-opacity-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-blue-900">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formState.message}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm py-2 px-3 bg-white bg-opacity-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              ></textarea>
            </div>
            <div>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition duration-150 ease-in-out"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
              </motion.button>
            </div>
          </form>
          {submitMessage && (
            <motion.p 
              className="mt-4 text-sm text-green-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {submitMessage}
            </motion.p>
          )}
        </div>
      </motion.div>
    </main>
    <Footer />
  </div>
)
}

