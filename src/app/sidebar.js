"use client";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";

const SIDEBAR_WIDTH = 260;
const WAVE_HEIGHT = 120;
const WAVE_POINTS = 8;

const subpages = [
  "Home",
  "About", 
  "Blog",
  "Contact",
  "Portfolio",
];

function getWavePath(cursorY, sidebarHeight) {
  // Use fixed height for SSR to prevent hydration mismatch
  const height = sidebarHeight || 800;
  const points = [];
  for (let i = 0; i <= WAVE_POINTS; i++) {
    const t = i / WAVE_POINTS;
    const y = t * height;
    const peak = Math.exp(-Math.pow((y - cursorY) / 120, 2)) * 60;
    points.push({ x: SIDEBAR_WIDTH + peak, y });
  }
  let path = `M0,0 L${SIDEBAR_WIDTH},0 `;
  points.forEach((pt) => (path += `L${pt.x.toFixed(2)},${pt.y.toFixed(2)} `));
  path += `L${SIDEBAR_WIDTH},${height} L0,${height} Z`;
  return path;
}

export default function SideBar() {
  const [visible, setVisible] = useState(false);
  const [cursorY, setCursorY] = useState(300);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sidebarY = useRef(300); // Use ref for animation
  const [sidebarYState, setSidebarYState] = useState(300); // For re-render
  const sidebarRef = useRef(null);
  const waveRef = useRef(null);
  const itemRefs = useRef([]);
  const router = useRouter();

  // Mobile detection and resize handling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile(); // Check on mount
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Desktop mouse handling (only when not mobile)
  useEffect(() => {
    if (isMobile) return;
    
    const handleMouseMove = (e) => {
      setCursorY(e.clientY);
      // Extended zone: 120px from left edge (was 40)
      if (e.clientX < 120) setVisible(true);
      else if (e.clientX > SIDEBAR_WIDTH + 80) setVisible(false);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  // Additional mouse event for closer trigger zone (desktop only)
  useEffect(() => {
    if (isMobile) return;
    
    const handleMouseMove = (e) => {
      setCursorY(e.clientY);
      if (e.clientX < 40) setVisible(true);
      else if (e.clientX > SIDEBAR_WIDTH + 40) setVisible(false);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  // Animate sidebarY ref with GSAP and update state for re-render (desktop only)
  useEffect(() => {
    if (isMobile) return; // Skip animations on mobile
    
    gsap.to(sidebarY, {
      current: cursorY,
      duration: 0.4,
      ease: "power2.out",
      onUpdate: () => setSidebarYState(sidebarY.current),
    });
  }, [cursorY, isMobile]);

  // Animate sidebar in/out
  useEffect(() => {
    if (sidebarRef.current) {
      gsap.to(sidebarRef.current, {
        x: visible ? 0 : -SIDEBAR_WIDTH,
        duration: 0.35,
        ease: "power3.inOut",
      });
    }
  }, [visible]);

  // Animate wave path (desktop only)
  useEffect(() => {
    // Only run on client side after hydration and not on mobile
    if (isMobile || typeof window === 'undefined' || !waveRef.current || !sidebarRef.current) return;
    
    const sidebarHeight = sidebarRef.current.offsetHeight;
    const path = getWavePath(sidebarYState, sidebarHeight);
    gsap.to(waveRef.current, {
      attr: { d: path },
      duration: 0.3,
      ease: "power2.out",
    });
  }, [sidebarYState, visible, isMobile]);

  // Animate each item based on cursor position (desktop only)
  useEffect(() => {
    if (isMobile || !itemRefs.current) return; // Skip animations on mobile
    
    itemRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const itemHeight = 32;
      const navPadding = 48;
      const itemSpacing = 24;
      const itemY =
        navPadding +
        i * (itemHeight + itemSpacing) +
        itemHeight / 2;
      const dist = Math.abs(itemY - sidebarYState);
      const maxShift = 80; // Increased from 36 to 80 for more extreme movement
      const influence = 0.8; // Lower = more elements are influenced (try 0.5~1)
      const shift = Math.max(0, maxShift - (dist * influence));
      gsap.to(ref, {
        x: shift,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  }, [sidebarYState, visible, isMobile]);

  return (
    <>
      {/* Desktop-only elements */}
      {!isMobile && (
        <>
          {/* Animated Arrow - Larger and more opaque */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "60px",
              transform: "translateY(-50%)",
              color: "rgba(255, 255, 255, 0.95)",
              fontSize: "32px",
              zIndex: 998,
              pointerEvents: "none",
              opacity: visible ? 1 : 0.7,
              transition: "opacity 0.3s ease-out",
              animation: "pulseArrow 3s ease-in-out infinite",
            }}
          >
            →
          </div>
        </>
      )}

      {/* Mobile Pancake Menu */}
      {isMobile && (
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            zIndex: 1001,
            backgroundColor: "#18181b",
            border: "none",
            borderRadius: "8px",
            padding: "12px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <div
            style={{
              width: "24px",
              height: "3px",
              backgroundColor: "#fff",
              borderRadius: "2px",
              transition: "all 0.3s ease",
              transform: mobileMenuOpen ? "rotate(45deg) translateY(7px)" : "none",
            }}
          />
          <div
            style={{
              width: "24px",
              height: "3px",
              backgroundColor: "#fff",
              borderRadius: "2px",
              transition: "all 0.3s ease",
              opacity: mobileMenuOpen ? 0 : 1,
            }}
          />
          <div
            style={{
              width: "24px",
              height: "3px",
              backgroundColor: "#fff",
              borderRadius: "2px",
              transition: "all 0.3s ease",
              transform: mobileMenuOpen ? "rotate(-45deg) translateY(-7px)" : "none",
            }}
          />
        </button>
      )}

      {/* Global CSS for site margins and animations */}
      <style jsx global>{`
        /* Make the page background dark to remove the white strip on the left */
        :root {
          color-scheme: dark;
        }
        html, body {
          background-color: #0b0b0b;
        }

        @keyframes pulseArrow {
          0%, 100% {
            transform: translate(-50%, -50%) translateX(0px);
            opacity: 0.9;
          }
          50% {
            transform: translate(-50%, -50%) translateX(20px);
            opacity: 1;
          }
        }

        /* Desktop: Respect sidebar margins */
        @media (min-width: 768px) {
          html, body {
            overflow-x: hidden;
            width: 100vw;
            margin: 0;
            padding: 0;
            /* keep dark background for the padded area */
            background-color: #0b0b0b;
          }
          body {
            padding-left: 160px; /* Total sidebar space */
          }
          
          /* Ensure main content doesn't overlap sidebar */
          main, .main-content, [class*="page"], [class*="container"] {
            margin-left: 0;
            padding-left: 20px;
            min-height: 100vh;
            max-width: 100%;
          }

          /* Center text elements by moving them back to true center */
          .centered-text, 
          [class*="center"], 
          h1, h2, h3, h4, h5, h6,
          .text-center,
          .home-title,
          .hero-text {
            text-align: center;
            margin-left: -80px; /* Half of sidebar offset */
            margin-right: -80px;
            position: relative;
          }

          /* Specifically target common centered elements */
          div[style*="text-align: center"],
          div[style*="text-align:center"] {
            text-align: center;
            margin-left: -80px;
            margin-right: -80px;
            position: relative;
          }
        }

        /* Mobile: Reset margins */
        @media (max-width: 767px) {
          body {
            margin-left: 0;
            padding-left: 0;
            /* keep dark background on mobile too */
            background-color: #0b0b0b;
          }
          
          main, .main-content, [class*="page"], [class*="container"] {
            margin-left: 0;
            padding-left: 0;
          }

          /* Reset centering on mobile - remove desktop transforms */
          .centered-text, 
          [class*="center"], 
          h1, h2, h3, h4, h5, h6,
          .text-center,
          .home-title,
          .hero-text {
            text-align: center;
            margin-left: 0 !important;
            margin-right: 0 !important;
            position: static;
          }

          /* Reset specifically targeted centered elements */
          div[style*="text-align: center"],
          div[style*="text-align:center"] {
            text-align: center;
            margin-left: 0 !important;
            margin-right: 0 !important;
            position: static;
          }
        }
      `}</style>

      <div
        ref={sidebarRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: SIDEBAR_WIDTH,
          height: "100vh",
          zIndex: 1000,
          pointerEvents: (isMobile ? mobileMenuOpen : visible) ? "auto" : "none",
          boxShadow: (isMobile ? mobileMenuOpen : visible) ? "2px 0 16px rgba(0,0,0,0.12)" : "none",
          color: "#ffffff",
          overflow: "hidden",
          backgroundColor: "#18181b",
          transform: isMobile ? `translateX(${mobileMenuOpen ? 0 : -SIDEBAR_WIDTH}px)` : "none",
        }}
      >
        <svg
          width={SIDEBAR_WIDTH + 80}
          height="100%"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        >
          <path
            ref={waveRef}
            d={getWavePath(300, 800)}
            fill="#18181b"
          />
        </svg>
        <nav style={{ position: "relative", zIndex: 2, padding: "48px 24px" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {subpages.map((page, i) => (
              <li
                key={i}
                style={{ margin: "24px 0" }}
                ref={el => (itemRefs.current[i] = el)}
              >
                {page === "Portfolio" ? (
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      router.push("/portfolio");
                    }}
                    style={{
                      color: "#fff",
                      textDecoration: "none",
                      fontWeight: 500,
                      fontSize: "1.1rem",
                      transition: "color 0.2s",
                      display: "inline-block",
                      minWidth: "100px",
                    }}
                  >
                    {page}
                  </a>
                ) : page === "Home" ? (
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      router.push("/");
                    }}
                    style={{
                      color: "#fff",
                      textDecoration: "none",
                      fontWeight: 500,
                      fontSize: "1.1rem",
                      transition: "color 0.2s",
                      display: "inline-block",
                      minWidth: "100px",
                    }}
                  >
                    {page}
                  </a>
                ) : page === "Blog" ? (
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      router.push("/blog");
                    }}
                    style={{
                      color: "#fff",
                      textDecoration: "none",
                      fontWeight: 500,
                      fontSize: "1.1rem",
                      transition: "color 0.2s",
                      display: "inline-block",
                      minWidth: "100px",
                    }}
                  >
                    {page}
                  </a>
                ) : page === "About" || page === "Contact" ? (
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      // Navigate to home page first if not already there
                      if (window.location.pathname !== "/") {
                        router.push("/");
                        // Wait for navigation then scroll
                        setTimeout(() => {
                          window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                        }, 100);
                      } else {
                        // Already on home page, just scroll to about section
                        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                      }
                    }}
                    style={{
                      color: "#fff",
                      textDecoration: "none",
                      fontWeight: 500,
                      fontSize: "1.1rem",
                      transition: "color 0.2s",
                      display: "inline-block",
                      minWidth: "100px",
                    }}
                  >
                    {page}
                  </a>
                ) : (
                  <a
                    href="#"
                    style={{
                      color: "#fff",
                      textDecoration: "none",
                      fontWeight: 500,
                      fontSize: "1.1rem",
                      transition: "color 0.2s",
                      display: "inline-block",
                      minWidth: "100px",
                    }}
                  >
                    {page}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}