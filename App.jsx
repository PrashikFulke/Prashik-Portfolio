"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Terminal, ShieldCheck, Globe, Linkedin, Mail, Github, Download, ArrowUp, Menu, X, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Play } from 'lucide-react';

const GlowingStar = ({ scrollYProgress, index }) => {
  const threshold = index === 0 ? 0.15 : index === 1 ? 0.5 : 0.85;
  const opacity = useTransform(scrollYProgress, [threshold - 0.05, threshold], [1, 0]);
  const scale = useTransform(scrollYProgress, [threshold - 0.05, threshold], [1, 0]);

  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute left-[22px] md:left-[calc(50%-6px)] -translate-x-1/2 top-6 md:top-1/2 md:-translate-y-1/2 w-6 h-6 z-10 flex items-center justify-center text-primary drop-shadow-[0_0_10px_rgba(194,208,153,0.8)]"
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#050505] rounded-full -z-10"></div>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    </motion.div>
  );
};

const ThreeBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const particleCount = 200;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;

      velocities.push({
        x: (Math.random() - 0.5) * 0.015,
        y: (Math.random() - 0.5) * 0.015,
        z: (Math.random() - 0.5) * 0.015
      });
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.12,
      transparent: true,
      opacity: 0.3,
      sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particles, pMaterial);
    scene.add(particleSystem);

    const maxLines = (particleCount * (particleCount - 1)) / 2;
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(maxLines * 6);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xC2D099,
      transparent: true,
      opacity: 0.15
    });

    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX - window.innerWidth / 2);
      mouseY = (event.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const minDistance = 2.5;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const posAttribute = particles.getAttribute('position');
      const positionsArray = posAttribute.array;

      for (let i = 0; i < particleCount; i++) {
        positionsArray[i * 3] += velocities[i].x;
        positionsArray[i * 3 + 1] += velocities[i].y;
        positionsArray[i * 3 + 2] += velocities[i].z;

        if (Math.abs(positionsArray[i * 3]) > 12) velocities[i].x *= -1;
        if (Math.abs(positionsArray[i * 3 + 1]) > 12) velocities[i].y *= -1;
        if (positionsArray[i * 3 + 2] > 2 || positionsArray[i * 3 + 2] < -12) velocities[i].z *= -1;
      }
      posAttribute.needsUpdate = true;

      let vertexCount = 0;
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = positionsArray[i * 3] - positionsArray[j * 3];
          const dy = positionsArray[i * 3 + 1] - positionsArray[j * 3 + 1];
          const dz = positionsArray[i * 3 + 2] - positionsArray[j * 3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < minDistance * minDistance) {
            linePositions[vertexCount++] = positionsArray[i * 3];
            linePositions[vertexCount++] = positionsArray[i * 3 + 1];
            linePositions[vertexCount++] = positionsArray[i * 3 + 2];
            linePositions[vertexCount++] = positionsArray[j * 3];
            linePositions[vertexCount++] = positionsArray[j * 3 + 1];
            linePositions[vertexCount++] = positionsArray[j * 3 + 2];
          }
        }
      }
      lineGeometry.setDrawRange(0, vertexCount / 3);
      lineGeometry.attributes.position.needsUpdate = true;

      targetX = mouseX * 0.001;
      targetY = mouseY * 0.001;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (-targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-[-1] pointer-events-none" />;
};

const Logo = () => {
  return (
    <a href="#" className="font-mono font-bold text-lg flex items-center group text-white hover:text-primary transition-colors">
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
    </a>
  );
};

const Navbar = () => {
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
        <a href="#about" className="text-sm font-medium text-white/70 hover:text-primary transition-colors py-2 md:py-0 w-full md:w-auto text-center">About</a>
        <a href="#skills" className="text-sm font-medium text-white/70 hover:text-primary transition-colors py-2 md:py-0 w-full md:w-auto text-center">Skills</a>
        <a href="#projects" className="text-sm font-medium text-white/70 hover:text-primary transition-colors py-2 md:py-0 w-full md:w-auto text-center">Projects</a>
        <a href="#experience" className="text-sm font-medium text-white/70 hover:text-primary transition-colors py-2 md:py-0 w-full md:w-auto text-center">Experience</a>
        <a href="#contact" className="mt-2 md:mt-0 glass-btn px-6 py-2 rounded-full text-sm font-medium w-full md:w-auto text-center border border-white/5 hover:border-primary transition-all">Let's Connect</a>
      </div>
    </nav>
  );
};

