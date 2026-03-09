import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Briefcase, Calendar } from 'lucide-react';

export function Timeline() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const experiences = [
    {
      company: 'TechCorp Inc.',
      position: 'Senior Full Stack Developer',
      period: '2023 - Present',
      description: 'Leading development of cloud-based SaaS platform serving 100k+ users. Architected microservices infrastructure and mentored junior developers.',
      achievements: [
        'Reduced API response time by 60%',
        'Implemented CI/CD pipeline',
        'Led team of 5 developers'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      period: '2021 - 2023',
      description: 'Built and scaled web applications from concept to production. Worked across the full stack using React, Node.js, and PostgreSQL.',
      achievements: [
        'Launched 3 major product features',
        'Improved test coverage to 85%',
        'Designed component library'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      company: 'Digital Agency Co.',
      position: 'Frontend Developer',
      period: '2019 - 2021',
      description: 'Created responsive websites and web applications for diverse clients. Focused on performance optimization and user experience.',
      achievements: [
        'Delivered 20+ client projects',
        'Achieved 95+ Lighthouse scores',
        'Developed reusable templates'
      ],
      color: 'from-orange-500 to-red-500'
    },
    {
      company: 'Freelance',
      position: 'Web Developer',
      period: '2018 - 2019',
      description: 'Provided web development services to small businesses and startups. Specialized in modern JavaScript frameworks and responsive design.',
      achievements: [
        'Built 15+ websites',
        'Maintained 100% client satisfaction',
        'Established local client base'
      ],
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const numExperiences = experiences.length;

  return (
    <section 
      ref={containerRef}
      id="experience" 
      className="relative bg-black"
      style={{ height: `${numExperiences * 100}vh` }}
    >
      {/* Header Section */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [1, 0.3, 0.3, 1])
          }}
        />

        {/* Animated Background Gradient */}
        {experiences.map((exp, index) => {
          const start = index / numExperiences;
          const end = (index + 1) / numExperiences;
          const mid = (start + end) / 2;
          
          return (
            <motion.div
              key={index}
              className={`absolute inset-0 bg-gradient-to-br ${exp.color} opacity-20`}
              style={{
                opacity: useTransform(
                  scrollYProgress,
                  [start, mid, end],
                  [0, 0.3, 0]
                )
              }}
            />
          );
        })}

        {/* Title */}
        <motion.div
          className="text-center z-10 px-6"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]),
            scale: useTransform(scrollYProgress, [0, 0.1], [1, 0.8])
          }}
        >
          <p className="text-blue-400 font-medium mb-2 text-lg">Career Journey</p>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Work Experience
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Scroll to navigate through my professional journey
          </p>
        </motion.div>

        {/* Main Content Area */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          {experiences.map((exp, index) => {
            const start = index / numExperiences;
            const end = (index + 1) / numExperiences;
            const mid = (start + end) / 2;
            
            const opacity = useTransform(
              scrollYProgress,
              [start, start + 0.05, mid, end - 0.05, end],
              [0, 1, 1, 1, 0]
            );
            
            const scale = useTransform(
              scrollYProgress,
              [start, start + 0.05, mid, end - 0.05, end],
              [0.5, 1, 1, 1, 0.5]
            );

            const y = useTransform(
              scrollYProgress,
              [start, mid, end],
              [100, 0, -100]
            );

            const rotateX = useTransform(
              scrollYProgress,
              [start, mid, end],
              [15, 0, -15]
            );

            return (
              <motion.div
                key={index}
                className="absolute max-w-4xl w-full"
                style={{
                  opacity,
                  scale,
                  y,
                  rotateX,
                  transformPerspective: 1200
                }}
              >
                <div className="relative">
                  {/* Glowing effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${exp.color} opacity-20 blur-3xl rounded-3xl`} />
                  
                  {/* Card */}
                  <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
                    {/* Company Badge */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${exp.color} flex items-center justify-center`}>
                        <Briefcase className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white">
                          {exp.company}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 mt-1">
                          <Calendar size={16} />
                          <span>{exp.period}</span>
                        </div>
                      </div>
                    </div>

                    {/* Position */}
                    <h4 className="text-xl md:text-2xl font-semibold text-blue-400 mb-4">
                      {exp.position}
                    </h4>

                    {/* Description */}
                    <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Achievements */}
                    <div>
                      <p className="text-white font-semibold mb-3 text-lg">Key Achievements:</p>
                      <div className="grid md:grid-cols-3 gap-4">
                        {exp.achievements.map((achievement, i) => (
                          <motion.div
                            key={i}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
                            style={{
                              opacity: useTransform(
                                scrollYProgress,
                                [start + 0.05, start + 0.1 + (i * 0.02)],
                                [0, 1]
                              ),
                              y: useTransform(
                                scrollYProgress,
                                [start + 0.05, start + 0.1 + (i * 0.02)],
                                [20, 0]
                              )
                            }}
                          >
                            <p className="text-gray-300 text-sm">{achievement}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="mt-8 flex items-center justify-center gap-2">
                      {experiences.map((_, i) => (
                        <motion.div
                          key={i}
                          className="h-1 bg-white/20 rounded-full"
                          style={{
                            width: i === index ? 40 : 8,
                            backgroundColor: i === index ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Vertical Timeline Progress Indicator */}
        <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 h-64">
          <div className="relative w-1 h-full bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"
              style={{
                height: useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
              }}
            />
          </div>
          
          {/* Timeline dots */}
          <div className="absolute inset-0">
            {experiences.map((_, index) => {
              const position = (index / (numExperiences - 1)) * 100;
              const start = index / numExperiences;
              const end = (index + 1) / numExperiences;
              const mid = (start + end) / 2;
              
              return (
                <motion.div
                  key={index}
                  className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full"
                  style={{
                    top: `${position}%`,
                    scale: useTransform(
                      scrollYProgress,
                      [start, mid, end],
                      [1, 2, 1]
                    )
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Year indicator */}
        <motion.div
          className="absolute left-8 md:left-16 bottom-16 text-white"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1])
          }}
        >
          <div className="text-sm text-gray-400 mb-1">Current Position</div>
          {experiences.map((exp, index) => {
            const start = index / numExperiences;
            const end = (index + 1) / numExperiences;
            const mid = (start + end) / 2;
            
            return (
              <motion.div
                key={index}
                className="text-4xl md:text-6xl font-bold"
                style={{
                  opacity: useTransform(
                    scrollYProgress,
                    [start, mid, end],
                    [0, 1, 0]
                  ),
                  position: 'absolute'
                }}
              >
                {exp.period.split(' - ')[0]}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}