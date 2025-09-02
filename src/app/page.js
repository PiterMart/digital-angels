"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./styles/page.module.css";
import Menu from "./components/Menu";

export default function Home() {
  const [showMenu, setShowMenu] = useState(true);
  const audioRef = useRef(null);

  const menuItems = [
    { text: "Start", href: "/start" }
  ];

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
          <video className={styles.video} src="/videos/introDA.mp4" autoPlay loop muted />
          <div className={styles.content}>
            {showMenu && (
              <Menu 
                menuItems={menuItems} 
                onSelect={handleMenuSelect}
                layout="centered"
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
