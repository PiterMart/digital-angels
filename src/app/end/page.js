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
    const container = videoRef.current;
    const video = container?.video;
    if (!video) return;
    video.setAttribute("playsinline", "true");
    video.muted = false;
    const promise = video.play();
    if (promise !== undefined) {
      promise
        .then(() => setVideoStarted(true))
        .catch((error) => {
          console.error("Error en iOS Play:", error);
          video.muted = true;
          video.play().then(() => setVideoStarted(true)).catch(() => setTimeout(() => router.push("/credits"), 1000));
        });
    } else {
      setVideoStarted(true);
    }
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
