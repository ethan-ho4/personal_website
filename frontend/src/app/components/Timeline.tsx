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

import { useContent, ExperienceItem, TimelineContent } from '../context/ContentContext';

function YearMarker({ year, index, totalYears, scrollYProgress, hasExperience }: { year: number, index: number, totalYears: number, scrollYProgress: any, hasExperience: ExperienceItem | undefined }) {
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
            January {year}
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

function ExpMarkerPoint({ marker, scrollYProgress }: { marker: { label: string, progressFraction: number, progress: number }, scrollYProgress: any }) {
  const position = marker.progressFraction * 100;
  const opacityLabel = useTransform(scrollYProgress, [marker.progress - 0.1, marker.progress, marker.progress + 0.1], [0.1, 1, 0.1]);
  
  return (
    <div className="absolute top-0 z-20" style={{ left: `${position}%` }}>
      <div className="absolute w-4 h-4 rounded-full bg-blue-500 border-[3px] border-white dark:border-gray-900 -translate-y-1/2 -translate-x-1/2" />
      <motion.div
        className="absolute top-20 -translate-x-1/2 whitespace-nowrap text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded shadow-sm border border-blue-100 dark:border-blue-800"
        style={{ opacity: opacityLabel }}
      >
        {marker.label}
      </motion.div>
    </div>
  );
}

function AchievementItem({ achievement, index, startProgress, scrollYProgress }: { achievement: string, index: number, startProgress: number, scrollYProgress: any }) {
  const itemStart = startProgress + 0.01 + (index * 0.01);
  const opacity = useTransform(scrollYProgress, [itemStart - 0.02, itemStart], [0, 1]);
  const y = useTransform(scrollYProgress, [itemStart - 0.02, itemStart], [20, 0]);

  return (
    <motion.div
      className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-sm dark:shadow-none"
      style={{ opacity, y }}
    >
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{achievement}</p>
    </motion.div>
  );
}

function ExperienceCard({ exp, index, years, scrollYProgress, totalCards }: { exp: ExperienceItem, index: number, years: number[], scrollYProgress: any, totalCards: number }) {
  const startYearRange = years[0];
  const endYearRange = years[years.length - 1];

  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  // Calculate Start Anchor
  const sYearVal = exp.startYear ? parseInt(exp.startYear as string) : (Number(exp.year) || startYearRange);
  const sMonthIdx = MONTHS.indexOf(exp.startMonth as string) !== -1 ? MONTHS.indexOf(exp.startMonth as string) : 0;
  const startAnchor = sYearVal + (sMonthIdx / 12);
  
  // Calculate End Anchor
  let endAnchor = startAnchor + 0.5; // fallback
  if (exp.isCurrent) {
    const d = new Date();
    endAnchor = d.getFullYear() + (d.getMonth() / 12);
  } else if (exp.endYear) {
    const eYearVal = parseInt(exp.endYear as string) || sYearVal;
    const eMonthIdx = MONTHS.indexOf(exp.endMonth as string) !== -1 ? MONTHS.indexOf(exp.endMonth as string) : 11;
    endAnchor = eYearVal + ((eMonthIdx + 1) / 12);
  } else if (exp.period && exp.period.includes('-')) {
    endAnchor = startAnchor + 1; // legacy fallback
  }

  const getProgress = (anchor: number) => {
    const clamped = Math.max(startYearRange, Math.min(anchor, endYearRange));
    const fraction = (clamped - startYearRange) / (endYearRange - startYearRange);
    return 0.1 + (fraction * 0.8);
  };

  const startProgress = getProgress(startAnchor);
  let endProgress = getProgress(endAnchor);
  if (endProgress <= startProgress + 0.02) {
      endProgress = startProgress + 0.05;
  }

  const opacity = useTransform(scrollYProgress, [startProgress - 0.02, startProgress, endProgress, endProgress + 0.02], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [startProgress - 0.02, startProgress, endProgress, endProgress + 0.02], [50, 0, 0, -50]);
  const scale = useTransform(scrollYProgress, [startProgress - 0.02, startProgress, endProgress, endProgress + 0.02], [0.95, 1, 1, 0.95]);
  const rotateX = useTransform(scrollYProgress, [startProgress - 0.02, startProgress, endProgress, endProgress + 0.02], [5, 0, 0, -5]);

  const lineOpacity = useTransform(scrollYProgress, [startProgress - 0.02, startProgress, endProgress, endProgress + 0.02], [0, 1, 1, 0]);
  const glowOpacity = useTransform(scrollYProgress, [startProgress - 0.02, startProgress, endProgress, endProgress + 0.02], [0, 0.5, 0.5, 0]);
  
  // Stagger overlapping cards to prevent them directly occluding one another
  const topOffset = 15 + (index * 2);

  return (
    <motion.div
      className="absolute left-[50%] w-[90%] max-w-3xl"
      style={{ top: `${topOffset}%`, opacity, y, scale, rotateX, transformPerspective: 1200, x: '-50%' }}
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
                <AchievementItem key={i} achievement={achievement} index={i} startProgress={startProgress} scrollYProgress={scrollYProgress} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Timeline() {
  const { content, loading } = useContent();
  if (loading || !content) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />;
  return <TimelineInner timelineContent={content.timeline} />;
}

function TimelineInner({ timelineContent }: { timelineContent: TimelineContent }) {
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

  const { title, subtitle, experiences } = timelineContent;
  
  const allYears: number[] = [];
  experiences.forEach(e => {
    if (!isNaN(Number(e.year))) allYears.push(Number(e.year));
    if (e.startYear && !isNaN(parseInt(e.startYear as string))) allYears.push(parseInt(e.startYear as string));
    if (e.endYear && !isNaN(parseInt(e.endYear as string))) allYears.push(parseInt(e.endYear as string));
    if (e.isCurrent) allYears.push(new Date().getFullYear());
  });
  
  const minYear = allYears.length > 0 ? Math.min(Math.floor(Math.min(...allYears)), 2021) : 2021;
  const maxYear = allYears.length > 0 ? Math.max(Math.ceil(Math.max(...allYears)), 2025) : 2025;
  
  const startYear = minYear - 1;
  const endYear = maxYear + 1;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  const numExperiences = experiences.length;

  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const experienceMarkers: { label: string, progressFraction: number, progress: number }[] = [];
  experiences.forEach(e => {
     const sY = e.startYear ? parseInt(e.startYear as string) : (Number(e.year) || startYear);
     const sM = MONTHS.indexOf(e.startMonth as string);
     if (sM > 0) { // Don't plot Jan, already handled by YearMarker
       const sAnchor = sY + (sM / 12);
       const sFrac = (sAnchor - startYear) / (endYear - startYear);
       experienceMarkers.push({ label: `${e.startMonth?.substring(0,3)} ${sY}`, progressFraction: sFrac, progress: 0.1 + sFrac * 0.8 });
     }
     
     if (!e.isCurrent && e.endYear) {
       const eM = MONTHS.indexOf(e.endMonth as string);
       if (eM >= 0) { // eM could be 0 (Jan), it's fine to plot "Jan End"
         const eY = parseInt(e.endYear as string) || sY;
         const eAnchor = eY + ((eM + 1) / 12);
         const eFrac = (eAnchor - startYear) / (endYear - startYear);
         experienceMarkers.push({ label: `${e.endMonth?.substring(0,3)} ${eY}`, progressFraction: eFrac, progress: 0.1 + eFrac * 0.8 });
       }
     }
  });

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

  const parallaxX = useTransform(scrollYProgress, [0, 1], ["0vw", "-100vw"]);

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
      className="relative bg-gray-50 dark:bg-gray-950 transition-colors duration-500"
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
        
        {/* Parallax Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#bae6fd,transparent)] dark:bg-[radial-gradient(circle_800px_at_50%_200px,#1e3a8a,transparent)] opacity-60" />
          
          <motion.div style={{ x: parallaxX }} className="absolute inset-y-0 left-0 w-[200vw] h-full">
            <motion.div 
              animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-[10%] left-[5vw] w-[500px] h-[500px] rounded-full bg-blue-400/60 dark:bg-blue-600/40 blur-[90px]"
            />
            
            <motion.div 
              animate={{ x: [0, -120, 0], y: [0, 80, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[40%] left-[80vw] w-[600px] h-[600px] rounded-full bg-purple-400/50 dark:bg-purple-800/40 blur-[90px]"
            />
            
            <motion.div 
              animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-[20%] left-[120vw] w-[700px] h-[700px] rounded-full bg-cyan-300/50 dark:bg-cyan-800/30 blur-[100px]"
            />

            <motion.div 
              animate={{ x: [0, 80, 0], y: [0, 100, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[20%] left-[170vw] w-[600px] h-[600px] rounded-full bg-blue-300/60 dark:bg-blue-700/40 blur-[90px]"
            />
          </motion.div>
        </div>

        <motion.div
          className="absolute top-24 left-0 right-0 text-center z-10 px-6"
          style={{ opacity: headerOpacity, y: headerY }}
        >
          <p className="text-blue-400 font-medium mb-2 text-lg">Career Journey</p>
          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        <motion.div className="absolute bottom-[20%] left-0 flex items-center" style={{ x: timelineX, width: `${timelineWidthVw}vw` }}>
          <div className="relative flex items-center w-full">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700" />
            <motion.div 
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-green-500 via-orange-500 via-purple-500 to-blue-500 origin-left"
              style={{ width: timelineProgressWidth }}
            />

            {years.map((year, index) => {
              const hasExperience = experiences.find((exp: ExperienceItem) => Math.floor(Number(exp.year)) === year);
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
            {experienceMarkers.map((marker, i) => (
              <ExpMarkerPoint key={`m-${i}`} marker={marker} scrollYProgress={scrollYProgress} />
            ))}
          </div>
        </motion.div>

        {experiences.map((exp: ExperienceItem, index: number) => (
          <ExperienceCard 
            key={index}
            exp={exp}
            index={index}
            years={years}
            scrollYProgress={scrollYProgress}
            totalCards={experiences.length}
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