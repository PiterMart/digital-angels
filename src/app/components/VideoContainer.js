"use client";
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState, useImperativeHandle } from "react";
import styles from "../styles/VideoContainer.module.css";

const VideoContainer = forwardRef(({ 
  children, 
  videoSrc, 
  videoProps = {}, 
  className = "",
  intrinsicWidth,
  intrinsicHeight,
  onVideoReady,
}, ref) => {
  const internalVideoRef = useRef(null);
  const onVideoReadyRef = useRef(onVideoReady);
  onVideoReadyRef.current = onVideoReady;
  
  useImperativeHandle(ref, () => ({
    get video() {
      return internalVideoRef.current;
    },
    play() {
      const v = internalVideoRef.current;
      return v ? v.play() : Promise.reject(new Error("No video"));
    },
  }), []);
  const [naturalSize, setNaturalSize] = useState({ width: intrinsicWidth || 1080, height: intrinsicHeight || 1920 });
  const [renderSize, setRenderSize] = useState({ width: 0, height: 0 });

  const computeFittedSize = useCallback((videoW, videoH, maxW, maxH) => {
    if (!videoW || !videoH || !maxW || !maxH) return { width: 0, height: 0 };
    // Scale to the largest size that fits in the viewport without upscaling
    const scale = Math.min(1, maxW / videoW, maxH / videoH);
    return { width: Math.floor(videoW * scale), height: Math.floor(videoH * scale) };
  }, []);

  const updateSize = useCallback(() => {
    const maxW = typeof window !== "undefined" ? window.innerWidth : 0;
    const maxH = typeof window !== "undefined" ? window.innerHeight : 0;
    setRenderSize(computeFittedSize(naturalSize.width, naturalSize.height, maxW, maxH));
  }, [computeFittedSize, naturalSize.height, naturalSize.width]);

  // Capture intrinsic video size as soon as metadata is available
  const handleLoadedMetadata = useCallback((e) => {
    const el = e?.target;
    const videoW = el?.videoWidth;
    const videoH = el?.videoHeight;
    if (videoW && videoH) {
      setNaturalSize({ width: videoW, height: videoH });
    }
  }, []);

  // Recompute size whenever intrinsic or viewport changes
  useEffect(() => {
    updateSize();
  }, [naturalSize.width, naturalSize.height, updateSize]);

  useEffect(() => {
    function onResize() { updateSize(); }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updateSize]);

  const containerStyle = useMemo(() => {
    if (renderSize.width && renderSize.height) {
      return {
        width: `${renderSize.width}px`,
        height: `${renderSize.height}px`
      };
    }
    // Fallback before metadata: use current naturalSize to provide a stable box
    const w = naturalSize.width || 16;
    const h = naturalSize.height || 9;
    const ratio = w / h;
    return {
      aspectRatio: `${w} / ${h}`,
      width: `min(100vw, calc(100vh * ${ratio}))`
    };
  }, [naturalSize.height, naturalSize.width, renderSize.height, renderSize.width]);

  return (
    <div className={`${styles.videoContainer} ${className}`} style={containerStyle}>
      <video
        ref={(el) => {
          internalVideoRef.current = el;
          if (el && onVideoReadyRef.current) onVideoReadyRef.current(el);
        }}
        className={styles.video}
        src={videoSrc}
        onLoadedMetadata={handleLoadedMetadata}
        playsInline
        preload="auto"
        suppressHydrationWarning
        {...videoProps}
      />
      <div className={styles.uiOverlay}>
        {children}
      </div>
    </div>
  );
});

VideoContainer.displayName = "VideoContainer";

export default VideoContainer;

