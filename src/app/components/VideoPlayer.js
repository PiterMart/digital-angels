"use client";
import { useState, useRef, useEffect } from "react";

// You can use an icon library like react-icons
// import { GoUnmute } from "react-icons/go";

export default function VideoPlayer({ 
  src, 
  onEnded, 
  className, 
  autoPlay = true,
  fallbackDelay = 10000
}) {
  const [hasError, setHasError] = useState(false);
  // ✨ New state to manage the mute button visibility
  const [showUnmuteButton, setShowUnmuteButton] = useState(false);
  const videoRef = useRef(null);
  const fallbackTimeoutRef = useRef(null);

  // This effect now handles the complex play logic
  useEffect(() => {
    const video = videoRef.current;
    if (video && autoPlay) {
      video.muted = false; // Try to play with sound first

      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Autoplay with sound started successfully!
          console.log("Autoplay with sound started!");
        }).catch(error => {
          // Autoplay was prevented.
          console.warn("Autoplay with sound was blocked. Showing unmute button.", error);
          // Show the unmute button and start the video muted.
          setShowUnmuteButton(true);
          video.muted = true;
          video.play();
        });
      }
    }
  }, [src, autoPlay]);
  
  // Fallback timeout logic (mostly unchanged)
  useEffect(() => {
    if (autoPlay && !hasError) {
      fallbackTimeoutRef.current = setTimeout(() => {
        console.log(`Video fallback triggered for ${src}`);
        if (onEnded) onEnded();
      }, fallbackDelay);
    }
    return () => {
      if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current);
    };
  }, [autoPlay, hasError, onEnded, fallbackDelay, src]);

  // ✨ Handler for the user clicking the unmute button
  const handleUnmute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      setShowUnmuteButton(false);
    }
  };

  const handleVideoEnd = () => {
    if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current);
    if (onEnded) onEnded();
  };

  const handleVideoError = (e) => {
    console.error(`Video error for ${src}:`, e);
    setHasError(true);
    if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current);
    setTimeout(() => {
      if (onEnded) onEnded();
    }, 1000);
  };

  if (hasError) {
    // Error display remains the same
    return (
      <div className={className} style={{ backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <div>Video unavailable</div>
      </div>
    );
  }

  return (
    // ✨ Use a container to position the unmute button over the video
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <video 
        ref={videoRef}
        className={className}
        src={src}
        // autoPlay is now handled by the useEffect
        onEnded={handleVideoEnd}
        onError={handleVideoError}
        preload="auto"
        playsInline
        // Video starts muted by default, useEffect will try to unmute it
        muted 
      />
      {/* ✨ The Unmute Button */}
      {showUnmuteButton && (
        <button
          onClick={handleUnmute}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px 30px',
            fontSize: '1.2rem',
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            border: '2px solid white',
            borderRadius: '10px',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          🔊 Tap to Unmute
        </button>
      )}
    </div>
  );
}