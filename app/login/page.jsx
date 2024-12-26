'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Facebook, Linkedin, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const router = useRouter()

  const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!isValidEmail(formState.email)) {
      setError('Veuillez entrer une adresse email valide')
      return
    }

    if (!isLogin && formState.name.trim().length < 2) {
      setError('Le nom doit contenir au moins 2 caractères')
      return
    }

    if (formState.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    try {
      const endpoint = isLogin ? '/api/users/login' : '/api/users/register'
      const { data } = await axios.post(`http://localhost:5000${endpoint}`, formState)
      localStorage.setItem('token', data.token)
      localStorage.setItem('userName', data.name)
      setSuccess(isLogin ? 'Connexion réussie!' : 'Inscription réussie!')
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (error) {
      setError(error.response?.data?.message || 'Une erreur est survenue')
    }
  }

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    })
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

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { 
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  }

  const slideVariants = {
    left: { x: 0 },
    right: { x: "100%" }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bg-shape absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{top: '-32px', left: '-32px'}} data-x="20" data-y="20"></div>
        <div className="bg-shape absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" style={{top: '-48px', right: '-48px'}} data-x="-20" data-y="20"></div>
        <div className="bg-shape absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" style={{bottom: '-48px', left: '-48px'}} data-x="20" data-y="-20"></div>
      </div>
      <button 
        onClick={() => {
          console.log('Arrow button clicked');
          router.back();
        }} 
        className="absolute top-4 left-4 p-2 rounded-full bg-white shadow-md hover:bg-blue-50 transition-colors z-50 cursor-pointer"
        aria-label="Retour à la page précédente"
      >
        <ArrowLeft className="w-6 h-6 text-blue-600" />
      </button>
      <main className="flex-grow flex items-center justify-center px-4 py-16 relative z-10">
        <motion.div 
          className="relative w-full max-w-4xl min-h-[600px] bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="absolute top-0 left-0 w-full h-full">
            <motion.div 
              className="absolute top-0 h-full w-1/2"
              variants={slideVariants}
              animate={isLogin ? "left" : "right"}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <AnimatePresence mode="wait">
                <motion.div 
                  key={isLogin ? "login" : "signup"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center h-full px-8 py-12"
                >
                  <h1 className="text-3xl font-bold text-blue-900 mb-6">
                    {isLogin ? "Se connecter" : "Créer un compte"}
                  </h1>
                  <div className="flex gap-4 mb-6">
                    <a href="#" className="p-2 rounded-lg border-2 border-blue-100 hover:border-blue-200 transition-colors">
                      <Github className="w-6 h-6 text-blue-900" />
                    </a>
                    <a href="#" className="p-2 rounded-lg border-2 border-blue-100 hover:border-blue-200 transition-colors">
                      <Facebook className="w-6 h-6 text-blue-900" />
                    </a>
                    <a href="#" className="p-2 rounded-lg border-2 border-blue-100 hover:border-blue-200 transition-colors">
                      <Linkedin className="w-6 h-6 text-blue-900" />
                    </a>
                  </div>
                  <p className="text-sm text-blue-600 mb-6">ou utilisez votre email</p>
                  <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                    {!isLogin && (
                      <input
                        type="text"
                        name="name"
                        placeholder="Nom"
                        value={formState.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-50 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    )}
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formState.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-50 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Mot de passe"
                      value={formState.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-50 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    {isLogin && (
                      <a href="#" className="block text-sm text-blue-600 hover:text-blue-700">
                        Mot de passe oublié?
                      </a>
                    )}
                    <button
                      type="submit"
                      className="w-full py-3 px-6 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                    >
                      {isLogin ? "Se connecter" : "S'inscrire"}
                    </button>
                    {error && (
                      <motion.p 
                        className="text-red-500 text-center bg-red-100 border border-red-400 rounded-md p-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {error}
                      </motion.p>
                    )}
                    {success && (
                      <motion.p 
                        className="text-green-500 text-center bg-green-100 border border-green-400 rounded-md p-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {success}
                      </motion.p>
                    )}
                  </form>
                </motion.div>
              </AnimatePresence>
            </motion.div>
            <motion.div 
              className="absolute top-0 h-full w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white"
              variants={slideVariants}
              animate={isLogin ? "right" : "left"}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <AnimatePresence mode="wait">
                <motion.div 
                  key={isLogin ? "signup" : "login"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center h-full px-8 py-12 text-center"
                >
                  <h2 className="text-3xl font-bold mb-6">
                    {isLogin ? "Nouveau ici ?" : "Déjà inscrit ?"}
                  </h2>
                  <p className="mb-8 text-blue-100">
                    {isLogin 
                      ? "Inscrivez-vous et découvrez un monde de possibilités pour votre portfolio" 
                      : "Connectez-vous pour continuer votre voyage avec nous"}
                  </p>
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="py-3 px-6 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
                  >
                    {isLogin ? "S'inscrire" : "Se connecter"}
                  </button>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}


