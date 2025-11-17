"use client";

import React from 'react';

export default function Sparkline({ data = [], width = 160, height = 40, stroke = '#60A5FA', fill = 'rgba(96,165,250,0.12)' }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-neutral-500 text-xs">No trend</div>
    );
  }

  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const pathD = `M ${points.split(' ')[0]} L ${points.split(' ').slice(1).join(' L ')}`;

  // For filled area path create from points
  const areaD = `M ${points.split(' ')[0]} L ${points.split(' ').slice(1).join(' L ')} L ${width},${height} L 0,${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="block">
      <path d={areaD} fill={fill} />
      <path d={pathD} fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
