"use client";
import { useState, useRef } from "react";
import styles from "../styles/page.module.css";
import Menu from "../components/Menu";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [isPlayingBreakingVideo, setIsPlayingBreakingVideo] = useState(false);
  const [isPlayingPrayingVideo, setIsPlayingPrayingVideo] = useState(false);
  const videoRef = useRef(null);

  const menuItems = [
    { text: "pray", href: "/pray" },
    { text: "break it", href: "/eggbreak" }
  ];

  const handleVideoEnd = () => {
    // Add a small delay before showing the menu
    setTimeout(() => {
      setShowMenu(true);
    }, 5); // 500ms delay
  };

  const handleBreakingVideoEnd = () => {
    // Navigate to eggbreak page after breaking video ends
    window.location.href = "/eggbreak";
  };

  const handlePrayingVideoEnd = () => {
    // Navigate to pray page after praying video ends
    window.location.href = "/pray";
  };

  const handleMenuSelect = (selectedItem) => {
    if (selectedItem.text === "break it") {
      // Hide menu and play breaking egg video
      setShowMenu(false);
      setIsPlayingBreakingVideo(true);
      // Change video source to breaking egg video
      if (videoRef.current) {
        videoRef.current.src = "/videos/breaking egg.mp4";
        videoRef.current.load();
        videoRef.current.play();
      }
    } else if (selectedItem.text === "pray") {
      // Hide menu and play praying video
      setShowMenu(false);
      setIsPlayingPrayingVideo(true);
      // Change video source to praying video
      if (videoRef.current) {
        videoRef.current.src = "/videos/va a rezar_1.mp4";
        videoRef.current.load();
        videoRef.current.play();
      }
    } else {
      // For other selections, navigate directly
      window.location.href = selectedItem.href;
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}> 
          <video 
            ref={videoRef}
            className={styles.video} 
            src="/videos/camina hacia el huevo_1.mp4" 
            autoPlay 
            onEnded={isPlayingBreakingVideo ? handleBreakingVideoEnd : isPlayingPrayingVideo ? handlePrayingVideoEnd : handleVideoEnd}
          />
          <div className={styles.content}>
            {showMenu && (
              <Menu 
                menuItems={menuItems} 
                onSelect={handleMenuSelect}
                layout="egg"
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
