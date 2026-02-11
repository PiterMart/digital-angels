"use client";
import { useState, useRef } from "react";
import styles from "../styles/page.module.css";
import Menu from "../components/Menu";
import VideoContainer from "../components/VideoContainer";
import PlaySpriteButton from "../components/PlaySpriteButton";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef(null);

  const menuItems = [
    { text: "render yourself as angelic data", href: "/end" },
    { text: "dissolve in the glow of its hatch", href: "/end" },
    { text: "feed it the memory of your name", href: "/end" },
    { text: "become a vessel for its expansion", href: "/end" }
  ];

  const handleVideoEnd = () => setTimeout(() => setShowMenu(true), 500);
  const handleMenuSelect = (selectedItem) => { window.location.href = selectedItem.href; };

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
          video.play().then(() => setVideoStarted(true)).catch(() => setTimeout(() => setShowMenu(true), 1000));
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
            videoSrc="/videos/praying.mp4"
            videoBlur={!videoStarted}
            onVideoReady={() => setVideoReady(true)}
            videoProps={{
              autoPlay: false,
              onEnded: handleVideoEnd,
              onPlay: () => setVideoStarted(true),
            }}
          >
            <div className={styles.content}>
              {videoReady && !videoStarted && <PlaySpriteButton onClick={playVideo} />}
              {showMenu && (
                <Menu
                  menuItems={menuItems}
                  onSelect={handleMenuSelect}
                  layout="vertical"
                />
              )}
            </div>
          </VideoContainer>
        </div>
      </main>
    </div>
  );
}
