import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

const LanguageSelector = () => {
    const { i18n, t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'tr', label: 'TR' },
        { code: 'en', label: 'EN' },
        { code: 'de', label: 'DE' },
        { code: 'ru', label: 'RU' }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

    const handleSelect = (code) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className="fixed top-6 right-6 md:top-10 md:right-10 z-[100]">
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-md px-4 py-2 text-xs md:text-sm text-gray-200 uppercase tracking-widest rounded-full border border-white/10 hover:border-white/30 transition-all shadow-lg"
                >
                    {currentLang.label}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-20 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl origin-top-right">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleSelect(lang.code)}
                                className={`w-full text-center py-3 text-xs tracking-[0.15em] hover:bg-white/10 transition-colors uppercase
                                    ${i18n.language === lang.code ? 'text-white font-medium bg-white/5' : 'text-gray-400'}`}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LanguageSelector;
