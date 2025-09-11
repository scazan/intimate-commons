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
  audio: null,
  bgAudio: null,
  isPlaying: true,
  setIsPlaying: (should: boolean) => {},
  setSrc: (src: string) => {},
  setPlaylist: (playlist: any[]) => {},
  regeneratePlaylist: () => {},
  currentTrack: 0,
  playlist: [],
  nextTrack: () => {},
  prevTrack: () => {},
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
  const [currentTrack, setCurrentTrack] = useState(0);
  const [playlist, setPlaylistState] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [audio, setAudio] = useState(null);
  const [bgAudio, setBgAudio] = useState(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const play = () => {
    if (!audio || !bgAudio) return;

    if (audio.src) {
      audio.play().catch(console.error);
      audio.volume = 0.7;
    }

    bgAudio.play().catch(console.error);
    bgAudio.volume = 1;

    setIsPlaying(true);
  };

  const pause = () => {
    if (!audio || !bgAudio) return;

    audio.pause();
    bgAudio.pause();

    setIsPlaying(false);
  };

  const setSrc = (src: string) => {
    if (!audio) return;

    audio.src = src;
    audio.volume = 0.7;
    audio.loop = playlist.length <= 1; // Only loop if single track
    audio.oncanplaythrough = () => {
      audio.play();
    };
  };

  const setPlaylist = (newPlaylist: any[]) => {
    setPlaylistState(newPlaylist);
    setCurrentTrack(0);
  };

  const regeneratePlaylist = async () => {
    try {
      const response = await fetch(`/api/playlist-data/${Date.now()}`, {
        cache: "no-cache",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const playlistData = await response.json();

      if (playlistData.tracks && playlistData.tracks.length > 0) {
        setPlaylistState(playlistData.tracks);
        setCurrentTrack(0);
      }
    } catch (error) {
      console.error("Error regenerating playlist:", error);
    }
  };

  const nextTrack = () => {
    if (currentTrack < playlist.length - 1) {
      setCurrentTrack((prev) => prev + 1);
    } else {
      // Loop back to the first track
      setCurrentTrack(0);
    }
  };

  const prevTrack = () => {
    if (currentTrack > 0) {
      setCurrentTrack((prev) => prev - 1);
    }
  };

  // Initialize audio objects
  useEffect(() => {
    if (!audio) {
      const newAudio = new Audio();
      const newBgAudio = new Audio();

      setAudio(newAudio);
      setBgAudio(newBgAudio);
    }
  }, []);

  // Set up background audio and load initial playlist
  useEffect(() => {
    if (!audio || !bgAudio) return;

    bgAudio.src = "/IC-Underscore.mp3";
    bgAudio.volume = 1;
    bgAudio.loop = true;
    bgAudio.oncanplaythrough = () => {
      bgAudio.play();
    };

    // Load playlist on app start
    const loadInitialPlaylist = async () => {
      try {
        const response = await fetch(`/api/playlist-data/${Date.now()}`, {
          cache: "no-cache",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        const playlistData = await response.json();

        if (playlistData.tracks && playlistData.tracks.length > 0) {
          setPlaylistState(playlistData.tracks);
          setCurrentTrack(0);
        }
      } catch (error) {
        console.error("Error loading initial playlist:", error);
      }
    };

    loadInitialPlaylist();

    const bindTouchPlay = () => {
      setHasUserInteracted(true);
      if (bgAudio) {
        bgAudio?.play();
      }
      // Also start playlist if it's loaded
      if (audio && playlist.length > 0 && audio.src) {
        audio.play().catch(console.error);
      }
      window.removeEventListener("touchstart", bindTouchPlay);
      window.removeEventListener("click", bindTouchPlay);
    };

    window.addEventListener("touchstart", bindTouchPlay);
    window.addEventListener("click", bindTouchPlay);

    return () => {
      window.removeEventListener("touchstart", bindTouchPlay);
      window.removeEventListener("click", bindTouchPlay);
    };
  }, [audio, bgAudio]);

  // Set up event listener for auto-advance when playlist changes
  useEffect(() => {
    if (!audio || playlist.length <= 1) return;

    const handleTrackEnd = () => {
      // Add random delay between 3-5 seconds before advancing to next track
      const delay = Math.random() * 2000 + 3000; // Random between 3000-5000ms
      setTimeout(() => {
        setCurrentTrack((prev) => {
          const next = prev < playlist.length - 1 ? prev + 1 : 0;
          return next;
        });
      }, delay);
    };

    audio.addEventListener("ended", handleTrackEnd);

    return () => {
      audio.removeEventListener("ended", handleTrackEnd);
    };
  }, [audio, playlist.length]);

  // Update track when currentTrack or playlist changes
  useEffect(() => {
    if (playlist.length > 0 && playlist[currentTrack]) {
      setSrc(playlist[currentTrack].url);
    }
  }, [currentTrack, playlist]);

  // Start playlist when it loads after user interaction
  useEffect(() => {
    if (
      hasUserInteracted &&
      playlist.length > 0 &&
      audio &&
      audio.src &&
      isPlaying
    ) {
      audio.play().catch(console.error);
    }
  }, [hasUserInteracted, playlist.length, audio?.src, isPlaying]);

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
        setPlaylist,
        regeneratePlaylist,
        currentTrack,
        playlist,
        nextTrack,
        prevTrack,
        setIsPlaying: (should) => {
          if (should) {
            play();
          } else {
            pause();
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
