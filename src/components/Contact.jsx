import React from 'react';
import Section from './Section';
import { motion } from 'framer-motion';
import { Mail, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Contact = () => {
    const { t } = useTranslation();
    return (
        <Section id="contact" className="min-h-[70vh] items-center text-center snap-start snap-always w-full shrink-0">
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-gray-400 uppercase tracking-widest mb-4"
            >
                {t('contact.whatsNext')}
            </motion.p>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-8xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600"
            >
                {t('contact.letsWork')}
            </motion.h2>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col md:flex-row gap-8 md:gap-16 items-center justify-center mb-20"
            >
                <a href="mailto:batikan.o.uz@gmail.com" className="group flex items-center text-xl hover:text-blue-400 transition-colors">
                    <Mail className="w-7 h-7 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://www.linkedin.com/in/batıkan-uz/" target="_blank" rel="noopener noreferrer" className="group flex items-center text-xl hover:text-blue-400 transition-colors">
                    <Linkedin className="w-7 h-7 group-hover:scale-110 transition-transform" />
                </a>

            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-16 flex flex-col items-center justify-center"
            >
                <p className="text-gray-400 text-sm md:text-base mb-4 tracking-wide">{t('contact.gdPortfolioPrompt')}</p>
                <a 
                    href="/protfolio/Batıkan UZ PORTFOLIO (2).pdf" 
                    target="_blank"
                    rel="noopener noreferrer"
                    download 
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all text-gray-300 hover:text-white text-sm md:text-base font-medium group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {t('contact.gdPortfolioBtn')}
                </a>
            </motion.div>

            <footer className="text-gray-600 text-sm mt-auto">
                <p>&copy; {new Date().getFullYear()} Batıkan UZ. {t('contact.allRights')}</p>
                <p className="mt-2">{t('contact.designedWith')}</p>
            </footer>
        </Section>
    );
};

export default Contact;
