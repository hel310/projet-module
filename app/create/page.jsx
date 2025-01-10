'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Send } from 'lucide-react'
import axios from 'axios'

export default function Create() {
  const [messages, setMessages] = useState([
    { type: 'bot', content: "Bonjour ! Je suis là pour vous aider à créer votre portfolio. Comment puis-je vous assister aujourd'hui ?" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (input.trim()) {
      setMessages(prev => [...prev, { type: 'user', content: input }])
      const userInput = input
      setInput('')
      setIsLoading(true)

      try {
        const response = await axios.post('/api/ask', { 
          message: userInput 
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        })

        if (response.data && response.data.response) {
          setMessages(prev => [...prev, { type: 'bot', content: response.data.response }])
        } else {
          throw new Error('Invalid response format')
        }
      } catch (error) {
        console.error('Error fetching bot response:', error)
        setMessages(prev => [...prev, { 
          type: 'bot', 
          content: "Désolé, une erreur s'est produite. Veuillez réessayer." 
        }])
      } finally {
        setIsLoading(false)
      }
    }
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
        <div className="bg-shape absolute top-1/3 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" data-x="-40" data-y="40"></div>
        <div className="bg-shape absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" data-x="40" data-y="-40"></div>
        <div className="bg-shape absolute top-2/3 right-1/2 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" data-x="-30" data-y="30"></div>
      </div>
      <main className="flex-grow container mx-auto px-4 py-8 mt-16 relative z-10">
        <motion.h1 
          className="text-3xl font-bold text-center mb-8 text-blue-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Créez votre portfolio avec notre assistant
        </motion.h1>
        <motion.div 
          className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg overflow-hidden max-w-2xl mx-auto relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-900'
                }`}>
                  {message.content}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-blue-100 text-blue-900">
                  Réflexion en cours...
                </div>
              </motion.div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="p-4 border-t border-blue-100">
            <div className="flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tapez votre message..."
                className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white bg-opacity-50"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}







