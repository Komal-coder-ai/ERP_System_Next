"use client";

import React from 'react';

export default function LineChart({ data = [], labels = [], height = 200, stroke = '#60A5FA', fill = 'rgba(96,165,250,0.08)' }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-neutral-500 text-sm">No data to display</div>;
  }

  const width = 800; // viewBox width
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const pathD = `M ${points.split(' ')[0]} L ${points.split(' ').slice(1).join(' L ')}`;
  const areaD = `M ${points.split(' ')[0]} L ${points.split(' ').slice(1).join(' L ')} L ${width},${height} L 0,${height} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full" height={height}>
        <defs>
          <linearGradient id="lg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.12" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#lg)" />
        <path d={pathD} fill="none" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="flex items-center justify-between text-xs text-neutral-400 mt-2">
        <div>{labels && labels.length ? labels[0] : ''}</div>
        <div>{labels && labels.length ? labels[labels.length - 1] : ''}</div>
      </div>
    </div>
  );
}
