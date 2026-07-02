import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import dynamic from 'next/dynamic';

// Dynamically import ThreeBackground to prevent it from blocking the initial render
// This drastically improves First Contentful Paint (FCP) and Time to Interactive (TTI)
const ThreeBackground = dynamic(() => import('../components/ThreeBackground'), {
  ssr: false,
});

export const metadata = {
  metadataBase: new URL('https://prashikfulke.me'),
  title: {
    default: 'Prashik Fulke | AI & Data Science Portfolio',
    template: '%s | Prashik Fulke',
  },
  description: 'Portfolio of Prashik Fulke, an Artificial Intelligence and Data Science graduate specializing in Machine Learning, Deep Learning, and secure Web Architecture.',
  keywords: ['Prashik Fulke', 'AI', 'Data Science', 'Machine Learning', 'Next.js', 'React', 'Cybersecurity', 'Portfolio'],
  authors: [{ name: 'Prashik Fulke' }],
  creator: 'Prashik Fulke',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://prashikfulke.me',
    title: 'Prashik Fulke | AI & Data Science',
    description: 'Portfolio of Prashik Fulke, an Artificial Intelligence and Data Science graduate specializing in Machine Learning, Deep Learning, and secure Web Architecture.',
    siteName: 'Prashik Fulke Portfolio',
    images: [
      {
        url: '/placeholder-og.jpg', // Placeholder for OG Image
        width: 1200,
        height: 630,
        alt: 'Prashik Fulke Portfolio Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prashik Fulke | AI & Data Science',
    description: 'Portfolio of Prashik Fulke, an Artificial Intelligence and Data Science graduate specializing in Machine Learning, Deep Learning, and secure Web Architecture.',
    images: ['/placeholder-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  // JSON-LD Structured Data for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Prashik Fulke",
    jobTitle: "AI & Data Science Engineer",
    url: "https://prashikfulke.me",
    sameAs: [
      "https://www.linkedin.com/in/prashik-fulke/",
      "https://github.com/PrashikFulke"
    ],
    knowsAbout: ["Artificial Intelligence", "Data Science", "Machine Learning", "React", "Next.js", "Python"]
  };

  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-black focus:font-bold rounded-lg outline-none">
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThreeBackground />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
