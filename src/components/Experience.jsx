import React, { useRef, useState, useEffect, useCallback } from 'react';
import Section from './Section';
import { motion, useScroll } from 'framer-motion';
import { ArrowUpRight, Instagram, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// ─── Shared IntersectionObserver pool ────────────────────────────────────────
// Instead of each LazyVideo creating 2 observers, we use one shared observer
// for ALL videos. Much lighter on the browser, especially mobile.
const videoObserverCallbacks = new Map();

let sharedPreloadObserver = null;
let sharedPlayObserver = null;

const getSharedPreloadObserver = () => {
    if (!sharedPreloadObserver) {
        sharedPreloadObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const cb = videoObserverCallbacks.get(entry.target);
                    if (cb) cb.onPreload(entry.isIntersecting);
                });
            },
            { rootMargin: '400px 200px' }
        );
    }
    return sharedPreloadObserver;
};

const getSharedPlayObserver = () => {
    if (!sharedPlayObserver) {
        sharedPlayObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const cb = videoObserverCallbacks.get(entry.target);
                    if (cb) cb.onPlay(entry.isIntersecting);
                });
            },
            { threshold: 0.1, rootMargin: '0px' }
        );
    }
    return sharedPlayObserver;
};

// ─── LazyVideo ────────────────────────────────────────────────────────────────
const LazyVideo = ({ src, className }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const el = videoRef.current;
        if (!el) return;

        videoObserverCallbacks.set(el, {
            onPreload: (visible) => {
                if (visible && el.src !== src) {
                    el.src = src;
                    el.load();
                }
            },
            onPlay: (visible) => {
                if (visible) {
                    el.play().catch(() => {});
                } else {
                    el.pause();
                }
            },
        });

        getSharedPreloadObserver().observe(el);
        getSharedPlayObserver().observe(el);

        return () => {
            getSharedPreloadObserver().unobserve(el);
            getSharedPlayObserver().unobserve(el);
            videoObserverCallbacks.delete(el);
        };
    }, [src]);

    return (
        <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            className={className}
            style={{ willChange: 'auto' }}
        />
    );
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const experiences = [
    {
        id: 1,
        company: "Zenoz Yazılım",
        role: "AI-Driven Marketing Lead",
        period: "Jun 2024 – Present",
        location: "Ankara, Türkiye (Hybrid)",
        description: "Conduct market and competitor analysis to identify positioning opportunities and high-potential target segments. Develop advertising concepts and AI-assisted creative assets aligned with brand strategy and audience insights.\n\nPlan, launch, and manage paid advertising campaigns across digital platforms, overseeing a $8K–$10K monthly budget. Continuously monitor performance metrics, adjust targeting and creatives, and optimize budget allocation to improve conversion rates and overall campaign profitability.",
        color: "from-blue-600 to-indigo-900",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        projectTitle: "AI Marketing Suite",
        projectDesc: "Automated creative testing framework."
    },
    {
        id: 2,
        company: "sanaldrone.com",
        role: "Head of AI Creative & Performance",
        period: "Jun 2024 – Present",
        location: "Online",
        description: "Lead the development of AI-powered commercial advertising solutions, with a strong focus on real estate and property investment markets. Create high-converting, AI-generated video and visual campaigns aligned with emerging industry trends and investor behavior.\n\nDevelop innovative digital advertising concepts and scalable creative systems tailored to real estate developers, construction firms, and investment projects. Pioneer trend-driven promotional formats that increase project visibility, attract qualified leads, and strengthen brand positioning in competitive property markets.\n\nOversee the full creative production pipeline — from concept development and scripting to visual design and final delivery — while managing the creative team and ensuring consistent brand quality. Optimize high-budget performance campaigns and continuously refine digital products and service models to improve scalability, efficiency, and client results.",
        color: "from-purple-600 to-fuchsia-900",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2065&auto=format&fit=crop",
        projectTitle: "Creative Automation",
        projectDesc: "Scalable AI video production.",
        links: [
            { type: 'instagram', url: 'https://www.instagram.com/sanaldronecom/' },
            { type: 'website', url: 'https://sanaldrone.com' }
        ]
    },
    {
        id: 3,
        company: "Frost Ajans",
        role: "Graphic Designer & Video Editor",
        period: "Jun 2023 – Dec 2025",
        location: "Online",
        description: "Delivered graphic design and video editing services for brands operating in healthcare, construction, and real estate sectors. Designed social media creatives, corporate branding materials, promotional visuals, and campaign assets aligned with each brand's positioning and target audience.\n\nEdited promotional videos, advertisements, and short-form digital content optimized for social media performance. Collaborated with marketing teams to develop visual concepts, ensure brand consistency, and produce trend-aligned content that supported digital campaign objectives and audience engagement.",
        color: "from-emerald-600 to-teal-900",
        image: "https://images.unsplash.com/photo-1626785774573-4b799314346d?q=80&w=2070&auto=format&fit=crop",
        projectTitle: "Brand Identity",
        projectDesc: "Visuals for high-end real estate.",
        links: [
            { type: 'instagram', url: 'https://www.instagram.com/frostajans/' }
        ]
    },
    {
        id: 4,
        company: "Selected Ventures",
        role: "Venture Builder & Designer",
        period: "2022 – Present",
        location: "Online",
        description: "• StudioBytes: Built and scaled a 900+ member digital community and developed multiple game projects.\n• Simpl.: Designed and directed a minimal, simplicity-focused digital product concept from branding to advertising.\n• Load Find App: Developed and led the full design, UI/UX, frontend, and advertising strategy for a logistics-focused startup.\n• TorqueParfum: Created and developed a consumer car fragrance brand.\n• AugustWear: Developed a tactical and outdoor fashion e-commerce concept.\n• AI Influencer Project: Created an AI-generated virtual influencer, reaching 20,000+ organic users.",
        color: "from-orange-600 to-red-900",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop",
        projectTitle: "StudioBytes & Load Find App",
        projectDesc: "Community building and UX design."
    }
];

