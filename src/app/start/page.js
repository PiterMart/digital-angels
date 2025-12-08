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
    console.log("iOS detection:", isIOSDevice);
    console.log("User agent:", navigator.userAgent);
    console.log("Platform:", navigator.platform);
    console.log("Max touch points:", navigator.maxTouchPoints);
    setIsIOS(isIOSDevice);
  }, []);

  // Debug video ref changes
  useEffect(() => {
    console.log("Video ref changed:", videoRef.current);
    if (videoRef.current) {
      console.log("Video element found:", videoRef.current.tagName);
      console.log("Video src:", videoRef.current.src);
    }
  }, [videoRef.current]);

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

  const handleVideoLoaded = () => {
    console.log("Video loaded successfully");
  };

  const handleVideoCanPlay = () => {
    console.log("Video can play");
  };

  const startVideo = async () => {
    console.log("Play button clicked");
    console.log("Video ref:", videoRef.current);
    console.log("Video ref type:", typeof videoRef.current);
    console.log("Video ref readyState:", videoRef.current?.readyState);
    console.log("Video ref paused:", videoRef.current?.paused);
    console.log("Video ref src:", videoRef.current?.src);
    
    if (videoRef.current) {
      try {
        // Ensure video is muted for iOS compatibility
        videoRef.current.muted = false;
        console.log("Video muted set to:", videoRef.current.muted);
        
        // Check if video is ready to play
        if (videoRef.current.readyState >= 2) { // HAVE_CURRENT_DATA
          console.log("Video is ready, attempting to play...");
          await videoRef.current.play();
          console.log("Video play successful");
          setVideoStarted(true);
        } else {
          console.log("Video not ready, waiting for canplay event...");
          // Wait for video to be ready
          videoRef.current.addEventListener('canplay', async () => {
            try {
              console.log("Canplay event fired, attempting to play...");
              await videoRef.current.play();
              console.log("Video play successful after canplay");
              setVideoStarted(true);
            } catch (playError) {
              console.error("Failed to play after canplay:", playError);
              setTimeout(() => setShowMenu(true), 1000);
            }
          }, { once: true });
          
          // Load the video if it hasn't been loaded yet
          console.log("Loading video...");
          videoRef.current.load();
        }
      } catch (error) {
        console.error("Failed to start video:", error);
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
        // If autoplay fails, show menu
        setTimeout(() => {
          setShowMenu(true);
        }, 1000);
      }
    } else {
      console.error("Video ref is null");
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
            ref={videoRef}
            videoSrc="/videos/start.mp4"
            videoProps={{ 
              autoPlay: !isIOS, // Disable autoplay on iOS
              onEnded: handleVideoEnd,
              onPlay: handleVideoPlay,
              onError: handleVideoError,
              onLoadedData: handleVideoLoaded,
              onCanPlay: handleVideoCanPlay,
              muted: false // Video should play with sound
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
              
              {/* Debug info */}
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '10px',
                fontSize: '12px',
                zIndex: 30
              }}>
                iOS: {isIOS ? 'Yes' : 'No'}<br/>
                Video Started: {videoStarted ? 'Yes' : 'No'}<br/>
                Video Ref: {videoRef.current ? 'Exists' : 'Null'}
              </div>
              
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
