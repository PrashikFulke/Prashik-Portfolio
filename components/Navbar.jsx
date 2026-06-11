"use client";
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Logo = () => {
  return (
    <Link href="/" className="font-mono font-bold text-lg flex items-center group text-white hover:text-primary transition-colors">
      <span>P</span>
      <motion.span
        initial={{ maxWidth: 0, opacity: 0 }}
        animate={{ maxWidth: 150, opacity: 1 }}
        transition={{ duration: 3, delay: 1.5, ease: "easeInOut" }}
        className="overflow-hidden whitespace-nowrap inline-block"
      >
        RASHIK_
      </motion.span>
      <span>F</span>
      <motion.span
        initial={{ maxWidth: 0, opacity: 0 }}
        animate={{ maxWidth: 150, opacity: 1 }}
        transition={{ duration: 3, delay: 1.5, ease: "easeInOut" }}
        className="overflow-hidden whitespace-nowrap inline-block"
      >
        ULKE
      </motion.span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="text-primary"
      >
        _
      </motion.span>
    </Link>
  );
};

const SpotlightButton = ({ href, children, className }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <Link
      href={href}
      ref={buttonRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 ease-in-out"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle 50px at ${position.x}px ${position.y}px, rgba(194, 208, 153, 0.5), transparent 100%)`,
        }}
      />
    </Link>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 glass-panel rounded-2xl md:rounded-full px-6 py-4 flex flex-col md:flex-row justify-between items-center transition-all duration-300 backdrop-blur-2xl">
      <div className="flex justify-between items-center w-full md:w-auto">
        <Logo />
        <button className="md:hidden text-white/70 hover:text-white" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className={`${isOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center gap-2 md:gap-8 mt-4 md:mt-0 w-full md:w-auto pb-4 md:pb-0`}>
        <Link href="#about" className="text-sm font-medium text-white/70 hover:text-primary transition-colors py-2 md:py-0 w-full md:w-auto text-center">About</Link>
        <Link href="#skills" className="text-sm font-medium text-white/70 hover:text-primary transition-colors py-2 md:py-0 w-full md:w-auto text-center">Skills</Link>
        <Link href="#projects" className="text-sm font-medium text-white/70 hover:text-primary transition-colors py-2 md:py-0 w-full md:w-auto text-center">Projects</Link>
        <Link href="#experience" className="text-sm font-medium text-white/70 hover:text-primary transition-colors py-2 md:py-0 w-full md:w-auto text-center">Experience</Link>
        <SpotlightButton href="#contact" className="mt-2 md:mt-0 glass-btn px-6 py-2 rounded-full text-sm font-medium w-full md:w-auto text-center border border-white/5 hover:border-primary transition-all">
          Let's Connect
        </SpotlightButton>
      </div>
    </nav>
  );
}