const carouselGroups = [
    {
        title: "Music Promos",
        year: "2026",
        videos: [
            "https://cdn.batikanuz.com.tr/Muzik%20Tanitimi/1.mp4",
            "https://cdn.batikanuz.com.tr/Muzik%20Tanitimi/5.mp4",
            "https://cdn.batikanuz.com.tr/Muzik%20Tanitimi/6.mp4",
            "https://cdn.batikanuz.com.tr/Muzik%20Tanitimi/7.mp4",
            "https://cdn.batikanuz.com.tr/Muzik%20Tanitimi/12.mp4",
            "https://cdn.batikanuz.com.tr/Muzik%20Tanitimi/16.mp4",
            "https://cdn.batikanuz.com.tr/Muzik%20Tanitimi/17.mp4"
        ]
    },
    {
        title: "Clothing Brands",
        year: "2025",
        videos: [
            "https://cdn.batikanuz.com.tr/Giyim%20Markalar%C4%B1/augustwear_reels_1_2025.mp4",
            "https://cdn.batikanuz.com.tr/Giyim%20Markalar%C4%B1/augustwear_reels_3_2025.mp4",
            "https://cdn.batikanuz.com.tr/Giyim%20Markalar%C4%B1/yama_reels_1_2025.mp4",
            "https://cdn.batikanuz.com.tr/Giyim%20Markalar%C4%B1/yama_reels_2_2025.mp4",
            "https://cdn.batikanuz.com.tr/Giyim%20Markalar%C4%B1/yama_reels_3_2025.mp4",
            "https://cdn.batikanuz.com.tr/Giyim%20Markalar%C4%B1/yama_reels_4_2025.mp4",
            "https://cdn.batikanuz.com.tr/Giyim%20Markalar%C4%B1/yama_reels_5_2025.mp4"
        ]
    },
    {
        title: "Influencer Creation",
        year: "2024",
        videos: [
            "https://cdn.batikanuz.com.tr/Inf/Lesley_reels_1_2025.mp4",
            "https://cdn.batikanuz.com.tr/Inf/Lesley_reels_2_2025.mp4",
            "https://cdn.batikanuz.com.tr/Inf/Lesley_reels_4_2025.mp4",
            "https://cdn.batikanuz.com.tr/Inf/Lesley_reels_5_2025.mp4",
            "https://cdn.batikanuz.com.tr/Inf/Lesley_reels_6_2025.mp4",
            "https://cdn.batikanuz.com.tr/Inf/Lesley_reels_7_2025.mp4",
            "https://cdn.batikanuz.com.tr/Inf/Lesley_reels_8_2025.mp4"
        ]
    },
    {
        title: "Advertising Content",
        year: "2025",
        videos: [
            "https://cdn.batikanuz.com.tr/Reklams/1a.mp4",
            "https://cdn.batikanuz.com.tr/Reklams/4.mp4",
            "https://cdn.batikanuz.com.tr/Reklams/11.mp4",
            "https://cdn.batikanuz.com.tr/Reklams/15.mp4",
            "https://cdn.batikanuz.com.tr/Reklams/16a.mp4",
            "https://cdn.batikanuz.com.tr/Reklams/19.mp4",
            "https://cdn.batikanuz.com.tr/Reklams/21.mp4"
        ]
    }
];

