import { motion } from 'motion/react';

export function BackgroundOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#bae6fd,transparent)] dark:bg-[radial-gradient(circle_800px_at_50%_200px,#1e3a8a,transparent)] opacity-60" />
      
      <motion.div 
        animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-400/60 dark:bg-blue-600/40 blur-[90px]"
      />
      
      <motion.div 
        animate={{ x: [0, -120, 0], y: [0, 80, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] -right-[15%] w-[600px] h-[600px] rounded-full bg-purple-400/50 dark:bg-purple-800/40 blur-[90px]"
      />
      
      <motion.div 
        animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-[20%] left-[20%] w-[700px] h-[700px] rounded-full bg-cyan-300/50 dark:bg-cyan-800/30 blur-[100px]"
      />
    </div>
  );
}
