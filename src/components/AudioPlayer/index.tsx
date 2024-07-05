"use client";
import { useAudio } from "@/lib/providers/hooks/useAudio";
import { useEffect } from "react";

export const AudioPlayer = ({ src }: { src?: string }) => {
  const { AudioToggle, setSrc } = useAudio();

  useEffect(() => {
    setSrc(src);
  }, [src]);

  return AudioToggle;
};
