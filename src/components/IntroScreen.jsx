import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntroScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Lock scroll while intro is visible
    document.body.style.overflow = 'hidden';

    // Total duration of progress animation 2.5s
    const duration = 2500;
    const interval = 30;
    const step = 100 / (duration / interval);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= 100) {
        setProgress(100);
        clearInterval(timer);
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            document.body.style.overflow = 'auto'; // Restore scroll
            onComplete();
          }, 800); // Wait for exit animation
        }, 300); // Pause briefly at 100% before starting exit
      } else {
        setProgress(Math.floor(current));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-black overflow-hidden flex items-center justify-center font-sans tracking-wide"
        >
          {/* Background Image slowly scaling */}
          <motion.div 
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 4, ease: "linear" }}
            className="absolute inset-0 z-0 bg-cover bg-center md:bg-top"
            style={{ backgroundImage: "url('/introgiris/bg.png')" }}
          />

          {/* Cyber Overlay / Scanlines */}
          <div className="absolute inset-0 z-[1] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-40"></div>
          
          {/* Vignette effect */}
          <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.8)_100%)]"></div>

          {/* Foreground Character */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="absolute bottom-0 z-[2] w-full h-[85%] flex justify-center pointer-events-none"
          >
            <img 
              src="/introgiris/onb.png" 
              alt="Character Foreground" 
              className="object-contain h-full origin-bottom select-none"
            />
          </motion.div>

          {/* Content Wrapper */}
          <div className="relative z-[3] w-full h-full flex flex-col items-center justify-center px-6 md:px-24 text-white pb-20 pt-10">
            
            {/* Split layout for text and loading */}
            <div className="flex flex-col md:flex-row w-full max-w-7xl items-center justify-between mt-auto mb-4 md:mb-[10vh]">
              
              {/* Left Side: Glitch Name */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mb-12 md:mb-0 text-center md:text-left drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]"
              >
                <h1 className="text-5xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter mix-blend-screen relative leading-none">
                  BATIKAN UZ
                </h1>
                <p className="text-cyan-400 mt-4 text-xs sm:text-sm md:text-base tracking-[0.4em] font-mono opacity-80 uppercase font-semibold">
                  System Validation In Progress...
                </p>
              </motion.div>

              {/* Right Side: Cyber Loading */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="w-full md:w-[28rem] flex flex-col gap-4 backdrop-blur-sm bg-black/20 p-6 rounded-xl border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.05)]"
              >
                <div className="flex justify-between items-end font-mono text-cyan-400">
                  <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold flex items-center gap-2">
                    <span className="block w-2 h-2 bg-cyan-400 animate-pulse"></span>
                    Nexus Core Loading
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                    {progress}%
                  </span>
                </div>
                
                {/* Progress Bar Container */}
                <div className="w-full h-5 sm:h-6 bg-gray-950/80 border border-cyan-800/60 relative overflow-hidden clip-path-cyber rounded-[2px] shadow-inner font-mono">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.1 }}
                  >
                    {/* Animated shine effect on the progress bar */}
                    <motion.div 
                      className="absolute top-0 bottom-0 w-20 bg-white/40 skew-x-[-20deg]"
                      animate={{ x: ['-100%', '500%'] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                  </motion.div>

                  {/* High tech pattern overlay */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wLDBMMTAsMTBtMTAsMEwwLDEwIiBzdHJva2U9InJnYmEoMCwgMCwgMCwgMC4yKSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] opacity-50 mix-blend-overlay pointer-events-none" />
                </div>

                <div className="flex justify-between text-[8px] sm:text-[10px] text-cyan-600 font-mono tracking-widest uppercase mt-1 opacity-70">
                  <span className="flex gap-2">
                    <span>SEC: ENABLED</span>
                    <span className="text-emerald-500">NET: STABLE</span>
                  </span>
                  <span>V_4.0.2.build_88</span>
                </div>
              </motion.div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroScreen;
