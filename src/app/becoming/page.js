"use client";
import { useState, useRef } from "react";
import styles from "../styles/page.module.css";
import Menu from "../components/Menu";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const videoRef = useRef(null);

  const menuItems = [
    { text: "nvm", href: "/fail" },
    { text: "i want wings", href: "/wings" }
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
            src="/videos/becoming a dig_1.mp4" 
            autoPlay 
            onEnded={handleVideoEnd}
          />
          <div className={styles.content}>
            {showMenu && (
              <Menu 
                menuItems={menuItems} 
                onSelect={handleMenuSelect}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
