import { Wrench } from 'lucide-react';
import { motion } from 'motion/react';
import { BackgroundOrbs } from '../components/BackgroundOrbs';
import { Link } from 'react-router';

export function ProjectsPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center pt-24 pb-20 px-6 bg-gray-50 dark:bg-gray-950 transition-colors overflow-hidden">
      <BackgroundOrbs />
      <div className="relative z-10 max-w-2xl mx-auto w-full">
        <motion.div 
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl text-center border border-white/20 dark:border-gray-700/50"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            initial={{ rotate: -15 }}
            animate={{ rotate: 15 }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: 2,
              ease: "easeInOut"
            }}
            className="inline-block mb-8"
          >
            <div className="p-6 bg-blue-100/50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400 shadow-inner">
              <Wrench size={56} strokeWidth={1.5} />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Under Construction
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-lg mx-auto">
            I'm currently revamping my projects portfolio. Please check back soon to see my latest work!
          </p>
          <div className="flex justify-center">
            <Link 
              to="/"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              Return Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