const BrushDefs = () => (
    <svg width="0" height="0" className="absolute hidden pointer-events-none">
        <defs>
            <clipPath id="brush-clip" clipPathUnits="objectBoundingBox">
                <path d="M0.03,0.06 
                         C0.20,0.02 0.50,0.01 0.85,0.05 
                         C0.95,0.06 0.98,0.12 0.99,0.30 
                         C1.00,0.50 0.96,0.85 0.91,0.93 
                         C0.85,0.98 0.50,0.99 0.15,0.95 
                         C0.05,0.92 0.01,0.85 0.02,0.65 
                         C0.03,0.45 0.01,0.20 0.03,0.06 Z" />
                <path d="M0.85,0.05 C0.90,0.00 0.95,0.02 0.97,0.12 C0.95,0.10 0.90,0.08 0.85,0.05 Z" />
                <path d="M0.95,0.40 C0.99,0.42 1.00,0.50 0.96,0.55 C0.98,0.50 0.96,0.45 0.95,0.40 Z" />
                <path d="M0.91,0.93 C0.96,0.97 0.93,0.99 0.85,0.97 C0.88,0.95 0.90,0.95 0.91,0.93 Z" />
                <path d="M0.15,0.95 C0.10,0.98 0.05,0.99 0.02,0.90 C0.06,0.94 0.10,0.95 0.15,0.95 Z" />
                <path d="M0.02,0.65 C-0.01,0.60 0.00,0.50 0.03,0.45 C0.01,0.50 0.01,0.60 0.02,0.65 Z" />
                <path d="M0.03,0.06 C0.00,0.01 0.05,0.00 0.10,0.03 C0.06,0.02 0.04,0.03 0.03,0.06 Z" />
                <circle cx="0.95" cy="0.08" r="0.015" />
                <circle cx="0.05" cy="0.90" r="0.01" />
                <circle cx="0.98" cy="0.75" r="0.008" />
                <circle cx="0.02" cy="0.25" r="0.012" />
            </clipPath>
        </defs>
    </svg>
);