export default function App() {
  const journeyRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedProject]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };
  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ["start center", "end center"]
  });
  const pacmanTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:wght@600;700&display=swap');
        :root {
          --primary: #C2D099;
          --secondary: #DCE8B9;
          --dark: #000000;
        }
        body {
          background-color: var(--dark);
          color: #ffffff;
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .text-primary { color: var(--primary); }
        .bg-primary { background-color: var(--primary); }
        .border-primary { border-color: var(--primary); }
        
        .glass-panel {
          background: rgba(25, 25, 25, 0.4);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
          transition: all 0.3s ease;
        }
        .glass-panel:hover {
          border-color: rgba(194, 208, 153, 0.8);
        }
        .glass-btn {
          background: rgba(25, 25, 25, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }
        .glass-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          transform: translateY(-2px);
        }
        .text-gradient {
          background: linear-gradient(to right, #ffffff, var(--primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .btn-glow:hover {
          box-shadow: 0 0 20px rgba(194, 208, 153, 0.4);
          border-color: var(--primary);
          color: var(--primary);
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: var(--dark); }
        ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--primary); }
        ::selection { background: var(--primary); color: #000; }
        html { scroll-behavior: smooth; }
      `}} />

      <ThreeBackground />
      <Navbar />

      <main className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 pt-40 pb-24 flex flex-col gap-32">

        {/* Hero Section */}
        <section className="min-h-[75vh] flex flex-col justify-center items-start pt-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 px-4 py-2 rounded-full glass-panel w-fit mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              <span className="text-xs sm:text-sm font-mono text-white/80">Available for Opportunities</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-tight">
              Hi, I'm <br className="hidden sm:block" />
              <span className="text-gradient">Prashik Fulke.</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/70 max-w-2xl mb-12 leading-relaxed">
              I'm an Artificial Intelligence & Data Science Graduate.
            </p>

            <div className="flex flex-col gap-4 w-full max-w-md">
              <a href="#projects" className="glass-btn w-full text-center py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 group">
                View Projects
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </a>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <a href="mailto:fulkeprashik@gmail.com" className="glass-btn text-center py-3 px-2 sm:px-4 rounded-xl font-medium flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" /> <span className="hidden sm:inline">Email</span>
                </a>
                <a href="https://www.linkedin.com/in/prashik-fulke/" target="_blank" rel="noopener noreferrer" className="glass-btn text-center py-3 px-2 sm:px-4 rounded-xl font-medium flex items-center justify-center gap-2">
                  <Linkedin className="w-5 h-5" /> <span className="hidden sm:inline">LinkedIn</span>
                </a>
                <a href="https://github.com/PrashikFulke" target="_blank" rel="noopener noreferrer" className="glass-btn text-center py-3 px-2 sm:px-4 rounded-xl font-medium flex items-center justify-center gap-2">
                  <Github className="w-5 h-5" /> <span className="hidden sm:inline">GitHub</span>
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Section 00: About Me */}
        <section id="about" className="scroll-mt-32">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-sm font-mono text-primary mb-3">00. Who I Am</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-10"><span className="text-gradient">About Me</span></h3>

            <div className="glass-panel rounded-3xl p-8 md:p-12">
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10">
                I am passionate about solving real-world problems by combining intelligent data models with robust software architecture. My approach focuses on building scalable systems that are both analytically profound and beautifully designed.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "Academic Foundation:", desc: "B.Tech in AI & Data Science at Anjuman College of Engineering, RTMNU (Expected 2026)." },
                  { title: "AI & Security Focus:", desc: "Building ML/DL models (Autoencoders, Isolation Forests) for real-time cybersecurity." },
                  { title: "Full-Stack Execution:", desc: "Python, HTML/CSS, Firebase, DigitalOcean deployment." },
                  { title: "Problem Solver:", desc: "Analytical thinker creating scalable, security-driven applications." }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <p className="text-white/70"><strong className="text-white font-medium">{item.title}</strong> {item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Section 01: Tech Arsenal */}
        <section id="skills" className="scroll-mt-32">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-sm font-mono text-primary mb-3">01. What I Use</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-10"><span className="text-gradient">Tech Arsenal</span></h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Large Bio Card */}
              <div className="md:col-span-3 glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden">
                <Terminal className="absolute top-8 right-8 w-24 h-24 text-white/5 rotate-12" />
                <h4 className="text-2xl font-bold mb-4">Bridging the Gap</h4>
                <p className="text-white/70 text-lg max-w-4xl leading-relaxed relative z-10">
                  I specialize in standing at the intersection of data science and software engineering. From training deep learning models for anomaly detection to building responsive, user-friendly web applications, I bring end-to-end technical execution to every project.
                </p>
              </div>

              {/* Category Cards */}
              {[
                { icon: <ShieldCheck className="w-6 h-6 text-primary" />, title: "AI & Data Science", tags: ["Machine Learning", "Deep Learning", "Anomaly Detection", "Prompt Eng."] },
                { icon: <Terminal className="w-6 h-6 text-primary" />, title: "Languages & DBs", tags: ["Python", "SQL", "HTML/CSS", "Firebase RTDB"] },
                { icon: <Globe className="w-6 h-6 text-primary" />, title: "Infrastructure & Tools", tags: ["Firebase", "DigitalOcean", "Streamlit", "REST APIs", "Git & GitHub", "VS Code"] }
              ].map((cat, idx) => (
                <motion.div key={idx} whileHover={{ y: -5 }} className="glass-panel rounded-3xl p-8 flex flex-col h-full transition-transform duration-300">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                    {cat.icon}
                  </div>
                  <h4 className="text-xl font-bold mb-6">{cat.title}</h4>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {cat.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-3 py-1.5 glass-panel rounded-lg text-xs font-mono text-secondary">{tag}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Section 02: Selected Work */}
        <section id="projects" className="scroll-mt-32">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-sm font-mono text-primary mb-3">02. Selected Work</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-10"><span className="text-gradient">Featured Projects</span></h3>

            <div className="relative group/slider">
              <button 
                onClick={scrollLeft}
                className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white/50 hover:text-primary hover:border-primary transition-all opacity-0 group-hover/slider:opacity-100"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={scrollRight}
                className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white/50 hover:text-primary hover:border-primary transition-all opacity-0 group-hover/slider:opacity-100"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-8 snap-x snap-mandatory hide-scrollbar pb-8 pt-4 px-2 -mx-2"
              >
                {[
                  { 
                    date: "Independent Project, span of 2 weeks", 
                    title: "Baxton: Autonomous Agent", 
                    points: [
                      "Multi-Agent LLM Orchestration using LangGraph, LangChain, and multiple LLMs.",
                      "RAG & Persistent Memory via Supabase (PostgreSQL) with pgvector.",
                      "Autonomous Audience Engagement and Background DM Negotiation & Follow-up."
                    ], 
                    tags: ["Python", "FastAPI", "LangGraph/LangChain", "Playwright", "Supabase", "Groq/NVIDIA APIs", "SQLite"], 
                    hasLink: false, 
                    hasVideo: true, 
                    videoLink: "",
                    extendedDescription: `Developed a fully autonomous, stateful AI web agent capable of executing continuous research, negotiation, and contextual engagement loops across modern React Single-Page Applications (SPAs) like Reddit and Instagram. Operating as a background daemon, the system utilizes stealth browser automation and a multi-tiered Large Language Model (LLM) architecture to read live chat interfaces, make deterministic conversational decisions, and synthesize unstructured social data into actionable intelligence dossiers.

🛠️ What I Built (My Contributions)
As the sole architect and developer of Baxton, I engineered the entire system from the ground up. Key technical achievements include:
- Multi-Agent LLM Orchestration: Designed a 5-role LLM architecture (Orchestrator, Router, Vision, Decider, Drafter) using LangGraph, LangChain, and multiple LLM providers (NVIDIA Llama 3.3 70B, Groq Llama 3.1 8B, and Llama 4 Scout Vision).
- RAG & Persistent Memory: Integrated Supabase (PostgreSQL) with pgvector and Google Gemini Embeddings to give the agent long-term memory, allowing it to adapt its tone and conversational playbook dynamically based on past interactions.
- Robust Error Handling & Safeties: Implemented cognitive fallbacks (auto-cascading from a 70B to an 8B model on rate limits), session expiry detection, stale ticket garbage collection, and an "Anti-Loop Mandate" to prevent recursive tool executions.

🎯 Key Use Cases
- Autonomous Audience Engagement: Automatically monitors Instagram and Reddit timelines, analyzes image posts via the Vision LLM, and drops highly contextual, AI-generated comments in a specific brand voice.
- Background DM Negotiation & Follow-up: Manages multi-turn DMs asynchronously. It can follow up on dead conversations, extract actionable insights into an "Executive Dossier" (Key Takeaway, Target Mood, Next Steps), and ping the admin via Telegram when a goal is reached.
- Automated Research & Synthesis: Receives a vague query on Telegram, searches the live web (SearXNG) and social platforms (X/Reddit) concurrently, synthesizes the findings, and returns a concise, easy-to-read report.
- Social Intelligence Recon: Autonomously views a target's Instagram stories or profile picture, uses the Vision model to analyze the content, and DMs a summary of what the target is up to.`
                  },
                  { 
                    date: "Independent Project, Aug 2025", 
                    title: "OSAgent", 
                    points: ["Engineered a highly responsive web application with a robust Firebase backend architecture.", "Deployed securely on DigitalOcean, achieving a 30% improvement in load performance."], 
                    tags: ["HTML/CSS", "Firebase", "DigitalOcean"], 
                    hasLink: true, 
                    link: "https://osagent.tech/",
                    extendedDescription: `Engineered a highly responsive web application with a robust Firebase backend architecture. Deployed securely on DigitalOcean, achieving a 30% improvement in load performance. Focus was to build a clean architecture and optimize the deployment pipeline for scaling.`
                  },
                  { 
                    date: "Softsense Intern, Mar - Apr 2025", 
                    title: "AI Log Monitoring & Threat Detection", 
                    points: ["Reduced false positives by 30% through advanced anomaly detection models.", "Processed and analyzed real-time log streams for instantaneous threat alerts."], 
                    tags: ["Python", "Machine Learning"], 
                    hasLink: false,
                    extendedDescription: `Spearheaded the development of AI models for network anomaly detection during my internship at Softsense Technoserve. Successfully reduced false positives by 30% through advanced anomaly detection models and achieved over 90% detection accuracy.

Processed and analyzed real-time log streams for instantaneous threat alerts using robust machine learning techniques and Python.`
                  }
                ].map((proj, idx) => (
                  <motion.div 
                    key={idx} 
                    whileHover={{ scale: 1.02 }} 
                    onClick={() => setSelectedProject(proj)}
                    className="w-full md:w-[calc(50%-16px)] shrink-0 snap-center glass-panel rounded-3xl p-8 md:p-10 flex flex-col group relative overflow-hidden transition-all duration-300 cursor-pointer"
                  >
                    {proj.hasLink && (
                      <a href={proj.link || "#"} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="absolute top-8 right-8 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white/50 group-hover:text-primary group-hover:border-primary transition-all z-10">
                        <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    )}
                    {proj.hasVideo && (
                      <a href={proj.videoLink || "#"} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="absolute top-8 right-8 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white/50 group-hover:text-primary group-hover:border-primary transition-all z-10" title="Watch Video">
                        <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </a>
                    )}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-8 -mt-8 blur-2xl transition-opacity opacity-0 group-hover:opacity-100"></div>

                    <p className="text-xs font-mono text-primary mb-3 uppercase tracking-wider">{proj.date}</p>
                    <h4 className="text-2xl md:text-3xl font-bold mb-6 pr-8">{proj.title}</h4>

                    <ul className="space-y-3 mb-10 grow">
                      {proj.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-3 text-white/70">
                          <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-1" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {proj.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="px-3 py-1 bg-white/5 rounded-md text-xs font-mono border border-white/10 text-white/80">{tag}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>



        {/* Section 03: Journey */}
        <section id="experience" className="scroll-mt-32">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="text-sm font-mono text-primary mb-3">03. My Journey</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-12"><span className="text-gradient">Experience & Education</span></h3>

            <div className="relative max-w-4xl mx-auto" ref={journeyRef}>
              {/* Vertical Line */}
              <div className="absolute left-[28px] md:left-[50%] -translate-x-1/2 top-0 bottom-0 w-[2px] bg-white/10 z-0"></div>

              {/* Scrolling Pacman */}
              <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes chompTop {
                  0%, 100% { transform: rotate(-45deg); }
                  50% { transform: rotate(0deg); }
                }
                @keyframes chompBottom {
                  0%, 100% { transform: rotate(45deg); }
                  50% { transform: rotate(0deg); }
                }
              `}} />
              <motion.div
                className="absolute left-[28px] md:left-[50%] -translate-x-1/2 w-6 h-6 z-20 mt-[-12px]"
                style={{ top: pacmanTop }}
              >
                <div className="relative w-6 h-6 rotate-90 drop-shadow-[0_0_15px_rgba(194,208,153,0.8)]">
                  <div className="absolute top-0 left-0 w-full h-3 bg-primary rounded-t-[12px] origin-bottom" style={{ animation: 'chompTop 0.4s infinite' }}></div>
                  <div className="absolute top-3 left-0 w-full h-3 bg-primary rounded-b-[12px] origin-top" style={{ animation: 'chompBottom 0.4s infinite' }}></div>
                </div>
              </motion.div>

              <div className="space-y-16">
                {[
                  { title: "Intern (AI & Cybersecurity)", sub: "Softsense Technoserve | Mar 2025 - Apr 2025", desc: "Spearheaded the development of AI models for network anomaly detection. Successfully achieved over 90% detection accuracy in identifying anomalous network behaviors and potential threats.", align: "right" },
                  { title: "B.Tech in AI & Data Science", sub: "Anjuman College of Engineering, RTMNU | Expected 2026", desc: "Focusing on machine learning, deep learning, and robust software engineering practices. CGPA: 6.89.", align: "left" },
                  { title: "12th (HSC)", sub: "Sindhu Mahavidyalaya | 2021 - 2022", desc: "Completed higher secondary education with a focus on science and mathematics. Secured 57%.", align: "right" }
                ].map((node, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2, duration: 0.6 }}
                    className={`relative flex flex-col ${node.align === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center justify-between group`}
                  >
                    <GlowingStar scrollYProgress={scrollYProgress} index={idx} />

                    <div className={`md:w-1/2 w-full pl-16 md:pl-0 ${node.align === 'right' ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'} mb-4 md:mb-0`}>
                      <h4 className="text-xl md:text-2xl font-bold">{node.title}</h4>
                      <p className="text-primary font-mono text-sm mt-1 mb-2">{node.sub}</p>
                    </div>
                    <div className={`md:w-1/2 w-full pl-12 md:pl-0 ${node.align === 'right' ? 'md:pl-16' : 'md:pr-16'}`}>
                      <div className="glass-panel p-6 rounded-2xl relative">
                        <p className="text-white/70 text-sm md:text-base">{node.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

      </main>

      {/* Footer / Contact */}
      <footer id="contact" className="border-t border-white/10 pt-12 pb-6 bg-gradient-to-b from-transparent to-black">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 items-center">
            {/* Left Side */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-3 tracking-tight text-white">PRASHIK FULKE</h2>
              <p className="text-white/70 text-sm max-w-sm mb-6 leading-relaxed">
                Building products, systems, and AI-powered applications. Always learning by doing.
              </p>
              <div className="flex gap-2">
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

            {/* Right Side */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="flex flex-col items-start lg:items-end justify-center gap-4">
              <a href="mailto:fulkeprashik@gmail.com" className="glass-panel btn-glow px-6 py-3 rounded-xl text-base md:text-lg font-bold tracking-widest transition-all hover:text-primary">
                [ WORK WITH ME ]
              </a>

              <div className="flex flex-col items-start lg:items-end gap-2 mt-1">
                <a href="Prashik_Fulke_Resume.pdf" download className="text-white/70 text-xs hover:text-primary transition-colors flex items-center gap-2 group font-medium">
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
    {/* Project Modal */}
    <AnimatePresence>
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[85vh] glass-panel rounded-3xl overflow-hidden flex flex-col"
          >
            <div className="p-8 md:p-10 overflow-y-auto hide-scrollbar">
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white/50 hover:text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <p className="text-sm font-mono text-primary mb-3 uppercase tracking-wider">{selectedProject.date}</p>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pr-12">
                <h3 className="text-3xl md:text-5xl font-bold">{selectedProject.title}</h3>
                
                <div className="flex gap-3">
                  {selectedProject.hasLink && (
                    <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="glass-btn px-4 py-2 rounded-full text-sm font-medium border border-white/10 hover:border-primary transition-all flex items-center gap-2 text-white whitespace-nowrap">
                      View Project <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                  {selectedProject.hasVideo && (
                    <a href={selectedProject.videoLink} target="_blank" rel="noopener noreferrer" className="glass-btn px-4 py-2 rounded-full text-sm font-medium border border-white/10 hover:border-primary transition-all flex items-center gap-2 text-white whitespace-nowrap">
                      Watch Video <Play className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {selectedProject.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="px-4 py-2 bg-white/5 rounded-lg text-sm font-mono border border-white/10 text-white/90">{tag}</span>
                ))}
              </div>

              <div className="prose prose-invert max-w-none text-white/80 leading-relaxed whitespace-pre-line space-y-6">
                {selectedProject.extendedDescription}
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}
