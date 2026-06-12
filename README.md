<div align="center">

# ✦ Prashik Fulke — Personal Portfolio

**A premium, single-page portfolio built with Next.js 14, Three.js & Framer Motion**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Portfolio-C2D099?style=for-the-badge&labelColor=0a0a0a)](https://github.com/PrashikFulke/Prashik-Portfolio)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-r162-white?style=for-the-badge&logo=three.js&logoColor=black)](https://threejs.org/)

</div>

---

## 📖 Overview

A high-performance, fully responsive personal portfolio website showcasing projects, skills, and professional experience. Built with a focus on **premium UX**, smooth scroll-driven animations, and a glassmorphism design system — designed to make a strong first impression.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎨 **Glassmorphism UI** | Layered frosted-glass panels with subtle borders and blur |
| 🌌 **3D Particle Background** | Interactive Three.js canvas that reacts to ob=verall mouse movement |
| 🎬 **Scroll Animations** | Framer Motion viewport-triggered entrance animations |
| 🟡 **Pac-Man Timeline** | Animated Pac-Man that travels down the experience timeline on scroll |
| 📱 **Fully Responsive** | Mobile-first layout that adapts seamlessly across all screen sizes |
| 🗂️ **Project Modal** | Click-to-expand project cards with detailed case study descriptions |
| 🔍 **SEO Optimized** | Dynamic metadata, Open Graph tags, `robots.js`, and `sitemap.js` |
| ⚡ **Performance First** | CSS optimization, console stripping in production, gzip compression |

---

## 🗂️ Project Structure

```
Portfolio/
├── app/                    # Next.js App Router
│   ├── layout.jsx          # Root layout with metadata & global styles
│   ├── page.jsx            # Main single-page application
│   ├── globals.css         # Global CSS & design token variables
│   ├── robots.js           # SEO: robots.txt generation
│   └── sitemap.js          # SEO: sitemap.xml generation
│
├── components/             # Reusable React components
│   ├── Navbar.jsx          # Sticky navigation with smooth-scroll links
│   ├── Footer.jsx          # Site footer with social links
│   └── ThreeBackground.jsx # Three.js animated particle canvas
│
├── public/                 # Static assets
│   ├── Prashik_Fulke_Resume.pdf
│   └── resume.html
│
├── next.config.mjs         # Next.js configuration (compression, security)
├── tailwind.config.js      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
```

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **UI Library:** [React 18](https://reactjs.org/)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/) + Custom CSS Variables
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **3D Graphics:** [Three.js](https://threejs.org/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.17
- **npm** ≥ 9

### Installation & Development

```bash
# 1. Clone the repository
git clone https://github.com/PrashikFulke/Prashik-Portfolio.git

# 2. Navigate into the project directory
cd Prashik-Portfolio

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint for code quality checks |

---

## 🏗️ Sections

1. **Hero** — Full Name, tagline, availability badge, and CTA links
2. **About Me** — Background, focus areas, and academic foundation
3. **Tech Arsenal** — Skills grouped by category (AI/ML, Languages, Infrastructure)
4. **Featured Projects** — Horizontally scrollable cards with expandable case studies
5. **Experience & Education** — Animated vertical timeline with scroll-driven Pac-Man indicator

---

## 🤝 Connect

<div align="left">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-prashik--fulke-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/prashik-fulke/)
[![GitHub](https://img.shields.io/badge/GitHub-PrashikFulke-181717?style=flat-square&logo=github)](https://github.com/PrashikFulke)

</div>

---

<div align="center">

**Designed & built by Prashik Fulke** · © 2025

</div>
