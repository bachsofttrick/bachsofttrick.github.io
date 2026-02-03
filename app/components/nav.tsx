"use client"

import Link from 'next/link'
import { useState, useRef } from 'react';

const navItems = {
  '/': {
    name: 'home',
  },
  '/about': {
    name: 'about',
  },
  '/projects': {
    name: 'projects',
  },
  '/blog': {
    name: 'blog',
  },
}

export function Navbar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  audioRef.current?.addEventListener("ended", () => {
    (audioRef.current as HTMLAudioElement).currentTime = 0;
    setIsPlaying(false);
  });

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };
  
  return (
    <aside className="-ml-[8px] mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row space-x-0 pr-10">
            {Object.entries(navItems).map(([path, { name }]) => {
              return (
                <Link
                  key={path}
                  href={path}
                  className="transition-all hover:text-neutral-800 flex align-middle relative py-1 px-2 m-1"
                >
                  {name}
                </Link>
              )
            })}
            <Link
              key="music"
              href=""
              onClick={togglePlay}
              className="transition-all hover:text-neutral-800 flex align-middle relative py-1 px-2 m-1"
            >
              {isPlaying ? '||' : '▷'}
            </Link>
            <audio id="audio" ref={audioRef} preload="auto" src="/music/Giornos Theme, but only the best part.m4a"/>
          </div>
        </nav>
      </div>
    </aside>
  )
}
