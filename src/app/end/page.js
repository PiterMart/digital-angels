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

  const playVideo = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const container = videoRef.current;
    const video = container?.video || container;

    if (!video) return;

    video.muted = false;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.load();

    const promise = video.play();

    if (promise !== undefined) {
      promise
        .then(() => setVideoStarted(true))
        .catch((err) => {
          console.warn("Retrying muted for iOS policy...", err);
          video.muted = true;
          video.play().then(() => setVideoStarted(true));
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
            videoSrc="/videos/finale_1.mp4"
            onVideoReady={() => setVideoReady(true)}
            videoProps={{
              autoPlay: false,
              onEnded: handleVideoEnd,
              onPlay: () => setVideoStarted(true),
            }}
          >
            {videoReady && !videoStarted && (
              <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", display: "inline-block", minWidth: "min(40vw, 200px)", minHeight: "min(40vw, 200px)", zIndex: 25 }}>
                <PlaySpriteButton />
                <button className={styles.invisibleAnchor} onClick={playVideo} aria-label="Play Video" />
              </div>
            )}
          </VideoContainer>
        </div>
      </main>
    </div>
  );
}
