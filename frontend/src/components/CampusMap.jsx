import React, { useState, useEffect, useRef } from 'react';
import { getPathForBuilding } from './pathUtils';
import { pathNodes } from './pathNodes';
import { HumanWalkingSVG } from './HumanWalkingSVG';
import { ZoomIn, ZoomOut, RotateCw, Maximize2 } from 'lucide-react';

import campusMapImage from '../assets/v7.png';

const hotspots = [
  { id: 'block-a', x: 16.3, y: 42, width: 6, height: 15, name: 'Block A' },
  { id: 'block-b', x: 42, y: 40, width: 10, height: 7, name: 'Block B' },
  { id: 'block-c', x: 16, y: 31, width: 4, height: 6, name: 'Block C' },
  { id: 'boys-hostel', x: 65, y: 29, width: 4, height: 5, name: "Boys' Hostel" },
  { id: 'girls-hostel', x: 12.5, y: 57.2, width: 4, height: 5, name: "Girls' Hostel" },
  { id: 'ground', x: 40, y: 29, width: 16, height: 7, name: 'College Ground' },
  { id: 'canteen', x: 62, y: 47.5, width: 5, height: 5, name: 'Canteen' },
  { id: 'main-gate', x: 36, y: 61, width: 5, height: 3, name: 'Main Gate' },
  { id: 'gate-2', x: 58, y: 61, width: 5, height: 3, name: 'Gate 2' },
  { id: 'gate-3', x: 67.5, y: 36, width: 3, height: 5, name: 'Gate 3' },
  { id: 'bus-parking', x: 44, y: 54, width: 11, height: 7, name: 'Bus Parking' },
  { id: 'security-room', x: 38, y: 59.4, width: 3, height: 2, name: 'Security Room' },
  { id: 'center', x: 31, y: 47.4, width: 3, height: 3, name: 'Center' },
  { id: 'kalam', x: 78, y: 32, width: 4, height: 5, name: 'Kalam Higher Secondary School' },
  { id: 'student-parking', x: 30, y: 64, width: 15, height: 4, name: 'Student Parking' },
];

