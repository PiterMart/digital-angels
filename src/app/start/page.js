"use client";
import { useState, useRef } from "react";
import styles from "../styles/page.module.css";
import NetworkAwareMenu from "../components/NetworkAwareMenu";
import VideoContainer from "../components/VideoContainer";

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
          <VideoContainer 
            videoSrc="/videos/start.mp4"
            videoProps={{ 
              autoPlay: true, 
              onEnded: handleVideoEnd,
              ref: videoRef
            }}
          >
            <div className={styles.content}>
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
