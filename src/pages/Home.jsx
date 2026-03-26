import React from 'react';
import Hero from '../components/Hero';
import Experience from '../components/Experience';
import Skills from '../components/Skills';
import Contact from '../components/Contact';

const Home = () => {
    return (
        <main className="bg-background relative z-10 selection:bg-purple-500 selection:text-white">
            <Hero />
            <Experience />
            <Skills />
            <Contact />
        </main>
    );
};

export default Home;
