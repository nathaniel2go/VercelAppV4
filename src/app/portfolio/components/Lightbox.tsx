import React, { useEffect } from "react";

interface LightboxProps {
  isOpen: boolean;
  images: Array<{
    id: number;
    title: string;
    description: string;
    [key: string]: any;
  }>;
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  categoryKey: string; // Key to access the category/type field (e.g., 'sport', 'eventType', 'category')
}

export default function Lightbox({ 
  isOpen, 
  images, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrev, 
  categoryKey 
}: LightboxProps) {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrev();
          break;
        case 'ArrowRight':
          onNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || !images[currentIndex]) return null;

  const currentImage = images[currentIndex];
  const randomSeed = currentIndex + Math.abs(currentImage.id * 10);

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 text-2xl w-10 h-10 flex items-center justify-center bg-black/50 rounded-full transition-colors"
        >
          ×
        </button>

        {/* Previous button */}
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 text-2xl w-12 h-12 flex items-center justify-center bg-black/50 rounded-full transition-colors"
        >
          ‹
        </button>

        {/* Next button */}
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 text-2xl w-12 h-12 flex items-center justify-center bg-black/50 rounded-full transition-colors"
        >
          ›
        </button>

        {/* Main image */}
        <div className="flex flex-col items-center justify-center w-full h-full">
          <img
            src={`https://picsum.photos/800/600?random=${randomSeed}`}
            alt={currentImage.title}
            className="max-w-full max-h-[70vh] object-contain"
          />
          
          {/* Image info */}
          <div className="mt-4 text-center text-white">
            <h3 className="text-xl font-semibold mb-2">{currentImage.title}</h3>
            <p className="text-gray-300 mb-2">{currentImage.description}</p>
            <span className="inline-block px-3 py-1 bg-white/20 rounded text-sm">
              {currentImage[categoryKey]}
            </span>
            <p className="text-sm text-gray-400 mt-2">
              {currentIndex + 1} of {images.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
