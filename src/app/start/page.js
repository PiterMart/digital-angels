"use client";
import { useState, useRef } from "react";
import styles from "../styles/page.module.css";
import NetworkAwareMenu from "../components/NetworkAwareMenu";
import VideoContainer from "../components/VideoContainer";
import PlaySpriteButton from "../components/PlaySpriteButton";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef(null);

  const menuItems = [
    { text: "yes", href: "/transitioning" },
    { text: "no", href: "/fail" }
  ];

  const handleVideoEnd = () => {
    if (window.showNetworkAwareMenu) {
      window.showNetworkAwareMenu();
    } else {
      setTimeout(() => setShowMenu(true), 500);
    }
  };

  const handleVideoPlay = () => setVideoStarted(true);

  const handleVideoError = () => {
    setTimeout(() => setShowMenu(true), 1000);
  };

  const playVideo = () => {
    const container = videoRef.current;
    const video = container?.video;
    if (!video) return;
    video.muted = false;
    const p = container.play();
    if (p && typeof p.then === "function") {
      p.then(() => setVideoStarted(true)).catch(() => {
        if (video.readyState < 2) {
          video.load();
          video.addEventListener("canplay", () => {
            container.play().then(() => setVideoStarted(true)).catch(() => setTimeout(() => setShowMenu(true), 1000));
          }, { once: true });
        } else {
          setTimeout(() => setShowMenu(true), 1000);
        }
      });
    } else {
      setVideoStarted(true);
    }
  };

  const handleMenuSelect = (selectedItem) => {
    window.location.href = selectedItem.href;
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <VideoContainer
            ref={videoRef}
            videoSrc="/videos/start.mp4"
            videoBlur={!videoStarted}
            onVideoReady={() => setVideoReady(true)}
            videoProps={{
              autoPlay: false,
              onEnded: handleVideoEnd,
              onPlay: handleVideoPlay,
              onError: handleVideoError,
              muted: false,
            }}
          >
            <div className={styles.content} style={{ marginTop: "30vh" }}>
              {videoReady && !videoStarted && <PlaySpriteButton onClick={playVideo} />}
              <NetworkAwareMenu
                menuItems={menuItems}
                onSelect={handleMenuSelect}
                showDelay={500}
              />
            </div>
          </VideoContainer>
        </div>
      </main>
    </div>
  );
}
