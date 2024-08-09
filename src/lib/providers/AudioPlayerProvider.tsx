import { createContext, useState } from "react";

// Creating the context
export const AudioPlayerContext = createContext({
  isActive: false,
  play: () => {},
  pause: () => {},
});
export const AudioPlayerProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false); // Defining the initial state

  const play = () => {
    // Function to play
    setIsActive(true);
  };
  const pause = () => {
    // Function to pause
    setIsActive(false);
  };
  // Providing the state and functions to the child components
  return (
    <AudioPlayerContext.Provider value={{ isActive, play, pause }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};
