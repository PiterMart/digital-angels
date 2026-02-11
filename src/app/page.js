"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./styles/page.module.css";
import Menu from "./components/Menu";
import VideoContainer from "./components/VideoContainer";

export default function Home() {
  const [showMenu, setShowMenu] = useState(true);
  const [isIOS, setIsIOS] = useState(false);
  const audioRef = useRef(null);

  const menuItems = [
    { text: "contact angel", href: "/start" }
  ];

  // Detect iOS
  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
  }, []);

  useEffect(() => {
    // Start playing background music when component mounts
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(error => {
        console.log("Autoplay prevented:", error);
        // Autoplay might be prevented by browser, user can manually start
      });
    }
  }, []);

  const handleMenuSelect = (selectedItem) => {
    // Handle menu selection if needed
    window.location.href = selectedItem.href;
  };

  return (
    <div className={styles.page}>
      <audio 
        ref={audioRef}
        src="/DIGITALANGELSTRACK.mp3"
        loop
        autoPlay
        preload="auto"
      />
      <main className={styles.main}>
        <div className={styles.container}>  
          <VideoContainer 
            videoSrc="/videos/introDA_1.mp4"
            videoProps={{ autoPlay: !isIOS, loop: true, muted: true }}
          >
            <div className={styles.content}>
              {showMenu && (
                <Menu 
                  menuItems={menuItems} 
                  onSelect={handleMenuSelect}
                  layout="centered"
                />
              )}
            </div>
          </VideoContainer>
        </div>
      </main>
    </div>
  );
}
