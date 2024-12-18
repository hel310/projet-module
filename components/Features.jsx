'use client'
import { motion } from 'framer-motion'
import { Palette, Smartphone, Zap } from 'lucide-react'

const features = [
  {
    icon: Palette,
    title: 'Design Modern',
    description: 'Des templates élégants et professionnels'
  },
  {
    icon: Smartphone,
    title: 'Responsive',
    description: 'Parfait sur tous les appareils'
  },
  {
    icon: Zap,
    title: 'Rapide',
    description: 'Création simple et intuitive'
  }
]

export default function Features() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          className="text-3xl font-extrabold text-center text-blue-900 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Pourquoi choisir Portnest?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-blue-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2">{feature.title}</h3>
              <p className="text-blue-700">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

