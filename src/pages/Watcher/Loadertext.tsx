import React, { useState, useEffect } from 'react';

const AnimatedText = ({ phrases }) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true); // State for blinking

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 3000); // Change phrase every 3 seconds (slowed down)

    return () => clearInterval(intervalId);
  }, [phrases]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsVisible((prevVisible) => !prevVisible);
    }, 1000); // Blink every 0.5 seconds

    return () => clearInterval(blinkInterval);
  }, []); // Empty dependency array ensures this runs only once

  return (
    <span className={`animate-text ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      {phrases[currentPhraseIndex]}
    </span>
  );
};

const Loader = () => {
  const loadingPhrases = [
    "Watching the identifier ....",
    "Looking for changes on identifier ....",
  ];

  return (
    <div>
    <div className="flex justify-center items-center w-[100%] mt-10">
    < div className="blockspinn">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    </div>
    </div>
    <div className="flex justify-center items-center mt-8"> {/* Centering on screen */}

      <h1 className="text-xl text-gray-600 font-bold"> {/* Increased size, improved contrast */}
        <AnimatedText phrases={loadingPhrases} />
      </h1>
    </div>
    </div>

  );
};

export default Loader;