"use client";
import { useState, useEffect } from "react";

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState('unknown');
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const updateNetworkStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      // Get connection type if available
      if ('connection' in navigator) {
        const connection = navigator.connection;
        setConnectionType(connection.effectiveType || connection.type || 'unknown');
      }
      
      // Show status for a few seconds when connection changes
      if (!online) {
        setShowStatus(true);
        setTimeout(() => setShowStatus(false), 5000);
      }
    };

    // Listen for online/offline events
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    // Listen for connection changes
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', updateNetworkStatus);
    }
    
    // Initial check
    updateNetworkStatus();

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  // Don't show anything if online and connection is good
  if (isOnline && connectionType !== 'slow-2g' && connectionType !== '2g') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: isOnline ? 'rgba(255, 165, 0, 0.9)' : 'rgba(255, 0, 0, 0.9)',
      color: 'white',
      padding: '10px 15px',
      borderRadius: '5px',
      fontSize: '14px',
      zIndex: 1000,
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontWeight: 'bold',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      opacity: showStatus || !isOnline ? 1 : 0.7,
      transition: 'opacity 0.3s ease'
    }}>
      {!isOnline ? (
        <div>
          <div>⚠️ Offline Mode</div>
          <div style={{ fontSize: '12px', marginTop: '2px' }}>
            Using cached content
          </div>
        </div>
      ) : (
        <div>
          <div>🐌 Slow Connection</div>
          <div style={{ fontSize: '12px', marginTop: '2px' }}>
            {connectionType} - Loading may be slow
          </div>
        </div>
      )}
    </div>
  );
}
