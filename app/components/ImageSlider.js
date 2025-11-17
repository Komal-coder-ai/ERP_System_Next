"use client";

import React, { useState } from 'react';

export default function ImageSlider({ images = [], initialIndex = 0, onClose }) {
  const [index, setIndex] = useState(initialIndex);

  if (!images || images.length === 0) return null;

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative max-w-3xl w-full p-4">
        <button onClick={onClose} className="absolute right-2 top-2 bg-white/20 rounded p-2">✕</button>

        <div className="bg-white/5 rounded p-4 flex items-center justify-center">
          <button onClick={prev} className="text-white bg-white/10 px-3 py-2 rounded">◀</button>
          <img src={images[index].url} alt={images[index].alt || 'image'} className="max-h-[65vh] mx-4 object-contain" />
          <button onClick={next} className="text-white bg-white/10 px-3 py-2 rounded">▶</button>
        </div>

        <div className="mt-3 text-center text-sm text-neutral-300">
          {index + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
