"use client";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import SideBar from "../../sidebar";

// ========== PORTFOLIO CONFIGURATION - EASY TO EDIT ==========
interface PortfolioConfig {
  title: string;
  subtitle?: string;
  description?: string;
  gridLayout: 'masonry' | 'grid' | 'uniform';
  showImageNumbers: boolean;
  showCaptions: boolean;
  backgroundColor?: string;
  heroImage?: string;
  projectDetails?: {
    date?: string;
    location?: string;
    equipment?: string[];
  };
  images: Array<{
    id: string;
    title: string;
    description: string;
    src: string;
    alt: string;
  }>;
}

const PORTFOLIO_CONFIG: PortfolioConfig = {
  // Page Info
  title: "Redmen Basketball 2025",

  // Layout Settings
  gridLayout: "masonry", // "masonry" | "grid" | "uniform"
  showImageNumbers: false,
  showCaptions: false,
  
  // Styling
  backgroundColor: "", // Leave empty for default, or set custom color like "#f8f9fa"
  
  // Optional Hero Section
  heroImage: "", // Leave empty to hide hero, or add image URL
  
  // Project Details (leave empty to hide section)
  projectDetails: undefined, // Add details to enable the section
  
  // Images Array
  images: [
    ...Array.from({ length: 36 }, (_, i) => ({
      id: `basketball-${i + 1}`,
      title: `Basketball Moment ${i + 1}`,
      description: "Dynamic basketball photography capturing the intensity of the game",
      src: `/portfolio/basketball/image${i + 1}.jpg`,
      alt: `Basketball photography image ${i + 1}`
    }))
  ]
};
// ============================================================

