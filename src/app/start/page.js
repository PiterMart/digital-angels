"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import styles from "../styles/page.module.css";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const videoRef = useRef(null);

  const handleVideoEnd = () => {
    // Add a small delay before showing the menu
    setTimeout(() => {
      setShowMenu(true);
    }, 500); // 500ms delay
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}> 
          <video 
            ref={videoRef}
            className={styles.video} 
            src="/videos/start.mp4" 
            autoPlay 
            muted 
            onEnded={handleVideoEnd}
          />
          <div className={styles.content}>
            <div className={`${styles.menu} ${showMenu ? styles.menuVisible : ''}`}>
              <a href="/start">Yes</a>
              <a href="/start">No</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
