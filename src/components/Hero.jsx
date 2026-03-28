import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { VolumeX, Volume2, Play, Pause, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const heroVideos = [
    { id: 1, src: "https://cdn.batikanuz.com.tr/videos/batikanportfolio.mp4", label: "Intro" },
    { id: 2, src: "https://cdn.batikanuz.com.tr/videos/3-M%C3%BCzik%20Klibi.mp4", label: "AI Music Clip 1" },
    { id: 3, src: "https://cdn.batikanuz.com.tr/videos/4-M%C3%BCzik%20Klibi.mp4", label: "AI Music Clip 2" },
    { id: 4, src: "https://cdn.batikanuz.com.tr/videos/realto%20genel.mp4", label: "App Promo" },
    { id: 5, src: "https://cdn.batikanuz.com.tr/videos/batikanportfolio.mp4", label: "Intro" }
];

const Hero = () => {
    const { t } = useTranslation();
    const ref = useRef(null);
    const videoRef = useRef(null);
    const preloadRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isInteracting, setIsInteracting] = useState(false);
    const [counter, setCounter] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [expandedVideo, setExpandedVideo] = useState(null); // mobile expand modal
    const expandVideoRef = useRef(null);

    // When activeIndex changes: swap src without remounting, and preload next
    useEffect(() => {
        const el = videoRef.current;
        if (!el) return;
        const currentSrc = heroVideos[activeIndex].src;
        if (el.src !== currentSrc) {
            el.src = currentSrc;
            el.load();
        }
        el.muted = isMuted;
        el.play().catch(() => {});

        // Preload next video
        const nextIndex = (activeIndex + 1) % heroVideos.length;
        const preloadEl = preloadRef.current;
        if (preloadEl) {
            preloadEl.src = heroVideos[nextIndex].src;
            preloadEl.load();
        }
    }, [activeIndex]);

    const { scrollY } = useScroll();

    const getLabel = (label) => {
        if (label === "Intro") return t("hero.introLabel");
        if (label === "AI Music Clip 1") return t("hero.musicClip1Label");
        if (label === "AI Music Clip 2") return t("hero.musicClip2Label");
        if (label === "App Promo") return t("hero.appPromoLabel");
        return label;
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        setProgress(time);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
        }
    };

    const togglePlayPause = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    // Handle Scroll Logic
    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 50 && !isMuted) {
            if (videoRef.current) {
                setIsMuted(true);
                videoRef.current.muted = true;
            }
        }
    });

    const handleToggle = () => {
        if (isInteracting) return;

        // Ensure video ref exists
        if (!videoRef.current) return;

        if (isMuted) {
            // Unmute sequence
            setIsInteracting(true);
            setCounter(0);

            videoRef.current.muted = false;
            setIsMuted(false);

            if (!isPlaying) {
                videoRef.current.play();
                setIsPlaying(true);
            }

            // Simple counter interval
            const interval = setInterval(() => {
                setCounter(prev => {
                    if (prev >= 2) {
                        clearInterval(interval);
                        return 2;
                    }
                    return prev + 1;
                });
            }, 1000);

            // Release lock after 2s
            setTimeout(() => {
                setIsInteracting(false);
                clearInterval(interval);
            }, 2000);

        } else {
            // Mute immediately
            videoRef.current.muted = true;
            setIsMuted(true);
        }
    };

    const handleVideoEnd = () => {
        setActiveIndex((prev) => (prev + 1) % heroVideos.length);
    };

    const handlePrev = () => setActiveIndex((prev) => (prev - 1 + heroVideos.length) % heroVideos.length);
    const handleNext = () => setActiveIndex((prev) => (prev + 1) % heroVideos.length);

    const handleExpand = () => {
        setExpandedVideo(heroVideos[activeIndex].src);
    };

    const handleCloseExpand = () => {
        if (expandVideoRef.current) {
            expandVideoRef.current.pause();
        }
        setExpandedVideo(null);
    };

    return (
        <section ref={ref} className="h-screen w-full relative overflow-hidden bg-background snap-start snap-always shrink-0">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                {/* Hidden preloader for next video */}
                <video ref={preloadRef} preload="auto" muted playsInline className="hidden" />

                <video
                    ref={videoRef}
                    autoPlay
                    muted={isMuted}
                    playsInline
                    preload="auto"
                    onEnded={handleVideoEnd}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onTimeUpdate={(e) => setProgress(e.target.currentTime)}
                    onLoadedMetadata={(e) => setDuration(e.target.duration)}
                    className="w-full h-full object-cover"
                />

                {/* Dark Overlay - Fades out when unmuted */}
                <motion.div
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: isMuted ? 0.6 : 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 bg-black"
                />
            </div>

            {/* Progress Bar Container - Top Center */}
            <div
                className="group absolute top-10 left-1/2 -translate-x-1/2 z-20 w-[90%] md:w-1/3 min-w-[300px]"
                style={{ padding: '20px' }}
            >
                <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-5 py-3 rounded-full border border-white/10 w-full opacity-30 group-hover:opacity-100 group-hover:border-white/30 group-hover:bg-black/60 transition-all duration-500 shadow-lg">
                    {/* Play/Pause Button */}
                    <button 
                        onClick={togglePlayPause}
                        className="text-white hover:text-gray-300 transition-colors"
                    >
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>

                    <span className="text-white text-xs font-mono w-10 text-right">
                        {Math.floor(progress / 60)}:{(Math.floor(progress % 60)).toString().padStart(2, '0')}
                    </span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={progress}
                        onChange={handleSeek}
                        className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 
                            [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_white]
                            [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-125
                            [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-[0_0_10px_white]
                            [&::-moz-range-thumb]:transition-transform hover:[&::-moz-range-thumb]:scale-125"
                        style={{
                            background: `linear-gradient(to right, white ${(progress / (duration || 1)) * 100}%, rgba(255,255,255,0.2) ${(progress / (duration || 1)) * 100}%)`
                        }}
                    />
                    <span className="text-white text-xs font-mono w-10 text-left">
                        {Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}
                    </span>
                </div>
            </div>

            {/* Sound Toggle Button - Desktop only */}
            <div className="hidden md:flex absolute top-1/2 left-20 -translate-y-1/2 z-20">
                <button
                    onClick={handleToggle}
                    disabled={isInteracting}
                    className={`group relative flex items-center justify-center w-20 h-20 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 border border-white/10 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] ${isInteracting ? 'bg-white/20' : 'bg-black/40 hover:bg-black/60'}`}
                >
                    <div className="flex items-center justify-center z-10 transition-colors duration-300">
                        {isInteracting ? (
                            <span className="text-2xl font-bold text-white font-mono">{counter}</span>
                        ) : (
                            <AnimatePresence mode="wait">
                                {isMuted ? (
                                    <motion.div
                                        key="muted"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                    >
                                        <VolumeX className="w-8 h-8 text-white/90 group-hover:scale-110 transition-transform duration-300" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="unmuted"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        className="flex gap-1 items-center justify-center h-6 w-8 group-hover:scale-110 transition-transform duration-300"
                                    >
                                        <motion.div
                                            animate={{ height: [6, 18, 6] }}
                                            transition={{ repeat: Infinity, duration: 0.5 }}
                                            className="w-1.5 bg-white rounded-full"
                                        />
                                        <motion.div
                                            animate={{ height: [8, 24, 8] }}
                                            transition={{ repeat: Infinity, duration: 0.4, delay: 0.1 }}
                                            className="w-1.5 bg-white rounded-full"
                                        />
                                        <motion.div
                                            animate={{ height: [6, 18, 6] }}
                                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                                            className="w-1.5 bg-white rounded-full"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                </button>
            </div>

            {/* Mobile: Expand Button (replaces mute) */}
            <div className="md:hidden absolute top-1/2 left-5 -translate-y-1/2 z-20">
                <button
                    onClick={handleExpand}
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-black/50 backdrop-blur-md border border-white/20 hover:border-white/50 transition-all duration-300 active:scale-95"
                >
                    <Maximize2 className="w-6 h-6 text-white" />
                </button>
            </div>

            {/* Mobile: Prev / Next Arrows */}
            <div className="md:hidden absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6">
                <button
                    onClick={handlePrev}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 active:scale-95 transition-all"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                {/* Dot indicators */}
                <div className="flex items-center gap-1.5">
                    {heroVideos.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={`rounded-full transition-all duration-300 ${
                                i === activeIndex ? 'w-4 h-2 bg-white' : 'w-2 h-2 bg-white/40'
                            }`}
                        />
                    ))}
                </div>
                <button
                    onClick={handleNext}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 active:scale-95 transition-all"
                >
                    <ChevronRight className="w-6 h-6 text-white" />
                </button>
            </div>

            {/* Mobile: Fullscreen Expand Modal */}
            <AnimatePresence>
                {expandedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="md:hidden fixed inset-0 z-[200] bg-black flex items-center justify-center"
                    >
                        <video
                            ref={expandVideoRef}
                            src={expandedVideo}
                            autoPlay
                            controls
                            playsInline
                            className="w-full h-full object-contain"
                        />
                        <button
                            onClick={handleCloseExpand}
                            className="absolute top-5 right-5 flex items-center justify-center w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 z-10"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Video Selection Carousel Container - Right Edge */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[120px] h-[500px] z-20 pointer-events-none hidden md:block">

                {/* Active Video Text Label */}
                <div className="absolute right-[160px] top-1/2 -translate-y-1/2 flex items-center justify-end z-30 pointer-events-none">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, x: -20, filter: "blur(5px)" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="whitespace-nowrap"
                        >
                            <span className="text-white/90 text-sm md:text-base font-medium tracking-[0.2em] uppercase drop-shadow-xl">
                                {getLabel(heroVideos[activeIndex]?.label)}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* SVG Curve Background */}
                <svg width="120" height="500" className="absolute inset-0 pointer-events-none overflow-visible" viewBox="0 0 120 500">
                    <defs>
                        <linearGradient id="arcGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#C0C0C0" stopOpacity="0" />
                            <stop offset="50%" stopColor="#C0C0C0" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#C0C0C0" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M 120 0 Q -120 250 120 500"
                        fill="none"
                        stroke="url(#arcGradient)"
                        strokeWidth="2"
                    />
                </svg>

                {/* Carousel Items */}
                <div className="absolute inset-0 pointer-events-none">
                    {heroVideos.map((video, index) => {
                        const offset = index - activeIndex;
                        const isVisible = Math.abs(offset) <= 2;

                        // Y distance from the center (250 is the center Y of the SVG coordinate system)
                        const spacing = 110; // Vertical spacing between items
                        const yOffset = Math.abs(offset) * spacing;
                        const y = offset < 0 ? -yOffset : yOffset;

                        // Calculate X offset using parabolic curve approximation
                        // Peak is at x=0 (far left) when y=0 (center).
                        // x = a * y^2. 
                        // At y=250, x=120 -> a = 120 / (250^2) = 120 / 62500 = 0.00192.
                        const x = 0.00192 * y * y;

                        const scale = offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.6 : 0.4;
                        const opacity = offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.6 : 0.2;
                        const zIndex = 10 - Math.abs(offset);

                        return (
                            <motion.div
                                key={video.id}
                                className={`absolute w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300
                                ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
                                style={{
                                    // Base position places the item's top-left so that its CENTER is at (x=0, y=250)
                                    left: -24,
                                    top: 250 - 24,
                                    zIndex,
                                    border: '1.5px solid rgba(192, 192, 192, 0.4)',
                                    background: 'radial-gradient(circle at center, rgba(192, 192, 192, 0.1) 0%, rgba(192, 192, 192, 0.4) 100%)',
                                    boxShadow: '0 0 15px rgba(192, 192, 192, 0.15)',
                                }}
                                animate={{
                                    x,
                                    y,
                                    scale,
                                    opacity: isVisible ? opacity : 0,
                                }}
                                transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.8 }}
                                onClick={() => setActiveIndex(index)}
                            >
                                {/* Inner active indicator dot */}
                                {offset === 0 && (
                                    <motion.div
                                        layoutId="activeVideoIndicator"
                                        className="w-3 h-3 rounded-full bg-white shadow-[0_0_10px_white]"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Text Content - Bottom Left - Fades out when unmuted */}
            <motion.div
                animate={{
                    opacity: isMuted ? 1 : 0,
                    x: isMuted ? 0 : -50
                }}
                transition={{ duration: 0.8 }}
                className="absolute bottom-20 left-6 md:left-20 z-10 text-left max-w-4xl"
            >
                <h2 className="text-sm md:text-lg font-medium text-gray-300 mb-2 tracking-widest uppercase">
                    {activeIndex === 4 ? "" :
                     heroVideos[activeIndex]?.label === "AI Music Clip 1" ? 
                        t('hero.date1') : 
                     heroVideos[activeIndex]?.label === "AI Music Clip 2" ?
                        t('hero.date2') :
                     heroVideos[activeIndex]?.label === "App Promo" ?
                        t('hero.date3') :
                        t('hero.subtitle')
                    }
                </h2>

                <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 leading-tight uppercase">
                    {activeIndex === 4 ? t('hero.intro') :
                     heroVideos[activeIndex]?.label === "AI Music Clip 1" || heroVideos[activeIndex]?.label === "AI Music Clip 2" ? t('hero.music') :
                     heroVideos[activeIndex]?.label === "App Promo" ? t('hero.appPromoLabel') :
                     t('hero.title')}
                </h1>

                <p className="text-gray-300 text-lg md:text-xl font-light max-w-xl">
                    {activeIndex === 4 ?
                        t('hero.descIntro') :
                     heroVideos[activeIndex]?.label === "AI Music Clip 1" ? 
                        t('hero.descMusic1') : 
                     heroVideos[activeIndex]?.label === "AI Music Clip 2" ?
                        t('hero.descMusic2') :
                     heroVideos[activeIndex]?.label === "App Promo" ?
                        t('hero.descAppPromo') :
                        t('hero.descMain')
                    }
                </p>
            </motion.div>
        </section>
    );
};

export default Hero;
