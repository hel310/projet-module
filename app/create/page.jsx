'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Send, User, Bot } from 'lucide-react'
import axios from 'axios'

export default function Create() {
  const [userName, setUserName] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef(null)
  const inputRef = useRef(null)

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

  const saveMessagesToStorage = useCallback((messages) => {
    if (userName) {
      localStorage.setItem(`chatHistory_${userName}`, JSON.stringify(messages));
    } else {
      sessionStorage.setItem('tempChatHistory', JSON.stringify(messages));
    }
  }, [userName]);

  const loadMessagesFromStorage = useCallback(() => {
    if (userName) {
      const savedMessages = localStorage.getItem(`chatHistory_${userName}`);
      return savedMessages ? JSON.parse(savedMessages) : [];
    } else {
      const savedMessages = sessionStorage.getItem('tempChatHistory');
      return savedMessages ? JSON.parse(savedMessages) : [];
    }
  }, [userName]);

  useEffect(() => {
    const storedMessages = loadMessagesFromStorage();
    if (storedMessages.length > 0) {
      setMessages(storedMessages);
    } else {
      setMessages([
        { 
          type: 'bot', 
          content: userName 
            ? `Bonjour ${userName} ! Je suis là pour vous aider à créer votre portfolio. Comment puis-je vous assister aujourd'hui ?`
            : "Bonjour ! Je suis là pour vous aider à créer votre portfolio. Comment puis-je vous assister aujourd'hui ? Votre conversation sera sauvegardée pour cette session, mais si vous souhaitez la conserver à long terme, n'oubliez pas de vous connecter."
        }
      ]);
    }
  }, [userName, loadMessagesFromStorage]);

  useEffect(() => {
    if (messages.length > 0) {
      saveMessagesToStorage(messages);
    }
  }, [messages, saveMessagesToStorage]);

  const scrollToNewMessage = () => {
    if (chatContainerRef.current) {
      const lastMessage = chatContainerRef.current.lastElementChild;
      if (lastMessage) {
        const scrollOptions = {
          top: lastMessage.offsetTop - 20,
          behavior: 'smooth'
        };
        chatContainerRef.current.scrollTo(scrollOptions);
      }
    }
  }

  const focusInput = () => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  useEffect(() => {
    scrollToNewMessage()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (input.trim()) {
      const newUserMessage = { type: 'user', content: input }
      const updatedMessages = [...messages, newUserMessage];
      setMessages(updatedMessages);
      const userInput = input
      setInput('')
      setIsLoading(true)

      try {
        const response = await axios.post('/api/ask', { 
          message: userInput,
          history: updatedMessages
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        })

        if (response.data && response.data.response) {
          const newBotMessage = { type: 'bot', content: response.data.response };
          setMessages(prev => {
            const newMessages = [...prev, newBotMessage];
            saveMessagesToStorage(newMessages);
            focusInput();
            return newMessages;
          });
        } else {
          throw new Error('Invalid response format')
        }
      } catch (error) {
        console.error('Error fetching bot response:', error)
        setMessages(prev => {
          const errorMessage = { 
            type: 'bot', 
            content: "Désolé, une erreur s'est produite. Veuillez réessayer." 
          };
          const newMessages = [...prev, errorMessage];
          saveMessagesToStorage(newMessages);
          return newMessages;
        })
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
          Créez votre portfolio avec notre assistant
        </motion.h1>
        {!userName && (
          <motion.div
            className="text-center mb-4 p-2 bg-yellow-100 border border-yellow-300 rounded-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-yellow-800">
              Vous n'êtes pas connecté. Votre conversation sera sauvegardée pour cette session, mais sera perdue si vous fermez le site. 
              <a href="/login" className="text-blue-600 hover:text-blue-800 ml-2 underline">Se connecter</a>
            </p>
          </motion.div>
        )}
        <motion.div 
          className="max-w-3xl mx-auto bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg overflow-hidden flex flex-col h-[calc(100vh-300px)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div 
            ref={chatContainerRef}
            className="flex-grow overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100"
          >
            {messages.map((message, index) => (
              <motion.div
                key={`message-${index}`}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`p-2 rounded-full ${
                    message.type === 'user' ? 'bg-blue-500' : 'bg-gray-200'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.type === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {message.type === 'bot' ? (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    ) : (
                      message.content
                    )}
                  </div>
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
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-full bg-gray-200">
                    <Bot className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="p-3 rounded-lg bg-gray-100 text-gray-800">
                    Réflexion en cours...
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tapez votre message..."
                className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-50"
                disabled={isLoading}
                ref={inputRef}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}

