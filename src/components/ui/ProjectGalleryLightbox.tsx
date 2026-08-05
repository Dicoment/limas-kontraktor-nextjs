"use client";

import { useState, useEffect, useCallback, useRef, MouseEvent } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectGalleryLightboxProps {
  images: string[];
}

export default function ProjectGalleryLightbox({
  images,
}: ProjectGalleryLightboxProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const hasEnoughForLoop = images.length > 1;
  // Triple gambar biar ada buffer di kiri & kanan untuk efek infinite loop
  const loopImages = hasEnoughForLoop ? [...images, ...images, ...images] : images;
  const setStart = images.length; // index awal blok tengah (blok ke-2 dari 3)

  const openAt = (originalIndex: number) => {
    setIndex(originalIndex);
    setOpen(true);
  };

  const close = useCallback(() => setOpen(false), []);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  // Posisikan slider ke awal blok tengah saat pertama kali render,
  // supaya ada ruang gambar di kiri (untuk drag/scroll ke arah sebelumnya)
  useEffect(() => {
    if (!sliderRef.current || !hasEnoughForLoop) return;
    const container = sliderRef.current;
    const itemWidth = container.scrollWidth / loopImages.length;
    container.scrollLeft = itemWidth * setStart;
  }, [hasEnoughForLoop, setStart, loopImages.length]);

  // Reset posisi scroll secara diam-diam kalau sudah mendekati ujung
  // kiri/kanan, supaya terasa seperti infinite loop tanpa lompatan yang terlihat
  const handleScroll = () => {
    if (!sliderRef.current || !hasEnoughForLoop) return;
    const container = sliderRef.current;
    const itemWidth = container.scrollWidth / loopImages.length;
    const blockWidth = itemWidth * images.length;

    if (container.scrollLeft < itemWidth * 0.5) {
      container.scrollLeft += blockWidth;
    } else if (container.scrollLeft > blockWidth * 2 - itemWidth * 0.5) {
      container.scrollLeft -= blockWidth;
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    setIsMouseDown(true);
    setIsDragging(false);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2.5;

    if (Math.abs(x - startX) > 5) {
      setIsDragging(true);
    }

    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleItemClick = (originalIndex: number) => {
    if (!isDragging) {
      openAt(originalIndex);
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="w-full relative">
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onScroll={handleScroll}
          className={`flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none py-2 select-none ${
            isMouseDown ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {loopImages.map((img, i) => {
            const originalIndex = i % images.length;
            return (
              <div
                key={i}
                onClick={() => handleItemClick(originalIndex)}
                className="shrink-0 w-[calc((100%-1rem)/2)] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] aspect-[4/3] bg-slate-100 overflow-hidden relative group/item"
              >
                <Image
                  src={img}
                  alt={`Dokumentasi ${originalIndex + 1}`}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 45vw, 32vw"
                  draggable={false}
                  className="object-cover transition-transform duration-500 group-hover/item:scale-105 pointer-events-none"
                />
              </div>
            );
          })}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center backdrop-blur-md"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/10"
            aria-label="Tutup"
          >
            <X size={22} />
          </button>

          <div className="absolute top-6 left-6 z-20 text-white/80 text-sm font-semibold tracking-widest uppercase bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            {index + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/10"
              aria-label="Sebelumnya"
            >
              <ChevronLeft size={26} />
            </button>
          )}

          <div
            className="relative w-[88vw] h-[75vh] max-w-[1200px]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[index]}
              alt={`Galeri ${index + 1}`}
              fill
              sizes="90vw"
              className="object-contain select-none shadow-2xl"
              priority
            />
          </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/10"
              aria-label="Berikutnya"
            >
              <ChevronRight size={26} />
            </button>
          )}

          {images.length > 1 && (
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5 max-w-[90vw] overflow-x-auto px-4 py-2 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    i === index
                      ? "border-white scale-105 opacity-100"
                      : "border-transparent opacity-40 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}