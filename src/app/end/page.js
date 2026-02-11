"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/page.module.css";
import VideoContainer from "../components/VideoContainer";
import PlaySpriteButton from "../components/PlaySpriteButton";

export default function Home() {
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef(null);
  const router = useRouter();

  const handleVideoEnd = () => {
    setTimeout(() => router.push('/credits'), 1000);
  };

  const playVideo = () => {
    if (!videoRef.current) return;
    const p = videoRef.current.play();
    if (p?.then) p.then(() => setVideoStarted(true)).catch(() => {});
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <VideoContainer
            ref={videoRef}
            videoSrc="/videos/finale.mp4"
            videoBlur={!videoStarted}
            onVideoReady={() => setVideoReady(true)}
            videoProps={{
              autoPlay: false,
              onEnded: handleVideoEnd,
              onPlay: () => setVideoStarted(true),
            }}
          >
            {videoReady && !videoStarted && <PlaySpriteButton onClick={playVideo} />}
          </VideoContainer>
        </div>
      </main>
    </div>
  );
}
