"use client";
import { useEffect, useRef } from "react";
import type { VideoEntry } from "@/data/videoPortfolio";

export interface VideoPlayerClientProps {
  video: VideoEntry;
}

export default function VideoPlayerClient({ video }: VideoPlayerClientProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const didRetryRef = useRef(false);

  useEffect(() => {
    const current = videoRef.current;
    return () => {
      if (current) {
        current.pause();
      }
    };
  }, []);

  useEffect(() => {
    didRetryRef.current = false;
  }, [video.id]);

  const handleRecover = () => {
    const node = videoRef.current;
    if (!node || didRetryRef.current) return;
    didRetryRef.current = true;
    node.load();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 relative">
      <div className="text-center space-y-4">
        <p className="text-white/60 uppercase tracking-[0.4em] text-xs">
          Video Portfolio
        </p>
        <h1 className="text-3xl md:text-5xl font-bold">{video.title}</h1>
        {video.description && (
          <p className="text-white/60 max-w-3xl mx-auto">
            {video.description}
          </p>
        )}
      </div>

      <div className="relative bg-black border border-white/10 rounded-3xl shadow-2xl">
        <video
          key={video.id}
          ref={videoRef}
          src={video.videoSrc}
          poster={video.thumbnail}
          controls
          preload="auto"
          playsInline
          onStalled={handleRecover}
          onSuspend={handleRecover}
          onError={handleRecover}
          className="w-full rounded-3xl object-cover max-h-[70vh]"
        />
      </div>
    </div>
  );
}
