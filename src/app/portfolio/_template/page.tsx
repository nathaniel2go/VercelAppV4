"use client";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import SideBar from "../../sidebar";

// ========== PORTFOLIO CONFIGURATION - EASY TO EDIT ==========
const PORTFOLIO_CONFIG = {
  // Page Info
  title: "Your Portfolio Title", // CHANGE THIS
  subtitle: "Your Subtitle", // CHANGE THIS 
  description: "Your portfolio description goes here", // CHANGE THIS
  
  // Layout Settings
  gridLayout: "masonry", // "masonry" | "grid" | "uniform" - CHOOSE ONE
  showImageNumbers: false, // true | false
  showCaptions: true, // true | false
  
  // Styling
  backgroundColor: "", // Leave empty for default, or set custom color like "#f8f9fa"
  
  // Optional Hero Section
  heroImage: "", // Leave empty to hide hero, or add image URL
  
  // Project Details (leave empty to hide section)
  projectDetails: {
    date: "", // e.g. "2024" or "January 2024"
    location: "", // e.g. "New York City"
    equipment: [] // e.g. ["Canon EOS R5", "24-70mm f/2.8"]
  },
  
  // Images Array - ADD YOUR IMAGES HERE
  images: [
    {
      id: 1,
      title: "Image Title 1",
      description: "Image description 1",
      src: "https://your-image-url.com/image1.jpg", // REPLACE WITH YOUR IMAGE
      alt: "Descriptive alt text for image 1"
    },
    {
      id: 2,
      title: "Image Title 2",
      description: "Image description 2",
      src: "https://your-image-url.com/image2.jpg", // REPLACE WITH YOUR IMAGE
      alt: "Descriptive alt text for image 2"
    },
    // ADD MORE IMAGES AS NEEDED...
  ]
};
// ============================================================

export default function YourPortfolioName() { // CHANGE FUNCTION NAME
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const router = useRouter();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Simplified animation for better performance
    gsap.fromTo(
      imagesRef.current,
      {
        opacity: 0,
        y: 20
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out"
      }
    );
  }, []);

  const handleImageHover = (index: number, isHover: boolean) => {
    const image = imagesRef.current[index];
    if (!image) return;

    // Simplified hover animation
    gsap.to(image, {
      scale: isHover ? 1.01 : 1,
      duration: 0.2,
      ease: "power1.out"
    });
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ backgroundColor: PORTFOLIO_CONFIG.backgroundColor || '' }}>
      <SideBar />
      
      {/* Header */}
      <header className="w-full py-6 px-8 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
        <div>
          <button 
            onClick={() => router.back()}
            className="text-sm text-foreground/60 hover:text-foreground mb-2 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Portfolio
          </button>
          <h1 className="text-3xl font-bold">{PORTFOLIO_CONFIG.title}</h1>
          {PORTFOLIO_CONFIG.subtitle && (
            <p className="text-lg text-foreground/70 mt-1">{PORTFOLIO_CONFIG.subtitle}</p>
          )}
        </div>
        <span className="text-sm text-foreground/60">{PORTFOLIO_CONFIG.subtitle || PORTFOLIO_CONFIG.description}</span>
      </header>

      {/* Hero Section (Optional) */}
      {PORTFOLIO_CONFIG.heroImage && (
        <div className="w-full h-64 md:h-96 relative overflow-hidden">
          <img
            src={PORTFOLIO_CONFIG.heroImage}
            alt={`${PORTFOLIO_CONFIG.title} hero`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">{PORTFOLIO_CONFIG.title}</h2>
              <p className="text-lg max-w-2xl px-4">{PORTFOLIO_CONFIG.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Project Details (Optional) */}
      {PORTFOLIO_CONFIG.projectDetails && (PORTFOLIO_CONFIG.projectDetails.date || PORTFOLIO_CONFIG.projectDetails.location || PORTFOLIO_CONFIG.projectDetails.equipment?.length) && (
        <section className="w-full px-8 py-8 bg-foreground/5">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PORTFOLIO_CONFIG.projectDetails.date && (
                <div>
                  <h3 className="font-semibold mb-2">Date</h3>
                  <p className="text-foreground/70">{PORTFOLIO_CONFIG.projectDetails.date}</p>
                </div>
              )}
              {PORTFOLIO_CONFIG.projectDetails.location && (
                <div>
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p className="text-foreground/70">{PORTFOLIO_CONFIG.projectDetails.location}</p>
                </div>
              )}
              {PORTFOLIO_CONFIG.projectDetails.equipment && PORTFOLIO_CONFIG.projectDetails.equipment.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Equipment</h3>
                  <ul className="text-foreground/70 space-y-1">
                    {PORTFOLIO_CONFIG.projectDetails.equipment.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="w-full px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">{PORTFOLIO_CONFIG.title} Collection</h2>
            <p className="text-base text-foreground/60">
              {PORTFOLIO_CONFIG.images.length} images
            </p>
          </div>

          {/* Dynamic Grid Layout */}
          <div 
            ref={containerRef}
            className={
              PORTFOLIO_CONFIG.gridLayout === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : PORTFOLIO_CONFIG.gridLayout === 'uniform'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                : "columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4"
            }
          >
            {PORTFOLIO_CONFIG.images.map((image, index) => (
              <div
                key={image.id}
                ref={el => { imagesRef.current[index] = el; }}
                className={`
                  ${PORTFOLIO_CONFIG.gridLayout === 'masonry' ? 'break-inside-avoid mb-4' : ''}
                  bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 cursor-pointer relative overflow-hidden group
                `}
                style={PORTFOLIO_CONFIG.gridLayout === 'masonry' ? {
                  height: `${280 + (index % 3) * 60}px`
                } : {
                  aspectRatio: '3/4'
                }}
                onMouseEnter={() => handleImageHover(index, true)}
                onMouseLeave={() => handleImageHover(index, false)}
                onClick={() => {
                  setCurrentImageIndex(index);
                  setLightboxOpen(true);
                  document.body.style.overflow = 'hidden';
                }}
              >
                {/* Image Number (Optional) */}
                {PORTFOLIO_CONFIG.showImageNumbers && (
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm z-10">
                    {index + 1}
                  </div>
                )}

                {/* Image */}
                <div className="w-full h-full relative">
                  <img 
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Caption Overlay (Optional) */}
                {PORTFOLIO_CONFIG.showCaptions && image.description && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-white font-medium text-sm">{image.title}</h3>
                    <p className="text-white/80 text-xs mt-1">{image.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closeLightbox}>
          <div className="relative max-w-4xl max-h-full">
            <img
              src={PORTFOLIO_CONFIG.images[currentImageIndex].src}
              alt={PORTFOLIO_CONFIG.images[currentImageIndex].alt}
              className="max-w-full max-h-full object-contain"
            />
            {PORTFOLIO_CONFIG.showCaptions && PORTFOLIO_CONFIG.images[currentImageIndex].description && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-4">
                <h3 className="font-medium">{PORTFOLIO_CONFIG.images[currentImageIndex].title}</h3>
                <p className="text-sm mt-1">{PORTFOLIO_CONFIG.images[currentImageIndex].description}</p>
              </div>
            )}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}