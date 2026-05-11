"use client";

import '@/app/styles/animations.css'
import '@/app/styles/carousel.css'
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

type CarouselConfig = {
  imgs: string[], 
};

export default function ImageCarousel({ imgs }: CarouselConfig) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<"left" | "right">("right");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const prev = () => {
    setDir("left");
    setIdx((i) => (i - 1 + imgs.length) % imgs.length);
  };

  const next = () => {
    setDir("right");
    setIdx((i) => (i + 1) % imgs.length);
  };

  const goTo = (i: number) => {
    setDir(i > idx ? "right" : "left");
    setIdx(i);
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") { setDir("left"); setIdx((i) => (i - 1 + imgs.length) % imgs.length); }
      if (e.key === "ArrowRight") { setDir("right"); setIdx((i) => (i + 1) % imgs.length); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, imgs.length]);

  const slideClass = dir === "right" ? "slideInRight" : "slideInLeft";

  const navButtons = (
    <>
      <button onClick={prev} className="carousel__btn carousel__btn--prev" aria-label="Previous image">‹</button>
      <button onClick={next} className="carousel__btn carousel__btn--next" aria-label="Next image">›</button>
    </>
  );

  const dotRow = (
    <div className="carousel__dots">
      {imgs.map((_, i) => (
        <button
          key={i}
          onClick={() => goTo(i)}
          className={`carousel__dot ${i === idx ? "carousel__dot--active" : ""}`}
          aria-label={`Go to image ${i + 1}`}
        />
      ))}
    </div>
  );

  return (
    <>
      <div className="w-full max-w-6xl">
        <div className="relative">
          <div
            className="relative w-full aspect-video rounded-[20px] overflow-hidden bg-(--bg-alt) cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
          >
            <img
              key={idx}
              src={imgs[idx]}
              alt=''
              className={`object-contain w-full h-full ${slideClass}`}
            />
          </div>
          {navButtons}
        </div>
        {dotRow}
      </div>

      {lightboxOpen && createPortal(
        <div className="lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="lightbox__close" onClick={() => setLightboxOpen(false)} aria-label="Close lightbox">✕</button>
          <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
            <img
              key={`lb-${idx}`}
              src={imgs[idx]}
              alt=''
              className={`object-contain w-full h-full ${slideClass}`}
            />
            {navButtons}
          </div>
          <div onClick={(e) => e.stopPropagation()}>{dotRow}</div>
        </div>,
        document.body
      )}
    </>
  );
}