// ─── Carousel Group Card ───────────────────────────────────────────────────────
const CarouselGroupCard = ({ group, getGroupTitle, onVideoClick }) => (
    <div className="flex flex-col shrink-0">
        {/* Group Header */}
        <div className="relative w-full h-10 flex items-center mb-4">
            <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/20" />
            <div className="absolute left-0 top-1/2 h-4 w-[1px] bg-white/20" />
            <div className="absolute right-0 top-1/2 h-4 w-[1px] bg-white/20" />
            <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/80 px-4 py-1.5 rounded-full border border-white/10 text-white/80 font-mono text-xs uppercase tracking-widest flex items-center gap-2 z-10 backdrop-blur-sm">
                {group.year && (
                    <div className="absolute bottom-full left-4 mb-2 text-[10px] text-white/40 tracking-widest flex items-center">
                        <span className="bg-black px-2 py-0.5 rounded-full border border-white/10">{group.year}</span>
                    </div>
                )}
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80 animate-pulse" />
                {getGroupTitle(group.title)}
            </div>
        </div>
        {/* Videos */}
        <div className="flex gap-4">
            {(group.images || group.videos).map((src, i) => (
                <div
                    key={i}
                    className="w-32 sm:w-40 md:w-48 aspect-[9/16] rounded-2xl overflow-hidden shrink-0 border border-white/10 bg-black/50 hover:border-white/30 transition-colors cursor-pointer pointer-events-auto group/item"
                    onClick={() => { if (group.videos) onVideoClick(src); }}
                >
                    {group.images ? (
                        <img
                            draggable={false}
                            src={src}
                            className="w-full h-full object-cover object-center grayscale-[20%] group-hover/item:grayscale-0 transition-all duration-500 pointer-events-none"
                            alt={`${group.title} preview`}
                        />
                    ) : (
                        <LazyVideo
                            src={src}
                            className="w-full h-full object-cover object-center grayscale-[20%] group-hover/item:grayscale-0 transition-all duration-500 pointer-events-none"
                        />
                    )}
                </div>
            ))}
        </div>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Experience = () => {
    const { t } = useTranslation();
    const containerRef = useRef(null);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const getGroupTitle = (title) => {
        if (title === "Music Promos") return t("experience.carouselGroups.musicInfo");
        if (title === "Clothing Brands") return t("experience.carouselGroups.clothing");
        if (title === "Influencer Creation") return t("experience.carouselGroups.influencer");
        if (title === "Advertising Content") return t("experience.carouselGroups.advertising");
        return title;
    };

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    return (
        <Section id="experience" className="bg-black/60 relative z-20 overflow-visible !p-0">
            <BrushDefs />

            <div ref={containerRef} className="w-full relative">
                {/* ── Intro Header ── */}
                <div className="w-full min-h-[50dvh] lg:min-h-[50dvh] snap-start snap-always flex flex-col items-center justify-center relative z-20 shrink-0 overflow-hidden pt-24 pb-4">
                    <div className="w-full max-w-4xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center z-30 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="flex flex-col text-center items-center"
                        >
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-wide">{t('experience.introTitle')}</h3>
                            <p className="text-gray-400 text-base md:text-xl leading-relaxed max-w-3xl">
                                {t('experience.introDesc')}
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* ── Carousel + Work Experience Title ── */}
                <div className="w-full min-h-[100dvh] snap-start snap-always flex flex-col items-center justify-start relative z-20 shrink-0 overflow-hidden pt-10 pb-20">
                    {/* CSS-animated infinite carousel — GPU-accelerated, no JS per-frame */}
                    <div className="relative w-full overflow-hidden mb-8 md:mb-12 pt-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="w-full flex relative"
                        >
                            {/* Edge Gradients */}
                            <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
                            <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />

                            {/* Scrolling track — CSS animation, duplicated for seamless loop */}
                            <div
                                className="flex gap-12 w-max"
                                style={{
                                    animation: 'carouselScroll 60s linear infinite',
                                    willChange: 'transform',
                                }}
                                onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
                                onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
                                onTouchStart={e => e.currentTarget.style.animationPlayState = 'paused'}
                                onTouchEnd={e => e.currentTarget.style.animationPlayState = 'running'}
                            >
                                {/* Set 1 */}
                                <div className="flex gap-12 shrink-0">
                                    {carouselGroups.map((group, idx) => (
                                        <CarouselGroupCard
                                            key={`s1-${idx}`}
                                            group={group}
                                            getGroupTitle={getGroupTitle}
                                            onVideoClick={setSelectedVideo}
                                        />
                                    ))}
                                </div>
                                {/* Set 2 — duplicate for seamless loop */}
                                <div className="flex gap-12 shrink-0" aria-hidden="true">
                                    {carouselGroups.map((group, idx) => (
                                        <CarouselGroupCard
                                            key={`s2-${idx}`}
                                            group={group}
                                            getGroupTitle={getGroupTitle}
                                            onVideoClick={setSelectedVideo}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.h2
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-6xl font-bold text-white/90 tracking-wider mb-8 text-center"
                    >
                        {t('experience.workExperience')}
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="text-white/40 animate-pulse text-sm"
                    >
                        {t('experience.scrollDown')}
                    </motion.div>
                </div>

                {/* ── Timeline ── */}
                <div className="relative w-full max-w-7xl mx-auto px-4 md:px-0">
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0 border-l-2 border-dashed border-white/20 -translate-x-1/2 z-0" />
                    <motion.div
                        className="absolute left-8 md:left-1/2 top-0 w-1 bg-blue-500 -translate-x-1/2 origin-top z-10 hidden md:block"
                        style={{ scaleY: scrollYProgress, height: "100%" }}
                    />

                    <div className="flex flex-col w-full relative z-20">
                        {experiences.map((exp, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <div key={exp.id} className="relative w-full min-h-[100dvh] flex items-center py-20 snap-start snap-always">
                                    {/* Animated blur blobs — desktop only (too heavy for mobile) */}
                                    <div className={`hidden md:flex absolute top-1/2 -translate-y-1/2 w-full items-center justify-center pointer-events-none opacity-50 z-0 ${isEven ? 'md:justify-end md:pr-16 lg:pr-32' : 'md:justify-start md:pl-16 lg:pl-32'}`}>
                                        <div className="relative w-[600px] h-[600px] overflow-visible">
                                            <div className="absolute inset-0 filter blur-[140px] overflow-visible mix-blend-screen opacity-80">
                                                <motion.div
                                                    whileInView={{ scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, 30, 0] }}
                                                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                                    viewport={{ margin: '0px' }}
                                                    className="absolute top-[10%] left-[10%] w-[60%] h-[60%] bg-blue-600 rounded-full"
                                                />
                                                <motion.div
                                                    whileInView={{ scale: [1, 1.4, 1], x: [0, -40, 0], y: [0, -50, 0] }}
                                                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                                    viewport={{ margin: '0px' }}
                                                    className="absolute bottom-[10%] right-[10%] w-[60%] h-[60%] bg-purple-600 rounded-full"
                                                />
                                                <motion.div
                                                    whileInView={{ scale: [1, 1.3, 1], x: [0, 30, 0], y: [0, -30, 0] }}
                                                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                                                    viewport={{ margin: '0px' }}
                                                    className="absolute top-[20%] right-[20%] w-[50%] h-[50%] bg-cyan-600 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Center Dot */}
                                    <div className="absolute left-8 md:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
                                        <motion.div
                                            className="hidden md:block w-5 h-5 rounded-full bg-black border-4 border-white/40"
                                            initial={{ backgroundColor: "rgba(0,0,0,1)", borderColor: "rgba(255,255,255,0.4)", scale: 0.8 }}
                                            whileInView={{ backgroundColor: "#3b82f6", borderColor: "#ffffff", scale: 1.2 }}
                                            viewport={{ once: true, margin: "-50% 0px -50% 0px" }}
                                            transition={{ duration: 0.5 }}
                                        />
                                        <motion.div
                                            className="md:hidden w-4 h-4 rounded-full bg-black border-4 border-white/40 z-30"
                                            initial={{ backgroundColor: "rgba(0,0,0,1)", borderColor: "rgba(255,255,255,0.4)" }}
                                            whileInView={{ backgroundColor: "#3b82f6", borderColor: "#ffffff" }}
                                            viewport={{ once: true, margin: "-100px 0px" }}
                                        />
                                    </div>

                                    {/* Row Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-8 md:gap-0 relative z-20">
                                        <div className="flex flex-col justify-center items-start md:items-end pl-8 md:pl-0 pr-0 md:pr-2 lg:pr-4">
                                            {isEven && <ExperienceText exp={exp} direction="left" />}
                                        </div>
                                        <div className="flex flex-col justify-center items-start pl-8 md:pl-2 lg:pl-4 pr-0">
                                            {!isEven && <ExperienceText exp={exp} direction="right" />}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Video Modal ── */}
            {selectedVideo && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedVideo(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/50 hover:text-white"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div
                        className="relative w-full max-w-lg h-auto flex items-center justify-center rounded-xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <video
                            src={selectedVideo}
                            controls
                            autoPlay
                            className="w-full h-auto max-h-[90vh] object-contain bg-black rounded-xl"
                        />
                    </div>
                </div>
            )}
        </Section>
    );
};

// ─── ExperienceText ───────────────────────────────────────────────────────────
// Mobile: no entry animation (simpler, faster). Desktop: keeps slide-in blur effect.
const ExperienceText = ({ exp, direction }) => {
    const { t } = useTranslation();
    const getExpKey = (id) => {
        if (id === 1) return 'zenoz';
        if (id === 2) return 'sanaldrone';
        if (id === 3) return 'frost';
        if (id === 4) return 'selected';
        return '';
    };
    const expKey = getExpKey(exp.id);
    const isLeftCell = direction === "left";

    return (
        <>
            {/* Desktop: animated */}
            <motion.div
                initial={{ opacity: 0, x: isLeftCell ? -50 : 50, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`hidden md:flex flex-col w-full max-w-3xl ${isLeftCell ? 'text-left md:text-right' : 'text-left'} px-4 md:px-0`}
            >
                <ExperienceContent exp={exp} expKey={expKey} isLeftCell={isLeftCell} t={t} />
            </motion.div>

            {/* Mobile: no animation, just render */}
            <div className={`flex md:hidden flex-col w-full max-w-3xl text-left px-4`}>
                <ExperienceContent exp={exp} expKey={expKey} isLeftCell={false} t={t} />
            </div>
        </>
    );
};

const ExperienceContent = ({ exp, expKey, isLeftCell, t }) => (
    <>
        <div className={`mb-2 flex flex-col ${isLeftCell ? 'md:items-end' : 'items-start'}`}>
            <div className={`flex items-center gap-4 mb-2 ${isLeftCell ? 'md:flex-row-reverse' : 'flex-row'}`}>
                <h3 className="text-3xl font-bold text-white">{exp.company}</h3>
                {exp.links && (
                    <div className="flex items-center gap-3">
                        {exp.links.map((link, i) => (
                            <a
                                key={i}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/40 hover:text-white transition-colors duration-300 hover:scale-110 transform"
                            >
                                {link.type === 'instagram' ? <Instagram className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                            </a>
                        ))}
                    </div>
                )}
            </div>
            <span className={`inline-block px-3 py-1 bg-gradient-to-r ${exp.color} rounded-full text-sm text-white font-mono mb-4`}>
                {t(`experience.companies.${expKey}.period`)}
            </span>
        </div>
        <h4 className="text-xl text-gray-300 mb-4">{t(`experience.companies.${expKey}.role`)}</h4>
        <p className="text-gray-400 leading-relaxed text-sm md:text-base whitespace-pre-line">
            {t(`experience.companies.${expKey}.desc`)}
        </p>
    </>
);

export default Experience;
