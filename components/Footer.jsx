"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail, Github, Download, ArrowUp } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10 pt-12 pb-6 bg-gradient-to-b from-transparent to-black">
      <div className="max-w-6xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-3 tracking-tight text-white">PRASHIK FULKE</h2>
            <p className="text-white/70 text-sm max-w-sm mb-6 leading-relaxed">
              Building products, systems, and AI-powered applications. Always learning by doing.
            </p>
            <div className="flex gap-3">
              <a href="https://www.linkedin.com/in/prashik-fulke/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:text-primary hover:border-primary hover:-translate-y-1 transition-all group" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
              <a href="mailto:fulkeprashik@gmail.com" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:text-primary hover:border-primary hover:-translate-y-1 transition-all group" aria-label="Email">
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://github.com/PrashikFulke" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:text-primary hover:border-primary hover:-translate-y-1 transition-all group" aria-label="GitHub">
                <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="flex flex-col items-start lg:items-end justify-center gap-6">
            <a href="mailto:fulkeprashik@gmail.com" className="glass-panel btn-glow px-6 py-3 rounded-xl text-base md:text-lg font-bold tracking-widest transition-all hover:text-primary">
              [ WORK WITH ME ]
            </a>

            <div className="flex flex-col items-start lg:items-end gap-2 mt-2">
              <a href="Prashik_Fulke_Resume.pdf" target="_blank" rel="noopener noreferrer" aria-label="Download Prashik's Resume" title="Download Prashik's Resume" className="text-white/70 text-xs hover:text-primary transition-colors flex items-center gap-2 group font-medium">
                <Download className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" /> Download Resume
              </a>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-white/70 text-xs hover:text-primary transition-colors flex items-center gap-2 group font-medium">
                <ArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" /> Back To Top
              </button>
            </div>
          </motion.div>
        </div>

        <div className="text-center text-xs font-mono text-white/40 pt-6 border-t border-white/10 tracking-widest uppercase">
          Copyright © 2026 Prashik Fulke. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
