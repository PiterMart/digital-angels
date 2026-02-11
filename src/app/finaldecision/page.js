"use client";
import { useState, useRef } from "react";
import styles from "../styles/page.module.css";
import Menu from "../components/Menu";
import VideoContainer from "../components/VideoContainer";
import PlaySpriteButton from "../components/PlaySpriteButton";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [isPlayingBreakingVideo, setIsPlayingBreakingVideo] = useState(false);
  const [isPlayingPrayingVideo, setIsPlayingPrayingVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef(null);

  const menuItems = [
    { text: "pray", href: "/pray" },
    { text: "break it", href: "/eggbreak" }
  ];

  const handleVideoEnd = () => {
    setTimeout(() => setShowMenu(true), 500);
  };

  const handleBreakingVideoEnd = () => {
    window.location.href = "/eggbreak";
  };

  const handlePrayingVideoEnd = () => {
    window.location.href = "/pray";
  };

  const handleMenuSelect = (selectedItem) => {
    const container = videoRef.current;
    const video = container?.video;
    if (selectedItem.text === "break it") {
      setShowMenu(false);
      setIsPlayingBreakingVideo(true);
      if (video) {
        video.src = "/videos/breaking egg.mp4";
        video.load();
        container.play().then(() => {}).catch(() => {});
      }
    } else if (selectedItem.text === "pray") {
      setShowMenu(false);
      setIsPlayingPrayingVideo(true);
      if (video) {
        video.src = "/videos/va a rezar_1.mp4";
        video.load();
        container.play().then(() => {}).catch(() => {});
      }
    } else {
      window.location.href = selectedItem.href;
    }
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
            videoSrc="/videos/camina hacia el huevo_1.mp4"
            videoBlur={!videoStarted}
            onVideoReady={() => setVideoReady(true)}
            videoProps={{
              autoPlay: false,
              onEnded: isPlayingBreakingVideo ? handleBreakingVideoEnd : isPlayingPrayingVideo ? handlePrayingVideoEnd : handleVideoEnd,
              onPlay: () => setVideoStarted(true),
            }}
          >
            <div className={styles.content} style={{ marginTop: "30vh", fontWeight: "bold" }}>
              {videoReady && !videoStarted && <PlaySpriteButton onClick={playVideo} />}
              {showMenu && (
                <Menu
                  menuItems={menuItems}
                  onSelect={handleMenuSelect}
                  layout="egg"
                />
              )}
            </div>
          </VideoContainer>
        </div>
      </main>
    </div>
  );
}
