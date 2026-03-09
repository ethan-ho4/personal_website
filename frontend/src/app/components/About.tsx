import { Code, Palette, Rocket, Users } from 'lucide-react';
import { motion } from 'motion/react';

export function About() {
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
    <section id="about" className="min-h-screen flex items-center justify-center py-20 px-6 bg-gray-50">
      <div className="max-w-6xl w-full">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-blue-600 font-medium mb-2">About Me</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Who I Am
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
            <p className="text-lg text-gray-700 leading-relaxed">
              I'm a full-stack developer based in San Francisco, specializing in creating 
              exceptional digital experiences. My journey in tech started with a curiosity 
              about how things work, and it's evolved into a passion for building products 
              that make a real impact.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              When I'm not coding, you'll find me exploring new design trends, contributing 
              to open-source projects, or enjoying a good cup of coffee while sketching out 
              ideas for my next project.
            </p>
          </motion.div>

          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex justify-between py-2">
              <span className="text-gray-700">Experience</span>
              <span className="font-semibold text-gray-900">5+ Years</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-700">Projects Completed</span>
              <span className="font-semibold text-gray-900">50+</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-700">Happy Clients</span>
              <span className="font-semibold text-gray-900">30+</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-700">Location</span>
              <span className="font-semibold text-gray-900">San Francisco, CA</span>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
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
                <item.icon className="text-blue-600" size={24} />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}