"use client";
import { useState, useRef } from "react";
import styles from "../styles/page.module.css";
import Menu from "../components/Menu";
import VideoContainer from "../components/VideoContainer";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const videoRef = useRef(null);

  const menuItems = [
    { text: " sounds amazing!", href: "/rusure" },
    { text: "can i leave? :c", href: "/fail" }
  ];

  const handleVideoEnd = () => {
    // Add a delay before showing the menu to ensure proper rendering
    setTimeout(() => {
      setShowMenu(true);
    }, 500); // 500ms delay for better reliability
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
            videoSrc="/videos/Yes_1.mp4"
            videoProps={{ 
              autoPlay: true, 
              onEnded: handleVideoEnd,
              ref: videoRef
            }}
          >
            <div className={styles.content} style={{marginTop: "-35vh"}}>
              {showMenu && (
                <Menu 
                  menuItems={menuItems} 
                  onSelect={handleMenuSelect}
                  layout="top"
                />
              )}
            </div>
          </VideoContainer>
        </div>
      </main>
    </div>
  );
}
