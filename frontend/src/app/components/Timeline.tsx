import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState, useEffect, ChangeEvent } from 'react';
import { Briefcase, Calendar, ArrowDown, ArrowUp } from 'lucide-react';

interface Experience {
  company: string;
  position: string;
  period: string;
  year: number;
  description: string;
  achievements: string[];
  color: string;
}

const experiences: Experience[] = [
  {
    company: 'TechCorp Inc.',
    position: 'Senior Full Stack Developer',
    period: '2024 - Present',
    year: 2024,
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
    period: '2023 - 2024',
    year: 2023,
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
    period: '2022 - 2023',
    year: 2022,
    description: 'Created responsive websites and web applications for diverse clients. Focused on performance optimization and user experience.',
    achievements: [
      'Delivered 20+ client projects',
      'Achieved 95+ Lighthouse scores',
      'Developed reusable templates'
    ],
    color: 'from-orange-500 to-red-500'
  }
];

function YearMarker({ year, index, totalYears, scrollYProgress, hasExperience }: { year: number, index: number, totalYears: number, scrollYProgress: any, hasExperience: Experience | undefined }) {
  const position = (index / (totalYears - 1)) * 100;
  const yearProgress = 0.1 + (index / (totalYears - 1)) * 0.8;
  
  const scaleDot = useTransform(scrollYProgress, [yearProgress - 0.1, yearProgress, yearProgress + 0.1], [1, hasExperience ? 2 : 1.5, 1]);
  const opacityDot = useTransform(scrollYProgress, [yearProgress - 0.05, yearProgress, yearProgress + 0.05], [0.3, 1, 0.3]);
  const opacityLabel = useTransform(scrollYProgress, [yearProgress - 0.15, yearProgress - 0.05, yearProgress + 0.15], [0, 1, 0.5]);
  const scaleLabel = useTransform(scrollYProgress, [yearProgress - 0.1, yearProgress], [0.8, 1]);
  
  const pulseScale = useTransform(scrollYProgress, [yearProgress - 0.05, yearProgress, yearProgress + 0.05], [0, 1, 0]);
  const pulseOpacity = useTransform(scrollYProgress, [yearProgress - 0.05, yearProgress, yearProgress + 0.05], [0, 0.6, 0]);

  return (
    <div className="absolute top-1/2 w-full">
      {/* Container for the Year marker at exactly `position` */}
      <div className="absolute top-0" style={{ left: `${position}%` }}>
        <motion.div className="absolute w-6 h-6 -translate-y-1/2 -translate-x-1/2" style={{ scale: scaleDot, transformOrigin: 'center' }}>
          <div className={`absolute inset-0 rounded-full border-2 ${hasExperience ? 'border-gray-900 dark:border-white bg-white dark:bg-gray-900' : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800'}`} />
          <motion.div
            className={`absolute inset-0 rounded-full ${hasExperience ? `bg-gradient-to-br ${hasExperience.color}` : 'bg-gray-500'}`}
            style={{ opacity: opacityDot }}
          />
        </motion.div>

        <motion.div
          className="absolute top-8 -translate-x-1/2 whitespace-nowrap"
          style={{ opacity: opacityLabel, scale: scaleLabel }}
        >
          <div className={`px-4 py-2 rounded-lg text-base font-bold ${hasExperience ? `bg-gradient-to-r ${hasExperience.color} text-white shadow-lg` : 'bg-gray-200 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400'}`}>
            {year}
          </div>
        </motion.div>

        {hasExperience && (
          <motion.div className="absolute w-12 h-12 -translate-y-1/2 -translate-x-1/2" style={{ scale: pulseScale, opacity: pulseOpacity }}>
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${hasExperience.color} animate-pulse blur-xl`} />
          </motion.div>
        )}
      </div>

      {/* Render sub-points (May, September) only if not the last year */}
      {index < totalYears - 1 && (
        <>
          <SubPoint month="May" distanceFraction={4/12} yearProgress={yearProgress} nextYearProgress={0.1 + ((index + 1) / (totalYears - 1)) * 0.8} baseX={position} nextX={(index + 1) / (totalYears - 1) * 100} scrollYProgress={scrollYProgress} />
          <SubPoint month="Sep" distanceFraction={8/12} yearProgress={yearProgress} nextYearProgress={0.1 + ((index + 1) / (totalYears - 1)) * 0.8} baseX={position} nextX={(index + 1) / (totalYears - 1) * 100} scrollYProgress={scrollYProgress} />
        </>
      )}
    </div>
  );
}

function SubPoint({ month, distanceFraction, yearProgress, nextYearProgress, baseX, nextX, scrollYProgress }: { month: string, distanceFraction: number, yearProgress: number, nextYearProgress: number, baseX: number, nextX: number, scrollYProgress: any }) {
  const currentProgress = yearProgress + (nextYearProgress - yearProgress) * distanceFraction;
  const position = baseX + (nextX - baseX) * distanceFraction;

  const opacityLabel = useTransform(scrollYProgress, [currentProgress - 0.1, currentProgress, currentProgress + 0.1], [0.1, 0.8, 0.1]);
  
  return (
    <div className="absolute top-0" style={{ left: `${position}%` }}>
      {/* Small dot */}
      <div className="absolute w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 -translate-y-1/2 -translate-x-1/2" />
      {/* Month Label */}
      <motion.div
        className="absolute top-6 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-gray-500"
        style={{ opacity: opacityLabel }}
      >
        {month}
      </motion.div>
    </div>
  );
}

function AchievementItem({ achievement, index, yearProgress, scrollYProgress }: { achievement: string, index: number, yearProgress: number, scrollYProgress: any }) {
  const opacity = useTransform(scrollYProgress, [yearProgress - 0.03, yearProgress + (index * 0.02)], [0, 1]);
  const y = useTransform(scrollYProgress, [yearProgress - 0.03, yearProgress + (index * 0.02)], [30, 0]);

  return (
    <motion.div
      className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-sm dark:shadow-none"
      style={{ opacity, y }}
    >
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{achievement}</p>
    </motion.div>
  );
}

function ExperienceCard({ exp, index, years, scrollYProgress }: { exp: Experience, index: number, years: number[], scrollYProgress: any }) {
  const yearIndex = years.indexOf(exp.year);
  const yearProgress = 0.1 + (yearIndex / (years.length - 1)) * 0.8;
  
  // Year period is 0.8 / (length - 1). May is exactly 4/12 of the way to the next year dot.
  const segmentLength = 0.8 / (years.length - 1);
  const fadeOutThreshold = yearProgress + (segmentLength * (4 / 12));
  
  // Fade in sharply before point, hold full opacity, and fade out exactly as it hits the May sub-point.
  const opacity = useTransform(scrollYProgress, [yearProgress - 0.02, yearProgress, fadeOutThreshold - 0.02, fadeOutThreshold], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [yearProgress - 0.02, yearProgress, fadeOutThreshold - 0.02, fadeOutThreshold], [50, 0, 0, -50]);
  const scale = useTransform(scrollYProgress, [yearProgress - 0.02, yearProgress, fadeOutThreshold - 0.02, fadeOutThreshold], [0.85, 1, 1, 0.85]);
  const rotateX = useTransform(scrollYProgress, [yearProgress - 0.02, yearProgress, fadeOutThreshold - 0.02, fadeOutThreshold], [10, 0, 0, -10]);

  const lineOpacity = useTransform(scrollYProgress, [yearProgress - 0.02, yearProgress, fadeOutThreshold - 0.02, fadeOutThreshold], [0, 1, 1, 0]);
  const glowOpacity = useTransform(scrollYProgress, [yearProgress - 0.02, yearProgress, fadeOutThreshold - 0.02, fadeOutThreshold], [0, 0.5, 0.5, 0]);

  return (
    <motion.div
      className="absolute left-[50%] w-[90%] max-w-3xl top-[15%]"
      style={{ opacity, y, scale, rotateX, transformPerspective: 1200, x: '-50%' }}
    >
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-gray-300 dark:from-white/50 to-transparent top-full"
        style={{ height: '200px', opacity: lineOpacity }}
      />
      <div className="relative">
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${exp.color} blur-3xl rounded-3xl`}
          style={{ opacity: glowOpacity }}
        />
        <div className="relative bg-white/90 dark:bg-white/10 backdrop-blur-xl border border-gray-100 dark:border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${exp.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <Briefcase className="text-white" size={28} />
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{exp.company}</h3>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-1">
                <Calendar size={16} />
                <span className="text-base">{exp.period}</span>
              </div>
            </div>
          </div>
          <h4 className="text-2xl md:text-3xl font-semibold text-blue-400 mb-4">{exp.position}</h4>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed">{exp.description}</p>
          <div>
            <p className="text-gray-900 dark:text-white font-semibold mb-4 text-lg">Key Achievements:</p>
            <div className="grid md:grid-cols-3 gap-4">
              {exp.achievements.map((achievement, i) => (
                <AchievementItem key={i} achievement={achievement} index={i} yearProgress={yearProgress} scrollYProgress={scrollYProgress} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Timeline() {
  const containerRef = useRef<HTMLElement>(null);
  const [showInstruction, setShowInstruction] = useState(true);
  
  const { scrollYProgress } = useScroll({
    target: containerRef as any,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowInstruction(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const startYear = 2021;
  const endYear = 2027;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  const numExperiences = experiences.length;

  const timelineWidthVw = 200;
  const timelineX = useTransform(
    scrollYProgress, 
    [0.1, 0.9], 
    ['50vw', `-${timelineWidthVw - 50}vw`]
  );

  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);
  
  const endOpactiy = useTransform(scrollYProgress, [0.92, 1], [0, 1]);
  const endY = useTransform(scrollYProgress, [0.92, 1], [20, 0]);
  const endScale = useTransform(scrollYProgress, [0.92, 1], [0.9, 1]);
  
  const progressBarWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const timelineProgressWidth = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%']);

  // Link range slider directly to scrollProgress
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      setSliderValue(latest * 100);
    });
  }, [scrollYProgress]);

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setSliderValue(newValue);
    
    if (containerRef.current) {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      const targetScrollY = window.scrollY + rect.top + (newValue / 100) * scrollableDistance;
      window.scrollTo({ top: targetScrollY, behavior: 'auto' });
    }
  };

  return (
    <section 
      ref={containerRef}
      id="experience" 
      className="relative bg-gradient-to-br from-white via-blue-50 to-white dark:from-gray-950 dark:via-black dark:to-gray-900 transition-colors duration-500"
      style={{ height: `${(numExperiences + 2) * 100}vh` }}
    >
      <motion.div
        className="fixed top-32 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: showInstruction ? 1 : 0, y: showInstruction ? 0 : -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-blue-600/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-2xl border border-blue-400/30">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <ArrowDown size={20} className="animate-bounce" />
              <ArrowUp size={20} className="animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
            <div>
              <p className="font-semibold text-lg">Scroll to Navigate Timeline</p>
              <p className="text-sm text-blue-100">Scroll up/down to move through the years</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute top-24 left-0 right-0 text-center z-10 px-6"
          style={{ opacity: headerOpacity, y: headerY }}
        >
          <p className="text-blue-400 font-medium mb-2 text-lg">Career Journey</p>
          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4">Work Experience</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">2021 - 2027: Building the Future</p>
        </motion.div>

        <motion.div className="absolute bottom-[20%] left-0 flex items-center" style={{ x: timelineX, width: `${timelineWidthVw}vw` }}>
          <div className="relative flex items-center w-full">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700" />
            <motion.div 
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-green-500 via-orange-500 via-purple-500 to-blue-500 origin-left"
              style={{ width: timelineProgressWidth }}
            />

            {years.map((year, index) => {
              const hasExperience = experiences.find(exp => exp.year === year);
              return (
                <YearMarker 
                  key={year} 
                  year={year} 
                  index={index} 
                  totalYears={years.length} 
                  scrollYProgress={scrollYProgress} 
                  hasExperience={hasExperience} 
                />
              );
            })}
          </div>
        </motion.div>

        {experiences.map((exp, index) => (
          <ExperienceCard 
            key={index}
            exp={exp}
            index={index}
            years={years}
            scrollYProgress={scrollYProgress}
          />
        ))}

        <motion.div
          className="absolute top-[40%] left-1/2 -translate-x-1/2 text-center z-10 w-full px-6 pointer-events-none"
          style={{ opacity: endOpactiy, y: endY, scale: endScale }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 mb-4">
            Looking Forward
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            to what the future brings.
          </p>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 md:w-96 group">
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="0.1"
            value={sliderValue}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full outline-none appearance-none cursor-grab active:cursor-grabbing z-50 relative"
            style={{
              background: `linear-gradient(to right, #3b82f6 ${sliderValue}%, #1f2937 ${sliderValue}%)`
            }}
          />
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Drag to Navigate
          </div>
          
          <style dangerouslySetInnerHTML={{__html: `
            input[type=range]::-webkit-slider-thumb {
              appearance: none;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: #fff;
              cursor: grab;
              box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
              transition: transform 0.1s;
            }
            input[type=range]::-webkit-slider-thumb:active {
              cursor: grabbing;
              transform: scale(1.2);
            }
          `}} />
        </div>
      </div>
    </section>
  );
}