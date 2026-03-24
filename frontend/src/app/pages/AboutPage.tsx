import { Code, Palette, Rocket, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { BackgroundOrbs } from '../components/BackgroundOrbs';

export function AboutPage() {
  const highlights = [
    {
      icon: Code,
      title: 'Clean Code',
      description: 'Writing maintainable, scalable code that stands the test of time'
    },
    {
      icon: Palette,
      title: 'Design Focus',
      description: 'Creating beautiful interfaces with attention to every detail'
    },
    {
      icon: Rocket,
      title: 'Fast Delivery',
      description: 'Shipping quality products on time, every time'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Working seamlessly with teams to achieve shared goals'
    }
  ];

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-6 bg-gray-50 dark:bg-gray-950 transition-colors overflow-hidden">
      <BackgroundOrbs />
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-blue-600 font-medium mb-2">About Me</p>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Who I Am
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A passionate developer with 5+ years of experience building web applications 
            that users love
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              I'm a full-stack developer based in San Francisco, specializing in creating 
              exceptional digital experiences. My journey in tech started with a curiosity 
              about how things work, and it's evolved into a passion for building products 
              that make a real impact.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              When I'm not coding, you'll find me exploring new design trends, contributing 
              to open-source projects, or enjoying a good cup of coffee while sketching out 
              ideas for my next project.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              I believe in continuous learning and staying ahead of the curve. The tech 
              landscape is always evolving, and I thrive on the challenge of mastering 
              new tools and techniques to deliver better solutions.
            </p>
          </motion.div>

          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Facts</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-400">Experience</span>
                  <span className="font-semibold text-gray-900 dark:text-white">5+ Years</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-400">Projects Completed</span>
                  <span className="font-semibold text-gray-900 dark:text-white">50+</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-400">Happy Clients</span>
                  <span className="font-semibold text-gray-900 dark:text-white">30+</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-700 dark:text-gray-400">Location</span>
                  <span className="font-semibold text-gray-900 dark:text-white">San Francisco, CA</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 text-white p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-2">Available for Hire</h3>
              <p className="text-blue-100">
                I'm currently open to new opportunities and exciting projects. 
                Let's work together to create something amazing!
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => (
            <motion.div 
              key={index} 
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <motion.div 
                className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                <item.icon className="text-blue-600" size={24} />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
