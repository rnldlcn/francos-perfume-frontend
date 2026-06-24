import { useEffect, useState } from 'react';

export const useClock = () => {
    const [currentDateTime, setCurrentDateTime] = useState('');

    useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString('en-US', { 
        weekday: 'short', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return currentDateTime;
}