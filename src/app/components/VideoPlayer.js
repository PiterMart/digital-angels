"use client";
import { useState, useRef, useEffect } from "react";

export default function VideoPlayer({ 
  src, 
  onEnded, 
  className, 
  autoPlay = true,
  fallbackDelay = 10000 // 10 seconds fallback if video doesn't end
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);
  const fallbackTimeoutRef = useRef(null);

  useEffect(() => {
    // Set up fallback timeout in case video doesn't end properly
    if (autoPlay && !hasError) {
      fallbackTimeoutRef.current = setTimeout(() => {
        console.log(`Video fallback triggered for ${src}`);
        if (onEnded) {
          onEnded();
        }
      }, fallbackDelay);
    }

    return () => {
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
      }
    };
  }, [autoPlay, hasError, onEnded, fallbackDelay, src]);

  const handleVideoEnd = () => {
    // Clear the fallback timeout since video ended normally
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
    }
    
    if (onEnded) {
      onEnded();
    }
  };

  const handleVideoError = (e) => {
    console.error(`Video error for ${src}:`, e);
    setHasError(true);
    
    // Clear fallback timeout and trigger onEnded immediately
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
    }
    
    // Trigger onEnded after a short delay to allow menu to show
    setTimeout(() => {
      if (onEnded) {
        onEnded();
      }
    }, 1000);
  };

  const handleVideoLoad = () => {
    setIsLoaded(true);
    console.log(`Video loaded successfully: ${src}`);
  };

  const handleVideoCanPlay = () => {
    console.log(`Video can play: ${src}`);
  };

  if (hasError) {
    return (
      <div className={className} style={{ 
        backgroundColor: '#000', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#fff',
        fontSize: '1.5rem'
      }}>
        Video unavailable - continuing...
      </div>
    );
  }

  return (
    <video 
      ref={videoRef}
      className={className}
      src={src}
      autoPlay={autoPlay}
      onEnded={handleVideoEnd}
      onError={handleVideoError}
      onLoadedData={handleVideoLoad}
      onCanPlay={handleVideoCanPlay}
      preload="auto"
      playsInline
      muted={false}
    />
  );
}
