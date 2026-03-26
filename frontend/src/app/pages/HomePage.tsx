import { Github, Linkedin, Mail, ArrowRight, FileText } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { useContent } from '../context/ContentContext';
import { BackgroundOrbs } from '../components/BackgroundOrbs';

export function HomePage() {
  const { content } = useContent();
  return (
    <div id="home" className="relative min-h-screen flex items-center justify-center pt-20 px-6 bg-gray-50 dark:bg-gray-950 transition-colors overflow-hidden">
      <BackgroundOrbs />
      <div className="relative z-10 max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center py-12">
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="space-y-2">
            <motion.p 
              className="text-blue-600 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Hello, I'm
            </motion.p>
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Ethan Ho
            </motion.h1>
            <motion.h2 
              className="text-2xl md:text-4xl text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Full Stack Developer & Designer
            </motion.h2>
          </div>

          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            I craft beautiful, functional digital experiences that make a difference. 
            Passionate about clean code, intuitive design, and solving complex problems.
          </motion.p>

          <motion.div 
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link
              to="/projects"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              View My Work
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 border-2 border-gray-900 dark:border-gray-300 text-gray-900 dark:text-gray-300 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-300 hover:text-white dark:hover:text-gray-950 transition-colors font-medium"
            >
              Learn More
            </Link>
          </motion.div>

          <motion.div 
            className="flex flex-wrap items-center gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <a href={content?.socials.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
              <Github size={24} />
            </a>
            <a href={content?.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
              <Linkedin size={24} />
            </a>
            <a href={`mailto:${content?.contact.email}`} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
              <Mail size={24} />
            </a>
            {content?.socials?.resume && (
              <a href={content.socials.resume} target="_blank" rel="noopener noreferrer" className="ml-2 flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full transition-colors">
                <FileText size={18} />
                View Resume
              </a>
            )}
          </motion.div>
        </motion.div>

        <motion.div 
          className="relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <motion.div 
            className="aspect-square rounded-2xl overflow-hidden shadow-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1613759612065-d5971d32ca49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzI5MzUxMDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Ethan Ho"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div 
            className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600 rounded-2xl -z-10"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
          <motion.div 
            className="absolute -top-6 -left-6 w-32 h-32 bg-blue-100 rounded-2xl -z-10"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
        </motion.div>
      </div>
    </div>
  );
}
