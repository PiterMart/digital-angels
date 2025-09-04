"use client";
import { useState, useEffect } from "react";
import Menu from "./Menu";

export default function NetworkAwareMenu({ 
  menuItems, 
  onSelect, 
  layout = "default", 
  defaultSelectedIndex = 0,
  showDelay = 500 
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    // Check online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initial check
    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const showMenuWithRetry = () => {
    if (showMenu) return; // Already showing

    const attemptShow = (attempt = 1) => {
      console.log(`Attempting to show menu (attempt ${attempt})`);
      
      // Force a re-render by using requestAnimationFrame
      requestAnimationFrame(() => {
        setShowMenu(true);
        
        // If menu doesn't appear after a delay, retry
        setTimeout(() => {
          const menuElement = document.querySelector('.menuVisible');
          if (!menuElement && attempt < maxRetries) {
            console.log(`Menu not visible, retrying... (${attempt}/${maxRetries})`);
            setShowMenu(false);
            setRetryCount(attempt);
            setTimeout(() => attemptShow(attempt + 1), 200);
          } else if (attempt >= maxRetries) {
            console.log('Max retries reached, forcing menu display');
            setShowMenu(true);
          }
        }, 100);
      });
    };

    // Initial delay before showing menu
    setTimeout(() => {
      attemptShow();
    }, showDelay);
  };

  // Expose the show function for external use
  useEffect(() => {
    // This allows parent components to trigger menu display
    window.showNetworkAwareMenu = showMenuWithRetry;
    
    return () => {
      delete window.showNetworkAwareMenu;
    };
  }, [showMenu]);

  return (
    <div>
      {showMenu && (
        <Menu 
          menuItems={menuItems} 
          onSelect={onSelect}
          layout={layout}
          defaultSelectedIndex={defaultSelectedIndex}
        />
      )}
      {!isOnline && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'rgba(255, 0, 0, 0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '14px',
          zIndex: 1000
        }}>
          Offline Mode
        </div>
      )}
    </div>
  );
}