export default function LifestylePortfolio() {
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

  // Handle lightbox opening
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === PORTFOLIO_CONFIG.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? PORTFOLIO_CONFIG.images.length - 1 : prev - 1
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          prevImage();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          nextImage();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightboxOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ backgroundColor: PORTFOLIO_CONFIG.backgroundColor || '' }}>
      <SideBar />
      
      {/* Header: centered title, right-aligned back button */}
      <header className="w-full py-6 px-10 md:px-16 border-b border-black/10 dark:border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center">
          <div className="hidden md:block" />
          <h1 className="text-2xl md:text-3xl font-bold text-center break-words whitespace-normal w-full">
            {PORTFOLIO_CONFIG.title}
          </h1>
          <div className="hidden md:block justify-self-end pr-12 md:pr-24">
            <button
              onClick={() => router.push("/portfolio")}
              className="text-sm text-foreground/60 hover:text-foreground"
            >
              Back to Portfolio
            </button>
          </div>
        </div>
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
      {PORTFOLIO_CONFIG.projectDetails && (PORTFOLIO_CONFIG.projectDetails.date || PORTFOLIO_CONFIG.projectDetails.location || PORTFOLIO_CONFIG.projectDetails.equipment) && (
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
              {PORTFOLIO_CONFIG.projectDetails.equipment && (
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


          {/* Dynamic Grid Layout */}
          <div 
            ref={containerRef}
            className={
              PORTFOLIO_CONFIG.gridLayout === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : PORTFOLIO_CONFIG.gridLayout === 'uniform'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "columns-1 md:columns-2 lg:columns-3 gap-4"
            }
          >
            {PORTFOLIO_CONFIG.images.map((image, index) => (
              <div
                key={`image-${image.id}-${index}`}
                ref={el => { imagesRef.current[index] = el; }}
                className={`
                  ${PORTFOLIO_CONFIG.gridLayout === 'masonry' ? 'break-inside-avoid mb-4' : ''}
                  bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 cursor-pointer relative overflow-hidden group
                `}
                style={PORTFOLIO_CONFIG.gridLayout !== 'masonry' ? {
                  aspectRatio: '3/4'
                } : {}}
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
                <div className="w-full relative">
                  <img 
                    src={image.src}
                    alt={image.alt}
                    className={`
                      w-full transition-transform duration-300 group-hover:scale-105
                      ${PORTFOLIO_CONFIG.gridLayout === 'masonry' 
                        ? 'h-auto object-contain' 
                        : 'h-full object-cover'
                      }
                    `}
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
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}
          onClick={closeLightbox}
        >
          {/* Close Button - Top Right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              cursor: 'pointer',
              zIndex: 10001
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ×
          </button>

          {/* Progress Indicator - Top Left */}
          <div
            style={{
              position: 'fixed',
              top: '20px',
              left: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '25px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              zIndex: 10001
            }}
          >
            {currentImageIndex + 1}/{PORTFOLIO_CONFIG.images.length}
          </div>

          {/* Previous Button - Responsive */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            style={{
              position: 'fixed',
              // Desktop or Mobile Landscape: left side, Mobile Portrait: bottom left
              left: (window.innerWidth <= 768 && window.innerHeight > window.innerWidth) ? 'calc(50% - 60px)' : '20px',
              top: (window.innerWidth <= 768 && window.innerHeight > window.innerWidth) ? 'auto' : '50%',
              bottom: (window.innerWidth <= 768 && window.innerHeight > window.innerWidth) ? '20px' : 'auto',
              transform: (window.innerWidth <= 768 && window.innerHeight > window.innerWidth) ? 'none' : 'translateY(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              cursor: 'pointer',
              zIndex: 10001
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
              const isMobilePortrait = window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
              const currentTransform = isMobilePortrait ? 'scale(1.1)' : 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.transform = currentTransform;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
              const isMobilePortrait = window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
              const currentTransform = isMobilePortrait ? 'scale(1)' : 'translateY(-50%) scale(1)';
              e.currentTarget.style.transform = currentTransform;
            }}
          >
            ‹
          </button>

          {/* Next Button - Responsive */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            style={{
              position: 'fixed',
              // Desktop or Mobile Landscape: right side, Mobile Portrait: bottom right
              right: (window.innerWidth <= 768 && window.innerHeight > window.innerWidth) ? 'auto' : '20px',
              left: (window.innerWidth <= 768 && window.innerHeight > window.innerWidth) ? 'calc(50% + 4px)' : 'auto',
              top: (window.innerWidth <= 768 && window.innerHeight > window.innerWidth) ? 'auto' : '50%',
              bottom: (window.innerWidth <= 768 && window.innerHeight > window.innerWidth) ? '20px' : 'auto',
              transform: (window.innerWidth <= 768 && window.innerHeight > window.innerWidth) ? 'none' : 'translateY(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              cursor: 'pointer',
              zIndex: 10001
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
              const isMobilePortrait = window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
              const currentTransform = isMobilePortrait ? 'scale(1.1)' : 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.transform = currentTransform;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
              const isMobilePortrait = window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
              const currentTransform = isMobilePortrait ? 'scale(1)' : 'translateY(-50%) scale(1)';
              e.currentTarget.style.transform = currentTransform;
            }}
          >
            ›
          </button>

          {/* Main Image */}
          <div
            style={{
              position: 'absolute',
              top: '80px',
              // Desktop or Mobile Landscape: margin for side arrows, Mobile Portrait: margin for bottom arrows
              bottom: (window.innerWidth <= 768 && window.innerHeight > window.innerWidth) ? '100px' : '80px',
              left: (window.innerWidth <= 768 && window.innerHeight > window.innerWidth) ? '40px' : '100px', // Increased from 20px to 40px for more space
              right: (window.innerWidth <= 768 && window.innerHeight > window.innerWidth) ? '40px' : '100px', // Increased from 20px to 40px for more space
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src={PORTFOLIO_CONFIG.images[currentImageIndex].src}
              alt={PORTFOLIO_CONFIG.images[currentImageIndex].alt}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block'
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Optional Caption */}
          {PORTFOLIO_CONFIG.showCaptions && PORTFOLIO_CONFIG.images[currentImageIndex].description && (
            <div
              style={{
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                right: '20px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '16px',
                borderRadius: '8px',
                zIndex: 10001
              }}
            >
              <h3 style={{ fontWeight: '500', marginBottom: '4px' }}>
                {PORTFOLIO_CONFIG.images[currentImageIndex].title}
              </h3>
              <p style={{ fontSize: '14px', opacity: '0.9' }}>
                {PORTFOLIO_CONFIG.images[currentImageIndex].description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

