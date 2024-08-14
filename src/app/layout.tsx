import { SiteHeader } from "@/components";
import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { AudioPlayer } from "@/components/AudioPlayer";
import {
  AudioPlayerContext,
  AudioPlayerProvider,
} from "@/lib/providers/AudioPlayerProvider";

const editorialNew = localFont({
  src: [
    {
      path: "../../public/fonts/PPEditorialNew-Thin.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/PPEditorialNew-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-editorialNew",
});

const gosha = localFont({
  src: [
    {
      path: "../../public/fonts/PPGoshaSans-Thin.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/PPGoshaSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-goshaSans",
});

export const metadata: Metadata = {
  title: "Intimate Commons",
  description: "Raphael Arar & Scott Cazan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${gosha.variable} ${editorialNew.variable} font-serif`}>
        <AudioPlayerProvider>
          <AudioPlayer />
          <SiteHeader />

          <main className="flex min-h-screen flex-col items-center justify-between p-4  pb-32">
            {children}
          </main>
          <div className="bottomGradient z-10"></div>
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
