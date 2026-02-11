"use client";
import { useState, useRef } from "react";
import styles from "../styles/page.module.css";
import Menu from "../components/Menu";
import VideoContainer from "../components/VideoContainer";
import PlaySpriteButton from "../components/PlaySpriteButton";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const videoRef = useRef(null);

  const menuItems = [
    { text: "nvm", href: "/fail" },
    { text: "i want wings", href: "/wings" }
  ];

  const handleVideoEnd = () => setTimeout(() => setShowMenu(true), 500);
  const handleMenuSelect = (selectedItem) => { window.location.href = selectedItem.href; };

  const playVideo = async () => {
    if (!videoRef.current) return;
    try {
      await videoRef.current.play();
      setVideoStarted(true);
    } catch {}
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <VideoContainer
            ref={videoRef}
            videoSrc="/videos/becoming a dig_1.mp4"
            videoBlur={!videoStarted}
            videoProps={{
              autoPlay: false,
              onEnded: handleVideoEnd,
              onPlay: () => setVideoStarted(true),
            }}
          >
            <div className={styles.content} style={{ marginTop: "-20vh" }}>
              {!videoStarted && <PlaySpriteButton onClick={playVideo} />}
              {showMenu && (
                <Menu
                  menuItems={menuItems}
                  onSelect={handleMenuSelect}
                  defaultSelectedIndex={1}
                />
              )}
            </div>
          </VideoContainer>
        </div>
      </main>
    </div>
  );
}
