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

  const playVideo = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const container = videoRef.current;
    const video = container?.video || container;

    if (!video) return;

    setVideoStarted(true);

    video.muted = false;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.load();

    const promise = video.play();

    if (promise !== undefined) {
      promise.catch((err) => {
        console.warn("Retrying muted for iOS policy...", err);
        video.muted = true;
        video.play();
      });
    }
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
              {videoReady && !videoStarted && (
                <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", display: "inline-block", minWidth: "min(40vw, 200px)", minHeight: "min(40vw, 200px)", zIndex: 25 }}>
                  <PlaySpriteButton />
                  <button className={styles.invisibleAnchor} onClick={playVideo} aria-label="Play Video" />
                </div>
              )}
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
