"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/page.module.css";

export default function Home() {
  const videoRef = useRef(null);
  const router = useRouter();

  const handleVideoEnd = () => {
    // Add a small delay before redirecting to credits
    setTimeout(() => {
      router.push('/credits');
    }, 1000); // 1 second delay
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}> 
          <video 
            ref={videoRef}
            className={styles.video} 
            src="/videos/finale.mp4" 
            autoPlay 
            onEnded={handleVideoEnd}
          />
        </div>
      </main>
    </div>
  );
}
