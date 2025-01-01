import { useState, useEffect } from 'react';

function CountdownTimer({ minutes  , text }) {
  const [time, setTime] = useState(minutes * 60); // Convert minutes to seconds
  const [displayTime, setDisplayTime] = useState(formatTime(time));

  useEffect(() => {
    const timerID = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timerID);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []); // Empty dependency array to run effect only once on mount

  useEffect(() => {
    setDisplayTime(formatTime(time));
  }, [time]);

  return (
    <div dir='rtl'>
      <h1>{text}</h1>
      <p>{displayTime}</p>
    </div>
  );
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default CountdownTimer;