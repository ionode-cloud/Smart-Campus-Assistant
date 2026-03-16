import React, { useState, useEffect } from 'react';
import offlineImage from '../assets/v7.png';

const OfflineStatus = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-white flex items-center justify-center overflow-hidden">
      <img 
        src={offlineImage} 
        alt="Offline" 
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default OfflineStatus;
