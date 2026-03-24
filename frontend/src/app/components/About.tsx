import { Code, Palette, Rocket, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useContent } from '../context/ContentContext';

const iconMap: Record<string, any> = { 
  Code: Code, 
  Palette: Palette, 
  Rocket: Rocket, 
  Users: Users 
};

export function About() {
  const { content, loading } = useContent();
  if (loading || !content) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />;

  const { title, description1, description2, stats, highlights } = content.about;

  return (
    <section id="about" className="min-h-screen flex items-center justify-center py-20 px-6 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl w-full">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-blue-600 font-medium mb-2">About Me</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A passionate developer with 5+ years of experience building web applications 
            that users love
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {description1}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {description2}
            </p>
          </motion.div>

          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {stats.map((stat: { label: string; value: string }, i: number) => (
              <div key={i} className="flex justify-between py-2">
                <span className="text-gray-700 dark:text-gray-400">{stat.label}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{stat.value}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item: { icon: string; title: string; description: string }, index: number) => (
            <motion.div 
              key={index} 
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <motion.div 
                className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
              >
                {(() => {
                  const Icon = iconMap[item.icon] || Code;
                  return <Icon className="text-blue-600" size={24} />;
                })()}
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
    </section>
  );
}