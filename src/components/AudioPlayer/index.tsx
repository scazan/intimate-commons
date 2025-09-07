"use client";
import { useAudio } from "@/lib/providers/hooks/useAudio";
import { useEffect, useState } from "react";

export const AudioPlayer = ({ 
  src, 
  usePlaylist = false, 
  regeneratePlaylist = false 
}: { 
  src?: string; 
  usePlaylist?: boolean;
  regeneratePlaylist?: boolean;
}) => {
  const { AudioToggle, setSrc, setPlaylist, regeneratePlaylist: regeneratePlaylistFn } = useAudio();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (usePlaylist) {
      if (regeneratePlaylist) {
        // Regenerate the playlist (for results page)
        const regenerateAndSet = async () => {
          try {
            setIsLoading(true);
            await regeneratePlaylistFn();
          } catch (error) {
            console.error('Error regenerating playlist:', error);
            if (src) {
              setSrc(src);
            }
          } finally {
            setIsLoading(false);
          }
        };
        
        regenerateAndSet();
      }
      // If not regenerating, the playlist should already be loaded from app startup
    } else if (src) {
      setSrc(src);
    }
  }, [src, usePlaylist, regeneratePlaylist]);

  if (isLoading) {
    return <div>Updating playlist...</div>;
  }

  return AudioToggle;
};
