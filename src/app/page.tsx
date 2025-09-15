"use client";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import SideBar from "./sidebar";

// Dynamic image loading from multiple folders
const imageCategories = {
  nature: Array.from({ length: 21 }, (_, i) => `/portfolio/nature/image${i + 1}.jpg`), 
  basketball: Array.from({ length: 36 }, (_, i) => `/portfolio/basketball/image${i + 1}.jpg`), 
  people: Array.from({ length: 18 }, (_, i) => `/portfolio/people/image${i + 1}.jpg`), 
  sports: Array.from({ length: 16 }, (_, i) => `/portfolio/sports/image${i + 1}.jpg`), 
  studio: Array.from({ length: 15 }, (_, i) => `/portfolio/studio/image${i + 1}.jpg`), 
  wedding: Array.from({ length: 21 }, (_, i) => `/portfolio/wedding/image${i + 1}.jpg`), 
};

// Fallback images that definitely exist (using the ones from your original code)
const fallbackImages = [
  "/portfolio/lifestyle/image1.jpg",
  "/portfolio/lifestyle/image2.jpg", 
  "/portfolio/lifestyle/image3.jpg",
  "/portfolio/lifestyle/image4.jpg",
  "/portfolio/lifestyle/image5.jpg",
  "/portfolio/lifestyle/image6.jpg",
];

// Combine all images from all categories, with fallback
const availableImages = [
  ...imageCategories.nature,
  ...imageCategories.basketball,
  ...imageCategories.people,
  ...imageCategories.sports,
  ...imageCategories.studio,
  ...imageCategories.wedding,
  ...fallbackImages, // Include fallbacks to ensure we have working images
].filter((img, index, arr) => arr.indexOf(img) === index); // Remove duplicates

