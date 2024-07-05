"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export const useAudio = () => {
  const [src, setSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const audio = useRef(new Audio());
  const bgAudio = useRef(new Audio());

  useEffect(() => {
    bgAudio.current.src = "/IC-Underscore.mp3";
    bgAudio.current.volume = 1;
    bgAudio.current.oncanplaythrough = () => {
      bgAudio.current.play();
    };
  }, []);

  useEffect(() => {
    if (src) {
      audio.current.src = src;
      audio.current.volume = 1;
      audio.current.oncanplaythrough = () => {
        audio.current.play();
      };
    }
  }, [src]);

  useEffect(() => {
    if (isPlaying) {
      audio.current.play();
      audio.current.volume = 1;

      bgAudio.current.play();
      bgAudio.current.volume = 1;
    } else {
      audio.current.volume = 0;
      bgAudio.current.volume = 0;
    }
  }, [isPlaying]);

  const AudioToggle = (
    <div
      onClick={() => setIsPlaying(!isPlaying)}
      className={cn("cursor-pointer fixed z-50 bottom-8 right-4")}
    >
      {isPlaying ? (
        <svg
          width="42"
          height="42"
          viewBox="0 0 42 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.5"
            y="0.5"
            width="41"
            height="41"
            rx="20.5"
            fill="#FFF7FC"
            fill-opacity="0.88"
          />
          <rect
            x="0.5"
            y="0.5"
            width="41"
            height="41"
            rx="20.5"
            stroke="#F2107C"
          />
          <path
            d="M28.7479 14C30.1652 15.9702 31 18.3876 31 21C31 23.6124 30.1652 26.0298 28.7479 28M24.7453 17C25.5362 18.1338 26 19.5127 26 21C26 22.4872 25.5362 23.8662 24.7453 25M18.6343 13.3657L15.4686 16.5314C15.2957 16.7043 15.2092 16.7908 15.1083 16.8526C15.0188 16.9075 14.9213 16.9479 14.8192 16.9724C14.7041 17 14.5818 17 14.3373 17H12.6C12.0399 17 11.7599 17 11.546 17.109C11.3578 17.2049 11.2049 17.3578 11.109 17.546C11 17.7599 11 18.0399 11 18.6V23.4C11 23.96 11 24.2401 11.109 24.454C11.2049 24.6421 11.3578 24.7951 11.546 24.891C11.7599 25 12.0399 25 12.6 25H14.3373C14.5818 25 14.7041 25 14.8192 25.0276C14.9213 25.0521 15.0188 25.0925 15.1083 25.1473C15.2092 25.2092 15.2957 25.2957 15.4686 25.4686L18.6343 28.6343C19.0627 29.0627 19.2769 29.2769 19.4608 29.2913C19.6203 29.3039 19.7763 29.2393 19.8802 29.1176C20 28.9773 20 28.6744 20 28.0686V13.9314C20 13.3255 20 13.0226 19.8802 12.8824C19.7763 12.7607 19.6203 12.6961 19.4608 12.7086C19.2769 12.7231 19.0627 12.9373 18.6343 13.3657Z"
            stroke="#F2107C"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ) : (
        <svg
          width="42"
          height="42"
          viewBox="0 0 42 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.5"
            y="0.5"
            width="41"
            height="41"
            rx="20.5"
            fill="#FFF7FC"
            fill-opacity="0.88"
          />
          <rect
            x="0.5"
            y="0.5"
            width="41"
            height="41"
            rx="20.5"
            stroke="#F2107C"
          />
          <path
            d="M31 18L25 24M25 18L31 24M18.6343 13.3657L15.4686 16.5314C15.2957 16.7043 15.2092 16.7908 15.1083 16.8526C15.0188 16.9075 14.9213 16.9479 14.8192 16.9724C14.7041 17 14.5818 17 14.3373 17H12.6C12.0399 17 11.7599 17 11.546 17.109C11.3578 17.2049 11.2049 17.3578 11.109 17.546C11 17.7599 11 18.0399 11 18.6V23.4C11 23.96 11 24.2401 11.109 24.454C11.2049 24.6421 11.3578 24.7951 11.546 24.891C11.7599 25 12.0399 25 12.6 25H14.3373C14.5818 25 14.7041 25 14.8192 25.0276C14.9213 25.0521 15.0188 25.0925 15.1083 25.1473C15.2092 25.2092 15.2957 25.2957 15.4686 25.4686L18.6343 28.6343C19.0627 29.0627 19.2769 29.2769 19.4608 29.2913C19.6203 29.3039 19.7763 29.2393 19.8802 29.1176C20 28.9773 20 28.6744 20 28.0686V13.9314C20 13.3255 20 13.0226 19.8802 12.8824C19.7763 12.7607 19.6203 12.6961 19.4608 12.7086C19.2769 12.7231 19.0627 12.9373 18.6343 13.3657Z"
            stroke="#F2107C"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      )}
    </div>
  );

  return {
    AudioToggle,
    setSrc,
  };
};
