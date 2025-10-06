"use client";
import { useState, useRef, useEffect } from "react";
import styles from "../styles/page.module.css";
import NetworkAwareMenu from "../components/NetworkAwareMenu";
import VideoContainer from "../components/VideoContainer";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const videoRef = useRef(null);

  const menuItems = [
    { text: "yes", href: "/transitioning" },
    { text: "no", href: "/fail" }
  ];

  // Detect iOS
  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
  }, []);

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

  const handleVideoPlay = () => {
    setVideoStarted(true);
    console.log("Video started playing");
  };

  const handleVideoError = (e) => {
    console.error("Video error:", e);
    // If video fails to load, show menu after delay
    setTimeout(() => {
      setShowMenu(true);
    }, 1000);
  };

  const startVideo = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
        setVideoStarted(true);
      } catch (error) {
        console.error("Failed to start video:", error);
        // If autoplay fails, show menu
        setTimeout(() => {
          setShowMenu(true);
        }, 1000);
      }
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
              autoPlay: !isIOS, // Disable autoplay on iOS
              onEnded: handleVideoEnd,
              onPlay: handleVideoPlay,
              onError: handleVideoError,
              ref: videoRef
            }}
          >
            <div className={styles.content} style={{marginTop: "30vh"}}>
              {/* Show play button on iOS if video hasn't started */}
              {isIOS && !videoStarted && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 20,
                  textAlign: 'center'
                }}>
                  <button 
                    onClick={startVideo}
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '2px solid #fff',
                      color: '#000',
                      padding: '20px 40px',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontFamily: 'inherit'
                    }}
                  >
                    ▶ Play Video
                  </button>
                </div>
              )}
              
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
