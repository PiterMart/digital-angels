"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/page.module.css";
import VideoContainer from "../components/VideoContainer";

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
          <VideoContainer 
            videoSrc="/videos/finale.mp4"
            videoProps={{ 
              autoPlay: true, 
              onEnded: handleVideoEnd,
              ref: videoRef
            }}
          />
        </div>
      </main>
    </div>
  );
}
