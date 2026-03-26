import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Section = ({ children, className, id }) => {
    return (
        <section id={id} className={cn("min-h-screen flex flex-col justify-center px-4 md:px-20 py-20", className)}>
            {children}
        </section>
    );
};

export default Section;
