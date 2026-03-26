import { Github, Linkedin, Mail, ArrowDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useContent } from '../context/ContentContext';

// Safe icon renderer
const IconRenderer = ({ iconName, ...props }: { iconName: string, [key: string]: any }) => {
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Code;
  return <IconComponent {...props} />;
};

export function Home() {
  const { content, loading } = useContent();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading || !content) return <div className="min-h-screen py-20 bg-gray-50 dark:bg-gray-950" />;

  const homeData = content.home;

  return (
    <section id="home" className="min-h-screen pt-20 px-6 pb-32 bg-gray-50 dark:bg-gray-950 transition-colors relative">
      
      {/* 1. Hero Block */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center pt-10 md:pt-20 mb-24">
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="space-y-2">
            <motion.p 
              className="text-blue-600 font-bold uppercase tracking-widest text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Introduction
            </motion.p>
            <motion.h1 
              className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {homeData.title || "Ethan Ho"}
            </motion.h1>
            <motion.h2 
              className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {homeData.subtitle || "Full Stack Developer"}
            </motion.h2>
          </div>

          <motion.div 
            className="flex gap-4 pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-lg shadow-blue-500/30"
            >
              Get In Touch
            </button>
            <button 
              onClick={() => scrollToSection('projects')}
              className="px-8 py-4 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-xl hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-colors font-bold"
            >
              View Work
            </button>
          </motion.div>

          <motion.div 
            className="flex gap-6 pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <a href={content.socials.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-gray-900 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:shadow-md transition-all">
              <Github size={24} />
            </a>
            <a href={content.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-gray-900 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:shadow-md transition-all">
              <Linkedin size={24} />
            </a>
            <a href={`mailto:${content.contact.email}`} className="p-3 bg-white dark:bg-gray-900 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:shadow-md transition-all">
              <Mail size={24} />
            </a>
          </motion.div>
        </motion.div>

        <motion.div 
          className="relative max-w-sm mx-auto md:max-w-none"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-3xl blur-2xl opacity-20 dark:opacity-40 animate-pulse" />
          <motion.div 
            className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800"
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1613759612065-d5971d32ca49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzI5MzUxMDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Ethan Ho"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* 2. Unified About Information */}
      <div className="max-w-7xl mx-auto mt-32 relative z-10">
        {/* Quick Stats Row */}
        {homeData.stats && homeData.stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
            {homeData.stats.map((stat: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white dark:bg-gray-900/50 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 text-center hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-cyan-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-16">
          {/* Paragraphs */}
          <motion.div 
            className="lg:col-span-7 space-y-8 text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {homeData.description1 && (
              <p className="bg-white dark:bg-gray-900/40 p-8 rounded-3xl border border-gray-100 dark:border-gray-800/50 shadow-sm relative">
                <span className="text-6xl text-blue-100 dark:text-blue-900/20 absolute top-4 left-4 font-serif leading-none">"</span>
                <span className="relative z-10">{homeData.description1}</span>
              </p>
            )}
            {homeData.description2 && (
              <p className="p-6 text-gray-600 dark:text-gray-400">
                {homeData.description2}
              </p>
            )}
          </motion.div>

          {/* Highlights */}
          <motion.div 
            className="lg:col-span-5 space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {homeData.highlights && homeData.highlights.map((hlt: any, idx: number) => (
              <motion.div 
                key={idx}
                whileHover={{ x: 10, scale: 1.02 }}
                className="flex items-start gap-5 p-6 bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 group transition-all"
              >
                <div className="w-14 h-14 shrink-0 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <IconRenderer iconName={hlt.icon} size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{hlt.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-snug">
                    {hlt.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 3. Down Arrow connecting to Timeline */}
      <motion.button 
        onClick={() => scrollToSection('experience')}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-14 h-14 bg-white dark:bg-gray-900 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full shadow-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center transition-all animate-bounce z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <ArrowDown size={24} />
      </motion.button>
    </section>
  );
}