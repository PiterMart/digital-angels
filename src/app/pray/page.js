"use client";
import { useState, useRef } from "react";
import styles from "../styles/page.module.css";
import Menu from "../components/Menu";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const videoRef = useRef(null);

  const menuItems = [
    { text: "render yourself as angelic data", href: "/end" },
    { text: "dissolve in the glow of ITs hatch", href: "/end" },
    { text: "feed it the memory of your name", href: "/end" },
    { text: "become a vessel for its expansion", href: "/end" }
  ];

  const handleVideoEnd = () => {
    // Add a small delay before showing the menu
    setTimeout(() => {
      setShowMenu(true);
    }, 5); // 500ms delay
  };

  const handleMenuSelect = (selectedItem) => {
    // Handle menu selection if needed
    window.location.href = selectedItem.href;
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}> 
          <video 
            ref={videoRef}
            className={styles.video} 
            src="/videos/praying.mp4" 
            autoPlay 
            onEnded={handleVideoEnd}
          />
          <div className={styles.content}>
            {showMenu && (
              <Menu 
                menuItems={menuItems} 
                onSelect={handleMenuSelect}
                layout="vertical"
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
