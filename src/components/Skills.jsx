import React from 'react';
import Section from './Section';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const skillsKeys = [
    "genAI", "promptEng", "perfMarketing", "paidMedia",
    "metaAds", "creativeStrat", "uiux", "productDev",
    "creativeAuto", "videoEdit", "graphicDesign", "growthStrat"
];

const educationKeys = [
    { key: "akdeniz", year: "2021 - 2025" },
    { key: "anadolu", year: "2025 - " }
];

const certificationsKeys = [
    { key: "python", link: "https://www.btkakademi.gov.tr/portal/certificate/validate?certificateId=wmlFm4b4bJ" },
    { key: "mlApps", link: "https://www.btkakademi.gov.tr/portal/certificate/validate?certificateId=nKqhneDqoW" },
    { key: "ml", link: "https://www.btkakademi.gov.tr/portal/certificate/validate?certificateId=zXztnPOvbn" },
    { key: "deepLearning", link: "https://www.btkakademi.gov.tr/portal/certificate/validate?certificateId=8jmhNpWpWj" },
    { key: "aiIntro", link: "https://www.btkakademi.gov.tr/portal/certificate/validate?certificateId=1kZCe1r1rl" },
    { key: "teamBuilding", link: "https://www.btkakademi.gov.tr/portal/certificate/validate?certificateId=6mqFNDOW6g" },
    { key: "itLaw", link: "https://www.btkakademi.gov.tr/portal/certificate/validate?certificateId=EoPfbE1klY" },
    { key: "googleCloud", link: "https://digicertify.net//c/NY7OEmbY" },
    { key: "gameMarketing", link: "https://www.btkakademi.gov.tr/portal/certificate/validate?certificateId=9XrtqE8kLE" },
    { key: "socialMedia", link: "https://www.btkakademi.gov.tr/portal/certificate/validate?certificateId=XV1hWmN2aP" },
    { key: "english", link: "https://www.btkakademi.gov.tr/portal/certificate/validate?certificateId=4qguZEyPjZ" },
    { key: "communication", link: "https://www.btkakademi.gov.tr/portal/certificate/validate?certificateId=mKEhvPlEn9" }
];

const Skills = () => {
    const { t } = useTranslation();
    return (
        <Section id="work" className="bg-gradient-to-b from-black to-zinc-900 snap-start snap-always w-full shrink-0">
            <div className="grid md:grid-cols-2 gap-16">
                {/* Skills Column */}
                <div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold mb-10 text-white/90"
                    >
                        {t('skills.title')}
                    </motion.h2>
                    <div className="flex flex-wrap gap-3">
                        {skillsKeys.map((key, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm md:text-base text-gray-300 hover:bg-white/10 hover:border-white/30 transition-all cursor-default"
                            >
                                {t(`skills.items.${key}`)}
                            </motion.span>
                        ))}
                    </div>
                </div>

                {/* Education Column */}
                <div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl font-bold mb-10 text-white/90"
                    >
                        {t('skills.education')}
                    </motion.h2>
                    <div className="space-y-8">
                        {educationKeys.map((edu, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                className="border-b border-white/10 pb-4"
                            >
                                <h3 className="text-xl font-semibold text-white">{t(`skills.edu.${edu.key}.school`)}</h3>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-gray-400">{t(`skills.edu.${edu.key}.desc`)}</span>
                                    <span className="text-sm text-gray-500 font-mono">{edu.year}{edu.key === 'anadolu' ? t('experience.companies.zenoz.period').split(' – ')[1] : ''}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Certifications Full Width */}
            <div className="mt-16 sm:mt-24 w-full">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl font-bold mb-10 text-white/90"
                >
                    {t('skills.certifications')}
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-4">
                    {certificationsKeys.map((cert, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                            className="border-b border-white/10 pb-2 group"
                        >
                            <a
                                href={cert.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-base lg:text-lg text-gray-300 group-hover:text-amber-400 transition-colors flex items-center justify-between w-full"
                            >
                                <span className="line-clamp-1 pr-2" title={t(`skills.certs.${cert.key}`)}>{t(`skills.certs.${cert.key}`)}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
};

export default Skills;