// TEMPORARY: Use only fallback images for testing (uncomment this line to test)
// const availableImages = fallbackImages;

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const mainContentRef = useRef<HTMLElement>(null);
  const profileImageRef = useRef<HTMLDivElement>(null);
  const aboutHeadingRef = useRef<HTMLHeadingElement>(null);
  const aboutTextRef = useRef<HTMLParagraphElement>(null);
  const socialIconsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Track if page is visible to prevent flooding
    let isPageVisible = !document.hidden;
    let interval: NodeJS.Timeout;
    let collisionInterval: NodeJS.Timeout;

    // Function to properly cleanup shape and its image
    const cleanupShape = (shape: HTMLDivElement) => {
      // Find and cleanup the image element
      const img = shape.querySelector('img');
      if (img) {
        // Remove event listeners
        img.onload = null;
        img.onerror = null;
        // Clear src to stop any pending downloads
        img.src = '';
        // Remove from DOM
        img.remove();
      }
      
      // Remove shape from container if it exists
      if (container && container.contains(shape)) {
        container.removeChild(shape);
      }
      
      // Remove from shapes array
      const index = shapesRef.current.indexOf(shape);
      if (index > -1) {
        shapesRef.current.splice(index, 1);
      }
    };

    // Function to check if elements overlap
    const checkCollision = (rect1: DOMRect, rect2: DOMRect) => {
      return !(rect1.right < rect2.left || 
               rect1.left > rect2.right || 
               rect1.bottom < rect2.top || 
               rect1.top > rect2.bottom);
    };

    // Function to nudge individual letters and about section elements
    const nudgeText = () => {
      const title = titleRef.current;
      const subtitle = subtitleRef.current;
      const profileImage = profileImageRef.current;
      const aboutHeading = aboutHeadingRef.current;
      const aboutText = aboutTextRef.current;
      const socialIcons = socialIconsRef.current;

      if (!title || !subtitle) return;

      // Get all letter spans
      const titleLetters = title.querySelectorAll('span[data-letter]');
      const subtitleLetters = subtitle.querySelectorAll('span[data-letter]');
      const aboutLetters = aboutHeading ? aboutHeading.querySelectorAll('span[data-about-letter]') : [];
      const socialIconsElements = socialIcons ? socialIcons.querySelectorAll('.social-icon') : [];

      // Calculate target positions for each letter and element
      const letterTargets = new Map();
      const elementTargets = new Map();

      // Initialize all title/subtitle letters with zero displacement
      titleLetters.forEach(letter => {
        letterTargets.set(letter, { x: 0, y: 0 });
      });
      subtitleLetters.forEach(letter => {
        letterTargets.set(letter, { x: 0, y: 0 });
      });

      // Initialize about section letters with zero displacement
      aboutLetters.forEach(letter => {
        letterTargets.set(letter, { x: 0, y: 0 });
      });

      // Initialize individual social icons with zero displacement
      socialIconsElements.forEach(icon => {
        letterTargets.set(icon, { x: 0, y: 0 });
      });

      // Initialize larger about section elements with zero displacement
      if (profileImage) elementTargets.set(profileImage, { x: 0, y: 0 });
      // Removed aboutText - paragraph is no longer responsive to collision

      // Check each shape for collisions with individual letters
      shapesRef.current.forEach(shape => {
        if (!container.contains(shape)) return;
        
        const shapeRect = shape.getBoundingClientRect();
        const shapeSize = parseInt(shape.style.width); // Get actual shape size
        const outlineWidth = parseInt(shape.dataset.outlineWidth || '0'); // Get outline width
        const totalSize = shapeSize + (outlineWidth * 2); // Include outline in collision
        const collisionRadius = totalSize * 0.7; // Increased collision radius including outline

        // Check collision with title letters
        titleLetters.forEach(letter => {
          const letterRect = letter.getBoundingClientRect();
          const letterCenterX = letterRect.left + letterRect.width / 2;
          const letterCenterY = letterRect.top + letterRect.height / 2;
          const shapeCenterX = shapeRect.left + shapeRect.width / 2;
          const shapeCenterY = shapeRect.top + shapeRect.height / 2;

          // Calculate distance between centers
          const distance = Math.sqrt(
            Math.pow(letterCenterX - shapeCenterX, 2) + 
            Math.pow(letterCenterY - shapeCenterY, 2)
          );

          // If within collision radius, calculate nudge
          if (distance < collisionRadius && distance > 0) {
            const angle = Math.atan2(letterCenterY - shapeCenterY, letterCenterX - shapeCenterX);
            const influence = Math.max(0, (collisionRadius - distance) / collisionRadius);
            const nudgeDistance = influence * 40; // Increased force for more reactiveness
            
            const currentTarget = letterTargets.get(letter);
            currentTarget.x += Math.cos(angle) * nudgeDistance;
            currentTarget.y += Math.sin(angle) * nudgeDistance;
          }
        });

        // Check collision with subtitle letters
        subtitleLetters.forEach(letter => {
          const letterRect = letter.getBoundingClientRect();
          const letterCenterX = letterRect.left + letterRect.width / 2;
          const letterCenterY = letterRect.top + letterRect.height / 2;
          const shapeCenterX = shapeRect.left + shapeRect.width / 2;
          const shapeCenterY = shapeRect.top + shapeRect.height / 2;

          // Calculate distance between centers
          const distance = Math.sqrt(
            Math.pow(letterCenterX - shapeCenterX, 2) + 
            Math.pow(letterCenterY - shapeCenterY, 2)
          );

          // If within collision radius, calculate nudge
          if (distance < collisionRadius && distance > 0) {
            const angle = Math.atan2(letterCenterY - shapeCenterY, letterCenterX - shapeCenterX);
            const influence = Math.max(0, (collisionRadius - distance) / collisionRadius);
            const nudgeDistance = influence * 25; // Increased force for subtitle too
            
            const currentTarget = letterTargets.get(letter);
            currentTarget.x += Math.cos(angle) * nudgeDistance;
            currentTarget.y += Math.sin(angle) * nudgeDistance;
          }
        });

        // Check collision with about heading letters
        aboutLetters.forEach(letter => {
          const letterRect = letter.getBoundingClientRect();
          const letterCenterX = letterRect.left + letterRect.width / 2;
          const letterCenterY = letterRect.top + letterRect.height / 2;
          const shapeCenterX = shapeRect.left + shapeRect.width / 2;
          const shapeCenterY = shapeRect.top + shapeRect.height / 2;

          // Calculate distance between centers
          const distance = Math.sqrt(
            Math.pow(letterCenterX - shapeCenterX, 2) + 
            Math.pow(letterCenterY - shapeCenterY, 2)
          );

          // If within collision radius, calculate nudge
          if (distance < collisionRadius && distance > 0) {
            const angle = Math.atan2(letterCenterY - shapeCenterY, letterCenterX - shapeCenterX);
            const influence = Math.max(0, (collisionRadius - distance) / collisionRadius);
            const nudgeDistance = influence * 35; // Strong nudge for about heading letters
            
            const currentTarget = letterTargets.get(letter);
            currentTarget.x += Math.cos(angle) * nudgeDistance;
            currentTarget.y += Math.sin(angle) * nudgeDistance;
          }
        });

        // Check collision with individual social icons
        socialIconsElements.forEach(icon => {
          const iconRect = icon.getBoundingClientRect();
          const iconCenterX = iconRect.left + iconRect.width / 2;
          const iconCenterY = iconRect.top + iconRect.height / 2;
          const shapeCenterX = shapeRect.left + shapeRect.width / 2;
          const shapeCenterY = shapeRect.top + shapeRect.height / 2;

          // Calculate distance between centers
          const distance = Math.sqrt(
            Math.pow(iconCenterX - shapeCenterX, 2) + 
            Math.pow(iconCenterY - shapeCenterY, 2)
          );

          // Use a much larger and more generous collision radius for social icons
          const iconCollisionRadius = Math.max(collisionRadius * 1.2, 120); // Larger radius for better detection

          // If within collision radius, calculate nudge
          if (distance < iconCollisionRadius && distance > 0) {
            const angle = Math.atan2(iconCenterY - shapeCenterY, iconCenterX - shapeCenterX);
            const influence = Math.max(0, (iconCollisionRadius - distance) / iconCollisionRadius);
            const nudgeDistance = influence * 50; // Much stronger nudge for visibility
            
            const currentTarget = letterTargets.get(icon);
            if (currentTarget) {
              currentTarget.x += Math.cos(angle) * nudgeDistance;
              currentTarget.y += Math.sin(angle) * nudgeDistance;
            }
          }
        });

        // Check collision with about section elements
        elementTargets.forEach((target, element) => {
          const elementRect = element.getBoundingClientRect();
          const elementCenterX = elementRect.left + elementRect.width / 2;
          const elementCenterY = elementRect.top + elementRect.height / 2;
          const shapeCenterX = shapeRect.left + shapeRect.width / 2;
          const shapeCenterY = shapeRect.top + shapeRect.height / 2;

          // Calculate distance between centers
          const distance = Math.sqrt(
            Math.pow(elementCenterX - shapeCenterX, 2) + 
            Math.pow(elementCenterY - shapeCenterY, 2)
          );

          // Use larger collision radius for profile image to match its 320px size
          let elementCollisionRadius = collisionRadius;
          if (element === profileImage) {
            elementCollisionRadius = Math.max(collisionRadius, 200); // 320px image needs ~200px collision radius
          }

          // If within collision radius, calculate nudge
          if (distance < elementCollisionRadius && distance > 0) {
            const angle = Math.atan2(elementCenterY - shapeCenterY, elementCenterX - shapeCenterX);
            const influence = Math.max(0, (elementCollisionRadius - distance) / elementCollisionRadius);
            
            // Different nudge distances for different elements
            let nudgeDistance = influence * 25; // Increased base nudge
            if (element === profileImage) {
              nudgeDistance = influence * 30; // Stronger nudge for better visibility on large image
            }
            
            target.x += Math.cos(angle) * nudgeDistance;
            target.y += Math.sin(angle) * nudgeDistance;
          }
        });
      });

      // Apply responsive animations to target positions
      letterTargets.forEach((target, letter) => {
        gsap.to(letter, {
          x: target.x,
          y: target.y,
          duration: 0.25, // Much faster response time
          ease: "power2.out", // Snappier easing for responsiveness
          overwrite: "auto"
        });
      });

      // Apply animations to about section elements
      elementTargets.forEach((target, element) => {
        gsap.to(element, {
          x: target.x,
          y: target.y,
          duration: 0.3, // Slightly slower for larger elements
          ease: "power2.out",
          overwrite: "auto"
        });
      });
    };

    // Create and animate floating image shapes
    const createShape = () => {
      const shape = document.createElement('div');
      const img = document.createElement('img');
      
      // METHOD 1: Random from all images (current approach)
      const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];
      img.src = randomImage;
      img.className = 'w-full h-full object-cover';
      
      // Add error handling for missing images
      img.onerror = () => {
        console.warn(`Failed to load image: ${randomImage}`);
        // Fallback to a solid color or pattern if image fails
        shape.style.backgroundColor = '#333';
        shape.style.backgroundImage = 'linear-gradient(45deg, #444 25%, transparent 25%, transparent 75%, #444 75%, #444), linear-gradient(45deg, #444 25%, transparent 25%, transparent 75%, #444 75%, #444)';
        shape.style.backgroundSize = '20px 20px';
        shape.style.backgroundPosition = '0 0, 10px 10px';
        img.style.display = 'none';
      };
      
      // Add loading success handler
      img.onload = () => {
        console.log(`Successfully loaded: ${randomImage}`);
      };
      
      // Random shape properties - responsive sizing
      const isMobile = window.innerWidth < 768; // Mobile breakpoint
      const baseSize = isMobile ? 100 : 200; // Half size for mobile
      const sizeVariation = isMobile ? 100 : 200; // Half variation for mobile
      const size = Math.random() * sizeVariation + baseSize; // 100px to 200px (mobile) or 200px to 400px (desktop)
      
      // Expanded shape types with more variety
      const shapeTypes = [
        'circle',
        'rounded-lg',
        'horizontal-rect',
        'polygon-6', // Hexagon
        'polygon-8', // Octagon
        'polygon-5', // Pentagon
        'diamond',
        'rounded-square'
      ];
      
      const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      const baseOutlineWidth = isMobile ? 3 : 6; // Half outline width for mobile
      const outlineVariation = isMobile ? 4 : 8; // Half variation for mobile
      const outlineWidth = baseOutlineWidth + Math.random() * outlineVariation; // 3-7px (mobile) or 6-14px (desktop)
      
      // Cool black and white outline styles
      const outlineStyles = [
        'solid #f0f0f0',
        'solid #e0e0e0',
      ];
      const randomOutline = outlineStyles[Math.floor(Math.random() * outlineStyles.length)];
      
      // Apply shape-specific styling
      let width = size;
      let height = size;
      let borderRadius = '';
      let clipPath = '';
      let useClipPath = false;

      switch (shapeType) {
        case 'circle':
          borderRadius = '50%';
          break;
        case 'rounded-lg':
          borderRadius = '16px';
          break;
        case 'rounded-square':
          borderRadius = '24px';
          break;
        case 'horizontal-rect':
          width = size * 1.3; // Make it moderately wider
          height = size * 0.75; // Make it slightly shorter
          borderRadius = '12px';
          break;
      }

      shape.className = `absolute overflow-hidden opacity-80`;
      shape.style.width = `${width}px`;
      shape.style.height = `${height}px`;
      shape.style.borderRadius = borderRadius;
      
      // Apply clip-path for polygons
      if (useClipPath && clipPath) {
        shape.style.clipPath = clipPath;
      }
      
      // Apply rotation for diamond
      if (shapeType === 'diamond') {
        shape.style.transform = 'rotate(45deg)';
      }
      
      // Position the shape across the screen vertically - THIS IS THE KEY FIX
      shape.style.left = '-600px'; // Start further off-screen
      shape.style.top = `${Math.random() * (window.innerHeight - Math.max(height, width))}px`;
      
      // Apply borders and shadows
      shape.style.border = `${outlineWidth}px ${randomOutline}`;
      shape.style.boxShadow = `0 0 20px rgba(255, 255, 255, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.2)`;
      
      // Store outline width for collision detection
      shape.dataset.outlineWidth = outlineWidth.toString();
      
      shape.appendChild(img);
      container.appendChild(shape);
      shapesRef.current.push(shape);

      // Hard cap: Force cleanup after 15 seconds regardless of animation state
      const forceCleanupTimeout = setTimeout(() => {
        cleanupShape(shape);
        timeline.kill(); // Kill any running animations
      }, 15000); // 15 seconds hard limit

      // Animate across screen with wave motion
      const timeline = gsap.timeline({
        onComplete: () => {
          // Clear the force cleanup timeout since animation completed normally
          clearTimeout(forceCleanupTimeout);
          // Properly cleanup image and shape
          cleanupShape(shape);
        }
      });

      // Smooth continuous movement with gentle speed variation
      const totalDuration = 12 + Math.random() * 8; // 12-20 seconds (more consistent, longer duration)
      
      // Use only the gentlest easing curves for predictable, smooth motion
      const gentleEasings = [
        "power1.inOut",    // Very gentle acceleration/deceleration
        "sine.inOut",      // Smooth, wave-like speed changes
        "none"             // Constant speed (most predictable)
      ];
      
      const randomEasing = gentleEasings[Math.floor(Math.random() * gentleEasings.length)];
      
      // Single smooth animation across entire screen
      timeline.to(shape, {
        x: window.innerWidth + 600,
        duration: totalDuration,
        ease: randomEasing
      });

      // Wave motion (vertical)
      timeline.to(shape, {
        y: `+=${Math.random() * 300 - 150}`, // Bigger wave amplitude
        duration: Math.random() * 4 + 3, // 3-7 seconds
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      }, 0);

      // Limited rotation (±45 degrees) - but don't rotate diamonds as they're already rotated
      if (shapeType !== 'diamond') {
        const rotationAmount = (Math.random() - 0.5) * 45; // -45 to +45 degrees
        timeline.to(shape, {
          rotation: rotationAmount,
          duration: Math.random() * 8 + 6, // 6-14 seconds
          ease: "sine.inOut"
        }, 0);
      }
    };

    // Visibility change handler to prevent flooding
    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
      
      if (!isPageVisible) {
        // Page hidden - clear intervals to prevent accumulation
        if (interval) clearInterval(interval);
        if (collisionInterval) clearInterval(collisionInterval);
      } else {
        // Page visible - restart intervals only if they don't exist
        startIntervals();
      }
    };

    // Function to start intervals (prevents duplicates)
    const startIntervals = () => {
      // Clear any existing intervals first
      if (interval) clearInterval(interval);
      if (collisionInterval) clearInterval(collisionInterval);

      // Create shapes at intervals (less frequent)
      const isMobile = window.innerWidth < 768;
      const spawnTime = isMobile ? Math.random() * 2000 + 1000 : Math.random() * 4000 + 6000; // 1-3s (mobile) or 3-7s (desktop)
      interval = setInterval(() => {
        if (isPageVisible) createShape();
      }, spawnTime);

      // Check for collisions and nudge text regularly
      collisionInterval = setInterval(() => {
        if (isPageVisible) nudgeText();
      }, 100); // Check every 100ms for smooth interactions
    };

    // Add visibility event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
    window.addEventListener('blur', handleVisibilityChange);

    // Scroll animation handler
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollProgress = Math.min(scrollY / windowHeight, 1);

      // Animate main content (title/subtitle) flying up
      gsap.to(mainContentRef.current, {
        y: -scrollY * 0.8,
        opacity: Math.max(0, 1 - scrollProgress * 1.5),
        duration: 0.3,
        ease: "power2.out"
      });

      // Animate about section sliding up from bottom
      gsap.to(aboutSectionRef.current, {
        y: Math.max(0, windowHeight - scrollY),
        opacity: Math.min(1, scrollProgress * 2),
        duration: 0.3,
        ease: "power2.out"
      });
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);

    // Start intervals initially
    startIntervals();

    // Initial shapes (fewer)
    for (let i = 0; i < 2; i++) {
      setTimeout(() => createShape(), i * 2000);
    }

    return () => {
      // Clear intervals
      if (interval) clearInterval(interval);
      if (collisionInterval) clearInterval(collisionInterval);
      
      // Remove event listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      window.removeEventListener('blur', handleVisibilityChange);
      window.removeEventListener('scroll', handleScroll);
      
      // Clean up any remaining shapes properly
      shapesRef.current.forEach(shape => {
        cleanupShape(shape);
      });
    };
  }, []);

  return (
    <div className="relative bg-black text-white font-[family-name:var(--font-geist-sans)]">
      <SideBar />
      
      {/* Animated Background Shapes - Fixed position for constant presence */}
      <div 
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-0"
      />

      {/* Main Content */}
      <main 
        ref={mainContentRef}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8"
      >
        <div className="text-center w-full flex flex-col items-center">
          <h1 
            ref={titleRef}
            className="text-5xl md:text-8xl font-bold mb-6 tracking-wide w-full text-center"
            style={{ textAlign: 'center' }}
          >
            <span className="block md:inline">
              {"Nathaniel".split("").map((char, index) => (
                <span 
                  key={index} 
                  className="inline-block"
                  data-letter={index}
                >
                  {char}
                </span>
              ))}
            </span>
            <span className="block md:inline md:ml-4">
              {"Go".split("").map((char, index) => (
                <span 
                  key={index + 9} 
                  className="inline-block"
                  data-letter={index + 9}
                >
                  {char}
                </span>
              ))}
            </span>
          </h1>
          <p 
            ref={subtitleRef}
            className="text-lg md:text-2xl text-gray-300 font-light tracking-wide w-full text-center"
            style={{ textAlign: 'center' }}
          >
            {"Come and explore!".split("").map((char, index) => (
              <span 
                key={index} 
                className="inline-block"
                data-letter={index}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </p>
        </div>
      </main>

      {/* About Me Section */}
      <section 
        id="about"
        ref={aboutSectionRef}
        className="relative z-10 min-h-screen flex items-center justify-center p-8"
        style={{ transform: 'translateY(100vh)', opacity: 0 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Profile Picture */}
            <div className="flex justify-center">
              <div 
                ref={profileImageRef}
                className="relative"
              >
                <div className="w-80 h-80 rounded-full overflow-hidden border-8 border-white/20 shadow-2xl">
                  <img 
                    src="/profilepicture.jpg" 
                    alt="Nathaniel Go Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative ring */}
                <div className="absolute -inset-4 rounded-full border-2 border-dashed border-white/30 animate-spin-slow"></div>
              </div>
            </div>

            {/* About Content */}
            <div className="text-left">
              <h2 
                ref={aboutHeadingRef}
                className="text-4xl font-bold mb-6"
              >
                {"About Me".split("").map((char, index) => (
                  <span 
                    key={index} 
                    className="inline-block"
                    data-about-letter={index}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </h2>
              <p 
                ref={aboutTextRef}
                className="text-lg text-white-300 mb-8 leading-relaxed"
              >
                I'm a passionate photographer with over 8 years of experience capturing life's most 
                precious moments. From intimate weddings to dynamic lifestyle shoots, I believe every 
                frame tells a story worth preserving. My approach combines technical expertise with 
                genuine human connection, creating images that resonate long after the moment has passed.
              </p>

              {/* Social Icons */}
              <div 
                ref={socialIconsRef}
                className="flex justify-start gap-6"
              >
                
                {/* Email */}
                <a 
                  href="mailto:hello@netdngo@gmail.com"
                  className="social-icon group relative block"
                  data-social-icon="0"
                >
                  <img 
                    src="/email.png"
                    alt="Email"
                    className="w-16 h-16 rounded-full border-2 border-white/30 hover:border-white transition-all duration-300 hover:scale-110 object-cover bg-white/10"
                  />
                </a>

                {/* Instagram */}
                <a 
                  href="https://instagram.com/NetTheNut"
                  className="social-icon group relative block"
                  data-social-icon="1"
                >
                  <img 
                    src="/instagram.png"
                    alt="Instagram"
                    className="w-16 h-16 rounded-full border-2 border-white/30 hover:border-white transition-all duration-300 hover:scale-110 object-cover"
                  />
                </a>

                {/* LinkedIn */}
                <a 
                  href="https://linkedin.com/in/nathanieldeantogo"
                  className="social-icon group relative block"
                  data-social-icon="2"
                >
                  <img 
                    src="/linkedin.png"
                    alt="LinkedIn"
                    className="w-16 h-16 rounded-full border-2 border-white/30 hover:border-white transition-all duration-300 hover:scale-110 object-cover"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}