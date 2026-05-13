import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'motion/react';
import { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { Briefcase, Calendar, ChevronRight, Award, Zap, Sparkles, ArrowDown } from 'lucide-react';
import { useContent, ExperienceItem, TimelineContent } from '../context/ContentContext';

// Shooting Stars System triggered precisely by mid-scroll progress
function ShootingStars({ scrollYProgress }: { scrollYProgress: any }) {
  const opacity = useTransform(scrollYProgress, [0.15, 0.35, 0.85], [0, 1, 0]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
           key={`star-${i}`}
           className="absolute h-0.5 bg-gradient-to-r from-transparent via-cyan-200 to-transparent shadow-[0_0_20px_rgba(168,238,255,1)]"
           style={{
              width: Math.random() * 250 + 100 + "px",
              left: Math.random() * 150 + "%",
              top: Math.random() * 120 - 20 + "%",
              rotate: "-45deg",
           }}
           animate={{
              x: [0, -2000],
              y: [0, 2000],
              opacity: [0, 1, 0],
           }}
           transition={{
              duration: Math.random() * 2 + 1.5,
              repeat: Infinity,
              repeatDelay: Math.random() * 6 + 1,
              ease: "linear",
           }}
        />
      ))}
    </motion.div>
  );
}

// Background Floating Particles
function ParticleSystem() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
          initial={{
            x: Math.random() * 100 + "vw",
            y: Math.random() * 100 + "vh",
            opacity: Math.random() * 0.5 + 0.1,
            scale: Math.random() * 2,
          }}
          animate={{
            y: [null, Math.random() * -200 - 100],
            x: [null, (Math.random() - 0.5) * 100],
            opacity: [null, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function AutoFitTextContainer({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const wrapper = container.firstElementChild as HTMLElement;
    if (!wrapper) return;

    let currentFontSize = 20; // Start optimally large
    container.style.fontSize = `${currentFontSize}px`;

    let attempts = 0;
    while (wrapper.scrollHeight > container.clientHeight && currentFontSize > 9 && attempts < 45) {
      currentFontSize -= 0.25;
      container.style.fontSize = `${currentFontSize}px`;
      attempts++;
    }
    
    setOpacity(1);
  }, [children]);

  return (
    <div ref={containerRef} className="flex-1 w-full h-full min-h-0 overflow-hidden relative" style={{ opacity, transition: 'opacity 0.3s' }}>
       <div className="flex flex-col gap-4 pb-4">
          {children}
       </div>
    </div>
  );
}

function ExperienceCard({ exp, index }: { exp: ExperienceItem, index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'bullets'>('summary');

  // 3D Tilt Hook
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  const springRotateX = useSpring(rotateX, { damping: 20, stiffness: 300 });
  const springRotateY = useSpring(rotateY, { damping: 20, stiffness: 300 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - (rect.left + rect.width / 2));
    y.set(e.clientY - (rect.top + rect.height / 2));
  }

  function handleViewportEnter() {
    setShowHint(true);
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setShowHint(false), 3000);
  }

  function handleMouseEnter() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      setShowHint(true);
    }, 3000);
  }

  function handleMouseLeave() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setShowHint(false);
    x.set(0);
    y.set(0);
  }

  // Animation Sequence for Back Face Carousel
  const hasAchievements = exp.achievements && exp.achievements.length > 0 && exp.achievements.some(a => a.trim());
  
  // Reset tab to summary when un-flipped
  useEffect(() => {
    if (!isFlipped) setActiveTab('summary');
  }, [isFlipped]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      onViewportEnter={handleViewportEnter}
      transition={{ type: "spring", damping: 25, stiffness: 60, delay: 0.2 }}
      className="relative flex flex-col justify-center h-[450px] md:h-[550px] w-[85vw] md:w-[60vw] max-w-5xl shrink-0 group perspective-[2000px] mx-10"
    >
      <motion.div
         onMouseMove={handleMouseMove}
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
         style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d" }}
         animate={{ y: [0, -15, 0] }}
         transition={{ duration: 6 + (index % 3), repeat: Infinity, ease: "easeInOut" }}
         className="relative cursor-pointer w-full h-full"
      >
        <motion.div 
           className="relative w-full h-full"
           style={{ transformStyle: "preserve-3d" }}
           animate={{ rotateY: isFlipped ? 180 : 0 }}
           transition={{ type: "spring", stiffness: 60, damping: 15 }}
        >
           {/* Grid Hack for Flip Card Height Auto-Sizing */}
           <div className="grid w-full h-full" style={{ transformStyle: "preserve-3d" }}>
             
             {/* FRONT FACE */}
             <div 
               className="col-start-1 row-start-1 w-full h-full min-h-0 cursor-pointer"
               style={{ backfaceVisibility: "hidden" }}
               onClick={() => setIsFlipped(true)}
             >
                <div className="relative bg-white/10 dark:bg-gray-900/40 backdrop-blur-3xl border-[2px] border-white/40 dark:border-white/10 rounded-[3rem] p-6 md:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.6)] hover:border-blue-400 group-hover:shadow-[0_0_80px_rgba(59,130,246,0.3)] transition-all duration-500 w-full h-full flex flex-col items-center justify-center text-center overflow-hidden">
                  <div className={`absolute -inset-20 opacity-30 blur-[100px] bg-gradient-to-br ${exp.color || 'from-blue-500 to-purple-500'} pointer-events-none group-hover:opacity-60 transition-opacity duration-1000`} />
                  
                  <div className="relative z-10 flex flex-col items-center justify-center gap-4 md:gap-6 w-full h-full" style={{ transform: "translateZ(50px)" }}>
                     {/* The Icon */}
                     <motion.div 
                       whileHover={{ scale: 1.1, rotate: 5 }}
                       className={`w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-2xl bg-gradient-to-br ${exp.color} flex items-center justify-center shadow-lg border border-white/30 text-white relative overflow-hidden`}
                     >
                       <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
                       <Briefcase size={36} className="md:w-[42px] md:h-[42px]" />
                     </motion.div>
                     
                     {/* The Title block */}
                     <div className="w-full flex flex-col justify-center min-h-0">
                       <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight drop-shadow-md mb-2 line-clamp-2 px-4">{exp.company}</h3>
                       <h4 className="text-lg md:text-xl lg:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-400 justify-center flex items-center gap-2 line-clamp-1 px-4">
                         {exp.position} <Sparkles size={18} className="text-yellow-400 shrink-0" />
                       </h4>
                     </div>

                     {/* The Date block */}
                     <div className="inline-flex items-center gap-3 shrink-0 px-5 md:px-6 py-3 rounded-2xl bg-white/50 dark:bg-black/50 backdrop-blur-md text-sm md:text-base font-bold text-gray-800 dark:text-gray-200 shadow-inner border border-white/40 dark:border-white/10">
                       <Calendar size={20} className="text-blue-500 animate-pulse md:w-[24px] md:h-[24px]" />
                       <div className="flex gap-2 items-center flex-wrap justify-center">
                         <span>{exp.startMonth} {exp.startYear || exp.year}</span>
                         <span className="text-cyan-500 font-black">→</span>
                         <span>{exp.isCurrent ? <span className="text-purple-500 animate-pulse">Present</span> : `${exp.endMonth} ${exp.endYear || exp.year}`}</span>
                       </div>
                     </div>
                  </div>
                </div>
             </div>

             {/* BACK FACE */}
             <div 
               className="col-start-1 row-start-1 w-full h-full"
               style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
             >
                <div 
                  className="relative bg-white/10 dark:bg-gray-900/40 backdrop-blur-3xl border-[2px] border-blue-400 dark:border-white/10 rounded-[3rem] p-6 md:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.6)] transition-all duration-500 overflow-hidden w-full h-full flex flex-col justify-start cursor-pointer"
                  onClick={(e) => {
                     if ((e.target as Element).closest('button')) return;
                     setIsFlipped(false);
                  }}
                >
                  <div className={`absolute -inset-20 opacity-20 blur-[100px] bg-gradient-to-tr ${exp.color || 'from-blue-500 to-purple-500'} pointer-events-none transition-opacity duration-1000`} />
                  
                  <div className="relative z-10 flex flex-col gap-4 w-full h-full" style={{ transform: "translateZ(50px)" }}>
                    <div className="flex items-center justify-between pb-4 border-b border-white/20 dark:border-white/10 shrink-0">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white drop-shadow-md">{exp.company} <span className="text-blue-500 mx-2">|</span> {exp.position}</h3>
                    </div>

                    {/* The Sliding Carousel Frame */}
                    <div className="relative w-full flex-1 min-h-0 overflow-hidden">
                       <motion.div 
                         className="flex h-full w-[200%]"
                         animate={{ x: activeTab === 'summary' ? '0%' : '-50%' }}
                         transition={{ type: "spring", stiffness: 300, damping: 30, mass: 1 }}
                       >
                         
                         {/* SLIDE 1: Summary */}
                         <div className="w-[50%] h-full shrink-0 pr-2">
                           <AutoFitTextContainer>
                             <div className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium bg-white/20 dark:bg-black/30 p-6 md:p-8 pb-20 md:pb-24 rounded-3xl border border-white/20 shadow-inner h-full w-full">
                               {exp.description}
                             </div>
                           </AutoFitTextContainer>
                         </div>

                         {/* SLIDE 2: Highlights */}
                         <div className="w-[50%] h-full shrink-0 pl-2">
                           <AutoFitTextContainer>
                             <div className="text-left w-full h-full flex flex-col justify-center pb-12 md:pb-16">
                               <h5 className="uppercase tracking-widest font-black text-blue-500 dark:text-blue-400 mb-4 flex items-center gap-3 justify-start" style={{ fontSize: '0.85em' }}>
                                 <Award style={{ width: '1.2em', height: '1.2em' }} /> Impact Highlights
                               </h5>
                               <ul className="grid grid-cols-1 gap-2 md:gap-3">
                                 {exp.achievements?.filter(a => a.trim()).map((achievement, i) => (
                                   <li 
                                     key={i}
                                     className="group/item flex items-start gap-3 bg-white/40 dark:bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/40 dark:border-white/20 shadow-sm text-left transition-all duration-300 hover:bg-white/60 dark:hover:bg-white/20 hover:-translate-y-1"
                                   >
                                     <ChevronRight style={{ width: '1.2em', height: '1.2em' }} className="text-cyan-500 shrink-0 mt-0.5 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors" />
                                     <span className="text-gray-800 dark:text-gray-100 font-bold leading-snug">{achievement}</span>
                                   </li>
                                 ))}
                               </ul>
                             </div>
                           </AutoFitTextContainer>
                         </div>

                       </motion.div>
                    </div>

                    {/* Interactive Toggle Button */}
                    {hasAchievements && (
                       <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-50 pointer-events-auto">
                         <button
                           onClick={(e) => { 
                             e.preventDefault();
                             e.stopPropagation();
                             setActiveTab(prev => prev === 'summary' ? 'bullets' : 'summary'); 
                           }}
                           className="px-6 py-2.5 rounded-full bg-blue-500 hover:bg-blue-400 text-white font-black tracking-wider text-xs md:text-sm uppercase shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center gap-2 group hover:scale-105"
                         >
                           {activeTab === 'summary' ? (
                             <>View Highlights <ChevronRight size={16} className="group-hover:translate-x-1.5 transition-transform shrink-0" /></>
                           ) : (
                             <><ChevronRight size={16} className="rotate-180 group-hover:-translate-x-1.5 transition-transform shrink-0" /> Back to Summary</>
                           )}
                         </button>
                       </div>
                    )}
                  </div>
                </div>
             </div>

           </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function Timeline() {
  const { content, loading } = useContent();
  if (loading || !content) return <div className="min-h-screen bg-gray-50 dark:bg-gray-950" />;
  return <TimelineInner timelineContent={content.timeline} />;
}

function TimelineInner({ timelineContent }: { timelineContent: TimelineContent }) {
  const { title, subtitle, experiences } = timelineContent;
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  // Create a massive height so there's plenty of vertical scroll space to map to horizontal
  // For standard laptops, 600vh gives a very smooth slow pan effect.
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  const [xRange, setXRange] = useState([0, 0]);

  useLayoutEffect(() => {
     if (trackRef.current) {
        const calculateRange = () => {
           const trackWidth = trackRef.current?.scrollWidth || 0;
           const windowWidth = window.innerWidth;
           // The maximum distance the track can move left is the total width minus what fits on one screen
           setXRange([0, -(trackWidth - windowWidth)]);
        };
        calculateRange();
        window.addEventListener("resize", calculateRange);
        return () => window.removeEventListener("resize", calculateRange);
     }
  }, [experiences]);

  // Map 0-1 vertical scroll progress to lateral translation using raw pixel boundaries
  const x = useTransform(scrollYProgress, [0, 1], xRange);

  // Parallax background elements
  const parallaxY1 = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  return (
    <>
      <section ref={containerRef} id="experience" className="relative h-[600vh] bg-slate-50 dark:bg-black transition-colors duration-700">
        
        {/* The sticky viewport that locks onto the screen */}
        <div className="sticky top-0 h-screen overflow-hidden flex items-center perspective-1200">
          
          <ParticleSystem />
          <ShootingStars scrollYProgress={scrollYProgress} />
          <div className="absolute inset-0 pointer-events-none z-0">
            <motion.div style={{ y: parallaxY1, rotate: scrollYProgress }} className="absolute text-[40rem] text-blue-500/5 dark:text-blue-900/10 -top-20 -left-40 font-black">EXP</motion.div>
            <motion.div style={{ y: parallaxY2 }} className="absolute top-[40%] right-[5vw] w-[800px] h-[800px] rounded-full bg-purple-400/20 dark:bg-purple-900/40 blur-[150px]" />
          </div>

          {/* The Horizontal Panning Track */}
          <motion.div ref={trackRef} style={{ x }} className="flex items-center h-full w-max pl-[15vw] pr-[5vw] md:pr-[2vw] relative z-20 gap-16 md:gap-24">
            
            {/* 1. Title Slide */}
            <div className="w-[80vw] md:w-[50vw] shrink-0 flex flex-col justify-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white dark:bg-white/10 text-blue-600 dark:text-cyan-400 font-black uppercase tracking-[0.2em] text-sm mb-8 shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-blue-100 dark:border-white/20 backdrop-blur-md w-fit">
                <Zap size={18} className="animate-pulse" />
                Career Route
              </div>
              <h2 className="text-6xl md:text-8xl md:text-[8rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-900 via-purple-600 to-cyan-500 dark:from-cyan-300 dark:via-purple-400 dark:to-blue-500 mb-8 tracking-tighter drop-shadow-2xl leading-tight">{title}</h2>
              <p className="text-3xl md:text-4xl text-gray-600 dark:text-gray-300 leading-relaxed font-bold">{subtitle}</p>
              
              <motion.div animate={{ x: [0, 20, 0] }} transition={{ duration: 2, repeat: Infinity }} className="mt-16 flex items-center gap-4 text-cyan-500 font-bold text-2xl uppercase tracking-widest">
                Scroll to Traverse <ChevronRight size={32} />
              </motion.div>
            </div>

            {/* Glowing Horizontal Beam connecting all cards */}
            <div className="absolute top-1/2 left-[50vw] right-[50vw] h-[4px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30 shadow-[0_0_20px_rgba(59,130,246,0.5)] -translate-y-1/2 z-0" />

            {/* 2. Map Experiences Horizontally */}
            {experiences.map((exp, index) => <ExperienceCard key={index} exp={exp} index={index} />)}

            {/* 3. The End Milestone */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               whileInView={{ opacity: 1, scale: 1 }}
               onViewportEnter={() => console.log('End Reached')}
               className="w-[100vw] shrink-0 flex flex-col items-center justify-center text-center px-6 z-10"
            >
              <div className="w-32 h-32 rounded-full border-[4px] border-dashed border-cyan-500 flex items-center justify-center mb-12 animate-[spin_10s_linear_infinite]">
                 <div className="w-20 h-20 rounded-full bg-cyan-500 shadow-[0_0_50px_rgba(34,211,238,1)] animate-pulse" />
              </div>
              <h2 className="text-5xl md:text-[5rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mb-8 leading-tight max-w-5xl">Looking forward to future opportunities.</h2>
              <div className="mt-12 flex flex-col items-center text-gray-400 font-bold uppercase tracking-[0.3em] text-xl gap-6 animate-bounce">
                Resume Vertical Descent
                <ArrowDown size={40} className="text-purple-500" />
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Vertical Resumed Section: Current Passions */}
      <section className="relative min-h-screen bg-slate-100 dark:bg-black py-40 z-30 border-t border-gray-200 dark:border-white/10 overflow-hidden">
        
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-purple-600/20 to-transparent blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/20 to-transparent blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
             initial={{ opacity: 0, y: 100 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-black uppercase tracking-[0.2em] text-sm mb-8 border border-purple-200 dark:border-purple-800/50">
              <Sparkles size={18} /> Outside The Resume
            </div>
            
            <h2 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white mb-20 tracking-tighter drop-shadow-xl">
              Current Passions &
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 mt-2">Active Pursuits.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 text-2xl md:text-3xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              <div className="space-y-12">
                <p>
                  While my career has given me incredible opportunities to build scalable systems and AI architectures, I'm deeply passionate about the continuous evolution of machine learning frameworks. Right now, I am actively exploring multi-modal neural networks and their applications in creating seamlessly intuitive human-computer interfaces.
                </p>
                <div className="h-[2px] w-32 bg-gradient-to-r from-purple-500 to-transparent my-8" />
                <p>
                  Beyond the code, I am fascinated by entrepreneurship and the mechanics of turning a raw technical innovation into a tangible business model. The intersection of rapid prototyping and product-market fit is where I dedicate a significant portion of my unstructured time.
                </p>
              </div>

              <div className="space-y-12">
                <p>
                  I believe that the best engineers are not just coders, but product visionaries. Whether it's hacking together a new side project over the weekend or diving deep into the latest research papers on graph neural networks, my core mission remains the same: to relentlessly build, break, and optimize systems that actually have a meaningful impact on how people interact with technology.
                </p>
                <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-10 rounded-3xl shadow-xl mt-8">
                  <h4 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Learning Goals for 2026:</h4>
                  <ul className="space-y-4 text-xl">
                    <li className="flex items-center gap-4"><Zap className="text-yellow-500" /> Advanced Reinforcement Learning</li>
                    <li className="flex items-center gap-4"><Zap className="text-yellow-500" /> Distributed Cloud Architectures</li>
                    <li className="flex items-center gap-4"><Zap className="text-yellow-500" /> Edge Computing Deployment</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}