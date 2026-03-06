import React, { useEffect, useRef } from 'react';

/**
 * Realistic walking human figure rendered purely with SVG.
 * Uses requestAnimationFrame for smooth, physics-based animation.
 * The figure has: head, neck, torso, two arms with forearms, two legs with calves + feet.
 * All limbs swing with sinusoidal cycles for natural motion.
 */
export const HumanWalkingSVG = ({ x = 0, y = 0, size = 2, color = '#e11d48', walking = true }) => {
  const groupRef = useRef(null);
  const frameRef = useRef(null);
  const timeRef = useRef(0);

  // Derive colour palette
  const skin = '#FDBCB4';
  const hair = '#3B2314';
  const shirt = color;
  const pants = color === '#e11d48' ? '#7f1d1d' : '#1e3a5f';
  const shoes = '#1a1a1a';
  const shadow = '#00000028';

  useEffect(() => {
    const g = groupRef.current;
    if (!g) return;

    const SPEED = walking ? 2.5 : 0; // radians per second
    const S = size;

    // Helper to set SVG element attributes
    const setAttr = (el, attrs) => {
      if (!el) return;
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    };

    // Find child elements by data-id
    const find = (id) => g.querySelector(`[data-id="${id}"]`);

    const animate = (timestamp) => {
      if (!walking) return;
      timeRef.current = timestamp / 1000;
      const t = timeRef.current * SPEED;

      // Walk cycle parameters — sinusoidal swing
      const hipSwing = Math.sin(t) * 22;          // degrees, hip-to-thigh rotation
      const kneeSwing = Math.max(0, Math.sin(t)) * 30; // knee bends only forward
      const armSwing = Math.sin(t) * 28;           // arms opposite to legs
      const bodyBob = Math.abs(Math.sin(t * 2)) * S * 0.03; // up/down bob

      // Body bob: adjust main group translate y
      const bodyGroup = find('body');
      if (bodyGroup) {
        bodyGroup.setAttribute('transform', `translate(0, ${-bodyBob})`);
      }

      // Left leg (opposite phase to right)
      const leftThigh = find('left-thigh');
      const leftCalf = find('left-calf');
      if (leftThigh) setAttr(leftThigh, { transform: `rotate(${-hipSwing}, 0, 0)` });
      if (leftCalf) setAttr(leftCalf, { transform: `rotate(${kneeSwing}, 0, ${S * 0.28})` });

      // Right leg
      const rightThigh = find('right-thigh');
      const rightCalf = find('right-calf');
      if (rightThigh) setAttr(rightThigh, { transform: `rotate(${hipSwing}, 0, 0)` });
      if (rightCalf) setAttr(rightCalf, { transform: `rotate(${-Math.max(0, Math.sin(t + Math.PI)) * 30}, 0, ${S * 0.28})` });

      // Left arm (swings opposite to left leg → same phase as right leg)
      const leftArm = find('left-arm');
      const leftForearm = find('left-forearm');
      if (leftArm) setAttr(leftArm, { transform: `rotate(${hipSwing * 0.8}, 0, 0)` });
      if (leftForearm) setAttr(leftForearm, { transform: `rotate(${Math.max(0, Math.sin(t)) * 20}, 0, ${S * 0.22})` });

      // Right arm
      const rightArm = find('right-arm');
      const rightForearm = find('right-forearm');
      if (rightArm) setAttr(rightArm, { transform: `rotate(${-hipSwing * 0.8}, 0, 0)` });
      if (rightForearm) setAttr(rightForearm, { transform: `rotate(${Math.max(0, Math.sin(t + Math.PI)) * 20}, 0, ${S * 0.22})` });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [walking, size]);

  const S = size;

  return (
    <g transform={`translate(${x}, ${y})`} ref={groupRef}>
      {/* Ground shadow */}
      <ellipse cx={0} cy={S * 0.58} rx={S * 0.3} ry={S * 0.05} fill={shadow} />

      {/* === All body parts in draw-order (back limbs first) === */}
      <g data-id="body">

        {/* ── LEFT ARM (back) ── */}
        <g data-id="left-arm" transform="rotate(0,0,0)">
          <g transform={`translate(${-S * 0.22}, ${-S * 0.38})`}>
            {/* Upper arm */}
            <rect x={-S * 0.055} y={0} width={S * 0.11} height={S * 0.22} rx={S * 0.045} fill={shirt} />
            {/* Forearm */}
            <g data-id="left-forearm" transform={`rotate(0, 0, ${S * 0.22})`}>
              <g transform={`translate(0, ${S * 0.22})`}>
                <rect x={-S * 0.045} y={0} width={S * 0.09} height={S * 0.20} rx={S * 0.04} fill={skin} />
                {/* Hand */}
                <ellipse cx={0} cy={S * 0.21} rx={S * 0.055} ry={S * 0.045} fill={skin} />
              </g>
            </g>
          </g>
        </g>

        {/* ── LEFT LEG (back) ── */}
        <g data-id="left-thigh" transform="rotate(0,0,0)">
          <g transform={`translate(${-S * 0.09}, ${S * 0.12})`}>
            {/* Thigh */}
            <rect x={-S * 0.075} y={0} width={S * 0.15} height={S * 0.28} rx={S * 0.055} fill={pants} />
            {/* Calf */}
            <g data-id="left-calf" transform={`rotate(0, 0, ${S * 0.28})`}>
              <g transform={`translate(0, ${S * 0.28})`}>
                <rect x={-S * 0.065} y={0} width={S * 0.13} height={S * 0.25} rx={S * 0.045} fill={pants} />
                {/* Foot / shoe */}
                <ellipse cx={S * 0.02} cy={S * 0.27} rx={S * 0.095} ry={S * 0.045} fill={shoes} />
              </g>
            </g>
          </g>
        </g>

        {/* ── TORSO ── */}
        <g transform={`translate(0, ${-S * 0.42})`}>
          {/* Shirt body */}
          <rect x={-S * 0.185} y={0} width={S * 0.37} height={S * 0.54} rx={S * 0.09} fill={shirt} />
          {/* Collar V-line */}
          <path
            d={`M ${-S * 0.07} 0 L 0 ${S * 0.1} L ${S * 0.07} 0`}
            fill="none"
            stroke={skin}
            strokeWidth={S * 0.025}
          />
        </g>

        {/* ── NECK ── */}
        <rect x={-S * 0.065} y={-S * 0.52} width={S * 0.13} height={S * 0.12} rx={S * 0.04} fill={skin} />

        {/* ── HEAD ── */}
        <ellipse cx={0} cy={-S * 0.7} rx={S * 0.195} ry={S * 0.215} fill={skin} />
        {/* Hair cap */}
        <ellipse cx={0} cy={-S * 0.82} rx={S * 0.195} ry={S * 0.12} fill={hair} />
        {/* Eyes */}
        <circle cx={-S * 0.07} cy={-S * 0.72} r={S * 0.035} fill="#fff" />
        <circle cx={S * 0.07} cy={-S * 0.72} r={S * 0.035} fill="#fff" />
        <circle cx={-S * 0.07} cy={-S * 0.72} r={S * 0.018} fill="#1a1a2e" />
        <circle cx={S * 0.07} cy={-S * 0.72} r={S * 0.018} fill="#1a1a2e" />
        {/* Mouth */}
        <path
          d={`M ${-S * 0.045} ${-S * 0.655} Q 0 ${-S * 0.625} ${S * 0.045} ${-S * 0.655}`}
          fill="none"
          stroke="#b06060"
          strokeWidth={S * 0.018}
          strokeLinecap="round"
        />

        {/* ── RIGHT LEG (front) ── */}
        <g data-id="right-thigh" transform="rotate(0,0,0)">
          <g transform={`translate(${S * 0.09}, ${S * 0.12})`}>
            {/* Thigh */}
            <rect x={-S * 0.075} y={0} width={S * 0.15} height={S * 0.28} rx={S * 0.055} fill={pants} />
            {/* Calf */}
            <g data-id="right-calf" transform={`rotate(0, 0, ${S * 0.28})`}>
              <g transform={`translate(0, ${S * 0.28})`}>
                <rect x={-S * 0.065} y={0} width={S * 0.13} height={S * 0.25} rx={S * 0.045} fill={pants} />
                {/* Foot / shoe */}
                <ellipse cx={S * 0.02} cy={S * 0.27} rx={S * 0.095} ry={S * 0.045} fill={shoes} />
              </g>
            </g>
          </g>
        </g>

        {/* ── RIGHT ARM (front) ── */}
        <g data-id="right-arm" transform="rotate(0,0,0)">
          <g transform={`translate(${S * 0.22}, ${-S * 0.38})`}>
            {/* Upper arm */}
            <rect x={-S * 0.055} y={0} width={S * 0.11} height={S * 0.22} rx={S * 0.045} fill={shirt} />
            {/* Forearm */}
            <g data-id="right-forearm" transform={`rotate(0, 0, ${S * 0.22})`}>
              <g transform={`translate(0, ${S * 0.22})`}>
                <rect x={-S * 0.045} y={0} width={S * 0.09} height={S * 0.20} rx={S * 0.04} fill={skin} />
                {/* Hand */}
                <ellipse cx={0} cy={S * 0.21} rx={S * 0.055} ry={S * 0.045} fill={skin} />
              </g>
            </g>
          </g>
        </g>

      </g>
    </g>
  );
};
