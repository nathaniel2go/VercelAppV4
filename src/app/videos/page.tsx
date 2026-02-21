"use client";
import React, { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import SideBar from "../sidebar";
import { videoEntries } from "@/data/videoPortfolio";

export default function VideosPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [imageDimensions, setImageDimensions] = React.useState<{
    [key: string]: { width: number; height: number };
  }>({});
  const router = useRouter();

  const stopAllPreviews = useCallback(() => {
    videoRefs.current.forEach((preview) => {
      if (!preview) return;
      preview.pause();
      preview.currentTime = 0;
      preview.removeAttribute("src");
      preview.load();
    });
  }, []);

  useEffect(() => {
    let loadedCount = 0;
    videoEntries.forEach((video) => {
      const img = new Image();
      img.onload = () => {
        setImageDimensions((prev) => ({
          ...prev,
          [video.id]: { width: img.width, height: img.height },
        }));
        loadedCount++;

        if (loadedCount === videoEntries.length) {
          setTimeout(() => {
            gsap.fromTo(
              cardsRef.current,
              {
                opacity: 0,
                y: 30,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
              }
            );
          }, 100);
        }
      };
      img.src = video.thumbnail;
    });
  }, []);

  const handleCardClick = (videoId: string) => {
    stopAllPreviews();
    router.push(`/videos/${videoId}`);
  };

  const handleCardHover = (index: number, isHover: boolean) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const previewVideo = videoRefs.current[index];
    if (previewVideo) {
      if (isHover) {
        previewVideo.currentTime = 0;
        previewVideo.muted = true;
        previewVideo.play().catch(() => {});
        gsap.to(previewVideo, {
          opacity: 1,
          duration: 0.25,
          ease: "power1.out",
        });
      } else {
        gsap.to(previewVideo, {
          opacity: 0,
          duration: 0.25,
          ease: "power1.out",
          onComplete: () => {
            previewVideo.pause();
            previewVideo.currentTime = 0;
          },
        });
      }
    }

    gsap.to(card, {
      scale: isHover ? 1.02 : 1,
      duration: 0.2,
      ease: "power1.out",
    });
  };

  useEffect(() => {
    return () => {
      stopAllPreviews();
    };
  }, [stopAllPreviews]);

  return (
    <div className="min-h-screen bg-black text-white">
      <SideBar />
      <main className="w-full px-10 md:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Video Portfolio</h2>
            <p className="text-white/60">
              
            </p>
          </div>

          <div ref={containerRef} className="columns-1 md:columns-3 gap-6 space-y-6">
            {videoEntries.map((video, index) => {
              const dimensions = imageDimensions[video.id];
              let cardHeight = 300;

              if (dimensions) {
                const standardWidth = 400;
                const aspectRatio = dimensions.height / dimensions.width;
                cardHeight = Math.round(standardWidth * aspectRatio);
                cardHeight = Math.max(200, Math.min(800, cardHeight));
              }

              return (
                <div
                  key={video.id}
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  className="break-inside-avoid rounded-xl overflow-hidden shadow-lg cursor-pointer mb-6 relative"
                  style={{
                    height: `${cardHeight}px`,
                  }}
                  onClick={() => handleCardClick(video.id)}
                  onMouseEnter={() => handleCardHover(index, true)}
                  onMouseLeave={() => handleCardHover(index, false)}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    src={video.videoSrc}
                    poster={video.thumbnail}
                    preload="none"
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
                    aria-hidden="true"
                  />

                  <div className="absolute inset-0 bg-black/10" aria-hidden="true" />

                  <div
                    style={{
                      position: "absolute",
                      top: "16px",
                      left: "16px",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "20px",
                      margin: 0,
                      zIndex: 100,
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    {video.title}
                  </div>

                  {video.description && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "16px",
                        left: "16px",
                        right: "16px",
                        color: "white",
                        fontSize: "14px",
                        zIndex: 100,
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                      }}
                    >
                      {video.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <footer className="w-full py-8 px-10 md:px-8 border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/60">&copy; {new Date().getFullYear()} Video Portfolio</p>
        </div>
      </footer>
    </div>
  );
}
