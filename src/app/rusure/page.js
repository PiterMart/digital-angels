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
    { text: "idk", href: "/fail" },
    { text: "im sure", href: "/becoming" },
  ];

  const handleVideoEnd = () => setTimeout(() => setShowMenu(true), 500);
  const handleMenuSelect = (selectedItem) => { window.location.href = selectedItem.href; };

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
            videoSrc="/videos/rusure.mp4"
            videoBlur={!videoStarted}
            onVideoReady={() => setVideoReady(true)}
            videoProps={{
              autoPlay: false,
              onEnded: handleVideoEnd,
              onPlay: () => setVideoStarted(true),
            }}
          >
            <div className={styles.content} style={{ marginTop: "30vh" }}>
              {videoReady && !videoStarted && <PlaySpriteButton onClick={playVideo} />}
              {showMenu && (
                <Menu menuItems={menuItems} onSelect={handleMenuSelect} />
              )}
            </div>
          </VideoContainer>
        </div>
      </main>
    </div>
  );
}
