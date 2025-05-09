import React, { useState, useEffect } from 'react';

const Typewriter = ({ text, speed = 50, repeatDelay = 2000 }) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let interval;
    let cursorInterval;

    const type = () => {
      interval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.substring(0, index + 1));
          setIndex((prev) => prev + 1);
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setDisplayText('');
            setIndex(0);
          }, repeatDelay);
        }
      }, speed);
    };

    type();

    cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(cursorInterval);
    };
  }, [index, text, speed, repeatDelay]);

  return (
    <span>
      {displayText}
      {showCursor ? '|' : ''}
    </span>
  );
};

export default Typewriter;