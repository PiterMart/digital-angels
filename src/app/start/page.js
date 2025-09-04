"use client";
import { useState, useRef } from "react";
import styles from "../styles/page.module.css";
import NetworkAwareMenu from "../components/NetworkAwareMenu";
import VideoPlayer from "../components/VideoPlayer";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const videoRef = useRef(null);

  const menuItems = [
    { text: "yes", href: "/transitioning" },
    { text: "no", href: "/fail" }
  ];

  const handleVideoEnd = () => {
    // Trigger the network-aware menu display
    if (window.showNetworkAwareMenu) {
      window.showNetworkAwareMenu();
    } else {
      // Fallback to simple delay
      setTimeout(() => {
        setShowMenu(true);
      }, 500);
    }
  };

  const handleMenuSelect = (selectedItem) => {
    // Handle menu selection if needed
    window.location.href = selectedItem.href;
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}> 
          <VideoPlayer 
            ref={videoRef}
            className={styles.video} 
            src="/videos/start.mp4" 
            autoPlay 
            onEnded={handleVideoEnd}
            fallbackDelay={15000} // 15 seconds fallback for this video
          />
          <div className={styles.content}>
            <NetworkAwareMenu 
              menuItems={menuItems} 
              onSelect={handleMenuSelect}
              showDelay={500}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
