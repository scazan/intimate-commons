"use client";
import {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
} from "react";

// Creating the context
export const AudioPlayerContext = createContext({
  play: () => {},
  pause: () => {},
  audio: new Audio(),
  bgAudio: new Audio(),
  isPlaying: true,
  setIsPlaying: (should: boolean) => {},
  setSrc: (src: string) => {},
});
const DispatchContext = createContext({});

export const useDispatch = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error("useDispatch must be used within a DispatchProvider");
  }

  const actions = {
    setIsPlaying: () =>
      //@ts-ignore
      context({
        payload: null,
      }),
  };

  return actions;
};

export const AudioPlayerProvider = ({ children }) => {
  const { audio, bgAudio, ...context } = useContext(AudioPlayerContext);

  const play = () => {
    audio.play();
    audio.volume = 1;

    bgAudio.play();
    bgAudio.volume = 1;

    context.isPlaying = true;
  };

  const pause = () => {
    audio.pause();
    audio.volume = 0;
    bgAudio.pause();
    bgAudio.volume = 0;
  };

  const setSrc = (src: string) => {
    audio.src = src;
    audio.volume = 1;
    audio.oncanplaythrough = () => {
      audio.play();
    };
  };

  useEffect(() => {
    bgAudio.src = "/IC-Underscore.mp3";
    bgAudio.volume = 1;
    bgAudio.oncanplaythrough = () => {
      bgAudio.play();
    };

    audio.loop = true;
    bgAudio.loop = true;

    const bindTouchPlay = () => {
      if (bgAudio) {
        bgAudio?.play();

        window.removeEventListener("touchstart", bindTouchPlay);
        window.removeEventListener("click", bindTouchPlay);
      }
    };

    window.addEventListener("touchstart", bindTouchPlay);
    window.addEventListener("click", bindTouchPlay);
  }, []);

  const [isPlaying, setIsPlaying] = useState(true);

  // Providing the state and functions to the child components
  return (
    <AudioPlayerContext.Provider
      value={{
        play,
        pause,
        isPlaying,
        audio,
        bgAudio,
        setSrc,
        setIsPlaying: (should) => {
          if (should) {
            play();
            setIsPlaying(true);
          } else {
            pause();
            setIsPlaying(false);
          }
        },
      }}
    >
      <DispatchContext.Provider value={useDispatch}>
        {children}
      </DispatchContext.Provider>
    </AudioPlayerContext.Provider>
  );
};