export function CampusMap({ selectedLocation, onLocationClick, collapsed, onToggleCollapse }) {
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  const [isZoomOpen, setIsZoomOpen] = useState(true);

  const centerHotspot = hotspots.find(h => h.id === 'center');
  const highlightedHotspotId = selectedLocation?.id || hoveredHotspot;

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  // Animation state for human icon
  const [humanProgress, setHumanProgress] = useState(0);
  const animationRef = useRef();

  // Calculate path for selected building
  const pathNodeIds = getPathForBuilding(selectedLocation?.id);
  const pathPoints = pathNodeIds && pathNodeIds.length > 0 ? pathNodeIds.map(id => pathNodes[id]) : [];

  // Animate human icon along the path
  useEffect(() => {
    if (!pathPoints || pathPoints.length < 2) return;
    let progress = 0;
    let lastTimestamp = null;
    const duration = 4000 + 1000 * (pathPoints.length - 2); // slightly faster
    function animate(ts) {
      if (!lastTimestamp) lastTimestamp = ts;
      const delta = ts - lastTimestamp;
      lastTimestamp = ts;
      progress += delta / duration;
      if (progress > 1) progress = 1;
      setHumanProgress(progress);
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }
    setHumanProgress(0);
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [selectedLocation?.id]);

  return (
    <div className="flex-1 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden relative" style={{ contain: 'layout' }}>

      <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: !collapsed ? '#B3E6B3' : 'transparent' }}>
        <div className={`relative ${!collapsed ? 'h-5/6' : 'w-full h-full'} bg-gradient-to-br from-green-50 to-green-100 overflow-hidden`} style={{ contain: 'layout' }}>

          <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
            <button
              onClick={() => setIsZoomOpen(!isZoomOpen)}
              onTouchStart={e => { e.stopPropagation(); setIsZoomOpen(v => !v); }}
              className="bg-white shadow-lg rounded-lg p-3 hover:bg-gray-50 transition-colors font-bold text-lg"
              title={isZoomOpen ? 'Collapse' : 'Expand'}
            >
              {isZoomOpen ? '−' : '+'}
            </button>
            {isZoomOpen && (
              <>
                <button
                  onClick={handleZoomIn}
                  onTouchStart={e => { e.stopPropagation(); handleZoomIn(); }}
                  className="bg-white shadow-lg rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={handleZoomOut}
                  onTouchStart={e => { e.stopPropagation(); handleZoomOut(); }}
                  className="bg-white shadow-lg rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={handleRotate}
                  onTouchStart={e => { e.stopPropagation(); handleRotate(); }}
                  className="bg-white shadow-lg rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  title="Rotate 90°"
                >
                  <RotateCw className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={handleReset}
                  onTouchStart={e => { e.stopPropagation(); handleReset(); }}
                  className="bg-white shadow-lg rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  title="Reset View"
                >
                  <Maximize2 className="w-5 h-5 text-gray-700" />
                </button>
                <div className="bg-white shadow-lg rounded-lg px-3 py-2 text-center">
                  <div className="text-xs text-gray-500">Zoom</div>
                  <div className="text-sm font-bold text-gray-700">{Math.round(zoom * 100)}%</div>
                </div>
              </>
            )}
          </div>

          <div className="relative  w-full h-full rounded-2xl overflow-hidden shadow-2xl">
            <div
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease-out',
                transformOrigin: 'center center',
                width: '100%',
                height: '100%'
              }}
            >
              <img
                src={campusMapImage}
                alt="Campus Map"
                className="w-full h-full object-contain"
              />

              <svg
                key={`hotspots-${collapsed}`}
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid slice"
              >
                {/* Point O - Starting point marker with blinking animation */}
                <g>
                  {/* Outer pulsing circle */}
                  <circle
                    cx={pathNodes.O.x}
                    cy={pathNodes.O.y}
                    r="1.5"
                    fill="#ef4444"
                    opacity="0.3"
                  >
                    <animate
                      attributeName="r"
                      values="1.5;3;1.5"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.3;0.1;0.3"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* Inner solid circle */}
                  <circle
                    cx={pathNodes.O.x}
                    cy={pathNodes.O.y}
                    r="0.8"
                    fill="#dc2626"
                    stroke="#ffffff"
                    strokeWidth="0.2"
                  />
                  {/* Center dot */}
                  <circle
                    cx={pathNodes.O.x}
                    cy={pathNodes.O.y}
                    r="0.3"
                    fill="#ffffff"
                  />
                </g>

                {/* Highlighted path (dotted, with curve between M and P, or M and X1 for bus-parking) */}
                {pathPoints.length > 1 && (() => {
                  // Find indices for M, P, and X1
                  const getKeyByValue = (obj, value) => Object.keys(obj).find(k => obj[k] === value);
                  const mIdx2 = pathPoints.findIndex((pt) => getKeyByValue(pathNodes, pt) === 'M');
                  const pIdx2 = pathPoints.findIndex((pt) => getKeyByValue(pathNodes, pt) === 'P');
                  const x1Idx2 = pathPoints.findIndex((pt) => getKeyByValue(pathNodes, pt) === 'X1');
                  const Midx = mIdx2;
                  const Pidx = pIdx2;
                  const X1idx = x1Idx2;
                  const isBusParking = selectedLocation?.id === 'bus-parking';
                  // Build SVG path string
                  let d = '';
                  for (let i = 0; i < pathPoints.length; ++i) {
                    const pt = pathPoints[i];
                    if (i === 0) {
                      d += `M ${pt.x} ${pt.y}`;
                    } else if (isBusParking && Midx !== -1 && X1idx === i && Math.abs(Midx - X1idx) === 1) {
                      // Curve from M to X1 for bus-parking
                      const prev = pathPoints[Midx];
                      const next = pathPoints[X1idx];
                      const cx = (prev.x + next.x) / 2;
                      const cy = Math.max(prev.y, next.y) + 3;
                      d += ` Q ${cx} ${cy}, ${next.x} ${next.y}`;
                    } else if (!isBusParking && Midx !== -1 && Pidx === i && Math.abs(Midx - Pidx) === 1) {
                      // Curve from M to P for other paths (canteen, gate-2)
                      const prev = pathPoints[Midx];
                      const next = pathPoints[Pidx];
                      const cx = (prev.x + next.x) / 2;
                      const cy = Math.max(prev.y, next.y) + 5;
                      d += ` Q ${cx} ${cy}, ${next.x} ${next.y}`;
                    } else {
                      d += ` L ${pt.x} ${pt.y}`;
                    }
                  }
                  // Fallback to straight lines if M and P/X1 are not adjacent
                  if ((!isBusParking && (Midx === -1 || Pidx === -1 || Math.abs(Midx - Pidx) !== 1)) ||
                    (isBusParking && (Midx === -1 || X1idx === -1 || Math.abs(Midx - X1idx) !== 1))) {
                    d = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
                    for (let i = 1; i < pathPoints.length; ++i) {
                      d += ` L ${pathPoints[i].x} ${pathPoints[i].y}`;
                    }
                  }
                  return (
                    <>
                      {/* Shadow/glow path underneath */}
                      <path
                        d={d}
                        fill="none"
                        stroke="#16a34a"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.3"
                      />
                      {/* Main solid route line */}
                      <path
                        d={d}
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="0.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ filter: 'drop-shadow(0 0 2px #16a34a)' }}
                      />
                      {/* White center line for road feel */}
                      <path
                        d={d}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="0.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.6"
                      />
                    </>
                  );
                })()}
                {/* Human icon animation */}
                {pathPoints.length > 1 && (
                  (() => {
                    // Calculate current position along the path
                    let totalDist = 0;
                    const segLens = [];
                    for (let i = 1; i < pathPoints.length; ++i) {
                      const dx = pathPoints[i].x - pathPoints[i - 1].x;
                      const dy = pathPoints[i].y - pathPoints[i - 1].y;
                      const len = Math.sqrt(dx * dx + dy * dy);
                      segLens.push(len);
                      totalDist += len;
                    }
                    let travel = humanProgress * totalDist;
                    let pos = pathPoints[0];
                    let reachedEnd = false;
                    let currentAngle = 0;
                    // Find indices for M, P and X1 for curve
                    const getKeyByValue = (obj, value) => Object.keys(obj).find(k => obj[k] === value);
                    const mIdx = pathPoints.findIndex((pt) => getKeyByValue(pathNodes, pt) === 'M');
                    const pIdx = pathPoints.findIndex((pt) => getKeyByValue(pathNodes, pt) === 'P');
                    const x1Idx = pathPoints.findIndex((pt) => getKeyByValue(pathNodes, pt) === 'X1');
                    const isBusParking = selectedLocation?.id === 'bus-parking';
                    for (let i = 1; i < pathPoints.length; ++i) {
                      if (travel > segLens[i - 1]) {
                        travel -= segLens[i - 1];
                      } else {
                        const t = segLens[i - 1] === 0 ? 0 : travel / segLens[i - 1];
                        // Calculate direction angle for rotation
                        if (isBusParking && i - 1 === mIdx && i === x1Idx && mIdx !== -1 && x1Idx !== -1) {
                          // Curve from M to X1 for bus-parking
                          const prev = pathPoints[mIdx];
                          const next = pathPoints[x1Idx];
                          const cx = (prev.x + next.x) / 2;
                          const cy = Math.max(prev.y, next.y) + 3;
                          // Quadratic Bezier formula
                          pos = {
                            x: (1 - t) * (1 - t) * prev.x + 2 * (1 - t) * t * cx + t * t * next.x,
                            y: (1 - t) * (1 - t) * prev.y + 2 * (1 - t) * t * cy + t * t * next.y,
                          };
                          // Calculate tangent angle at position t
                          const tx = 2 * (1 - t) * (cx - prev.x) + 2 * t * (next.x - cx);
                          const ty = 2 * (1 - t) * (cy - prev.y) + 2 * t * (next.y - cy);
                          currentAngle = Math.atan2(ty, tx) * (180 / Math.PI);
                        } else if (!isBusParking && i - 1 === mIdx && i === pIdx && mIdx !== -1 && pIdx !== -1) {
                          // Curve from M to P for other paths (canteen, gate-2)
                          const prev = pathPoints[mIdx];
                          const next = pathPoints[pIdx];
                          const cx = (prev.x + next.x) / 2;
                          const cy = Math.max(prev.y, next.y) + 5;
                          // Quadratic Bezier formula
                          pos = {
                            x: (1 - t) * (1 - t) * prev.x + 2 * (1 - t) * t * cx + t * t * next.x,
                            y: (1 - t) * (1 - t) * prev.y + 2 * (1 - t) * t * cy + t * t * next.y,
                          };
                          // Calculate tangent angle at position t
                          const tx = 2 * (1 - t) * (cx - prev.x) + 2 * t * (next.x - cx);
                          const ty = 2 * (1 - t) * (cy - prev.y) + 2 * t * (next.y - cy);
                          currentAngle = Math.atan2(ty, tx) * (180 / Math.PI);
                        } else {
                          pos = {
                            x: pathPoints[i - 1].x + t * (pathPoints[i].x - pathPoints[i - 1].x),
                            y: pathPoints[i - 1].y + t * (pathPoints[i].y - pathPoints[i - 1].y),
                          };
                          // Calculate direction angle
                          const dx = pathPoints[i].x - pathPoints[i - 1].x;
                          const dy = pathPoints[i].y - pathPoints[i - 1].y;
                          currentAngle = Math.atan2(dy, dx) * (180 / Math.PI);
                        }
                        if (humanProgress === 1) {
                          pos = pathPoints[pathPoints.length - 1];
                          reachedEnd = true;
                        }
                        break;
                      }
                    }
                    // If travel exceeds all segments, force to last point
                    if (!reachedEnd && humanProgress === 1) {
                      pos = pathPoints[pathPoints.length - 1];
                      // Calculate final direction
                      if (pathPoints.length >= 2) {
                        const lastIdx = pathPoints.length - 1;
                        const dx = pathPoints[lastIdx].x - pathPoints[lastIdx - 1].x;
                        const dy = pathPoints[lastIdx].y - pathPoints[lastIdx - 1].y;
                        currentAngle = Math.atan2(dy, dx) * (180 / Math.PI);
                      }
                    }
                    // Animated walking human SVG with rotation
                    return (
                      <g transform={`translate(${pos.x}, ${pos.y}) rotate(${currentAngle})`}>
                        <HumanWalkingSVG x={0} y={0} size={1.2} color="#e11d48" walking={humanProgress < 1} />
                      </g>
                    );
                  })()
                )}
                {/* Hotspots */}
                {hotspots.map((hotspot) => {
                  const isSelected = selectedLocation?.id === hotspot.id;
                  const isHovered = hoveredHotspot === hotspot.id;
                  // Hot highlighting: add animated glowing border on hover/selected
                  return (
                    <g key={hotspot.id}>
                      {/* Glow effect for hover or selected (thinner border) */}
                      {(isHovered || isSelected) && (
                        <rect
                          x={hotspot.x - 0.3}
                          y={hotspot.y - 0.3}
                          width={hotspot.width + 0.6}
                          height={hotspot.height + 0.6}
                          rx="2"
                          fill="none"
                          stroke={isSelected ? '#2563eb' : '#facc15'}
                          strokeWidth="1.1"
                          style={{
                            filter: `drop-shadow(0 0 6px ${isSelected ? '#2563eb' : '#facc15'}) drop-shadow(0 0 12px ${isSelected ? '#2563eb' : '#fde047'})`,
                            opacity: 0.7,
                            transition: 'filter 0.3s, opacity 0.3s',
                          }}
                        >
                          <animate
                            attributeName="opacity"
                            values="0.7;1;0.7"
                            dur="1.2s"
                            repeatCount="indefinite"
                          />
                        </rect>
                      )}
                      <rect
                        x={hotspot.x}
                        y={hotspot.y}
                        width={hotspot.width}
                        height={hotspot.height}
                        className="fill-transparent stroke-transparent pointer-events-auto cursor-pointer"
                        rx="1"
                        onMouseEnter={() => setHoveredHotspot(hotspot.id)}
                        onMouseLeave={() => setHoveredHotspot(null)}
                        onTouchStart={() => setHoveredHotspot(hotspot.id)}
                        onTouchEnd={() => setHoveredHotspot(null)}
                        onClick={() => {
                          if (collapsed) {
                            onToggleCollapse();
                          }
                          onLocationClick(hotspot.id);
                        }}
                        style={{ pointerEvents: 'auto' }}
                      />
                    </g>
                  );
                })}
              </svg>

              {hoveredHotspot && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg pointer-events-none z-10">
                  <p className="text-sm font-semibold text-gray-800">
                    {hotspots.find((h) => h.id === hoveredHotspot)?.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
