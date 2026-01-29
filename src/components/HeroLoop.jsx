import { useEffect, useId, useMemo, useRef, useState } from 'react';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    handleChange();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
}

function HeroLoop({ signals, reducedMotion }) {
  const containerRef = useRef(null);
  const gradientId = useId();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const isReduced = reducedMotion ?? prefersReducedMotion;

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const { width, height } = size;
  const minDim = Math.max(1, Math.min(width, height));
  const area = width * height;

  const nodeCount = clamp(Math.round(area / 45000), 5, 10);
  const baseNodes = useMemo(
    () => [
      { kind: 'tech', x: 0.2, y: 0.3, scale: 1 },
      { kind: 'human', x: 0.5, y: 0.55, scale: 1.2 },
      { kind: 'system', x: 0.78, y: 0.38, scale: 1 },
      { kind: 'tech', x: 0.86, y: 0.68, scale: 0.9 },
      { kind: 'human', x: 0.36, y: 0.72, scale: 0.85 },
    ],
    [],
  );

  const nodes = useMemo(() => {
    const extraCount = Math.max(0, nodeCount - baseNodes.length);
    const generated = Array.from({ length: extraCount }, (_, index) => {
      const ratio = (index + 1) / (extraCount + 1);
      const x = 0.18 + 0.64 * ratio;
      const y = 0.22 + 0.5 * Math.sin((ratio + 0.2) * Math.PI);
      return {
        kind: index % 3 === 0 ? 'tech' : index % 3 === 1 ? 'human' : 'system',
        x,
        y,
        scale: 0.75,
      };
    });
    return [...baseNodes, ...generated];
  }, [baseNodes, nodeCount]);

  const buildWavePath = useMemo(() => {
    if (!width || !height) return () => '';
    const points = clamp(Math.round(width / 140), 6, 12);
    return (amplitude, offsetY, phase) => {
      const step = width / (points - 1);
      const pathParts = [];
      for (let index = 0; index < points; index += 1) {
        const x = step * index;
        const progress = (index / (points - 1)) * Math.PI * 2;
        const y = height * offsetY + Math.sin(progress + phase) * amplitude;
        if (index === 0) {
          pathParts.push(`M ${x} ${y}`);
        } else {
          const prevX = x - step / 2;
          const prevProgress = ((index - 0.5) / (points - 1)) * Math.PI * 2;
          const controlY = height * offsetY + Math.sin(prevProgress + phase) * amplitude;
          pathParts.push(`Q ${prevX} ${controlY} ${x} ${y}`);
        }
      }
      return pathParts.join(' ');
    };
  }, [width, height]);

  const wavePaths = useMemo(() => {
    if (!width || !height) return [];
    const amplitudeBase = minDim * 0.1;
    return [
      buildWavePath(amplitudeBase * 0.95, 0.6, 0),
      buildWavePath(amplitudeBase * 1.15, 0.5, Math.PI / 2),
      buildWavePath(amplitudeBase * 0.8, 0.7, Math.PI * 1.2),
      buildWavePath(amplitudeBase * 0.6, 0.42, Math.PI * 1.8),
      buildWavePath(amplitudeBase * 0.5, 0.32, Math.PI * 2.4),
    ];
  }, [buildWavePath, minDim, width, height]);

  const sparkCount = clamp(Math.round(area / 52000), 14, 36);
  const sparks = useMemo(
    () =>
      Array.from({ length: sparkCount }, (_, index) => {
        const seed = Math.sin(index * 2.17) * 10000;
        const x = (seed - Math.floor(seed)) * 0.92 + 0.04;
        const ySeed = Math.sin((index + 3) * 3.11) * 10000;
        const y = (ySeed - Math.floor(ySeed)) * 0.74 + 0.13;
        const radius = clamp(minDim * (0.004 + (index % 5) * 0.0012), 2.2, 5.5);
        const opacity = 0.25 + (index % 4) * 0.12;
        return { x, y, radius, opacity };
      }),
    [sparkCount, minDim],
  );

  const pulseOneSize = clamp(minDim * 0.38, 160, 280);
  const pulseTwoSize = clamp(minDim * 0.32, 140, 240);

  return (
    <div
      className={`hero-loop ${isReduced ? 'hero-loop--reduced' : ''}`}
      aria-hidden="true"
      ref={containerRef}
      style={{
        '--hero-loop-pulse-one': `${pulseOneSize}px`,
        '--hero-loop-pulse-two': `${pulseTwoSize}px`,
        '--hero-loop-opacity': isReduced ? 0.65 : 0.75,
      }}
    >
      <svg
        className="hero-loop__svg"
        viewBox={`0 0 ${width || 1} ${height || 1}`}
        preserveAspectRatio="none"
        role="presentation"
        style={{ '--hero-loop-gradient': `url(#loopGradient-${gradientId})` }}
      >
        <defs>
          <linearGradient id={`loopGradient-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7ae7ff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#7c6aff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#f58bff" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        {wavePaths.map((path, index) => (
          <path
            key={`wave-${index}`}
            className={`hero-loop__path hero-loop__path--wave hero-loop__path--wave-${index + 1}`}
            d={path}
          />
        ))}
        {sparks.map((spark, index) => (
          <circle
            key={`spark-${index}`}
            className="hero-loop__spark"
            cx={width * spark.x}
            cy={height * spark.y}
            r={spark.radius}
            style={{ opacity: spark.opacity }}
          />
        ))}
        {nodes.map((node, index) => {
          const radius = clamp(minDim * 0.018 * node.scale, 6, 14);
          return (
            <circle
              key={`${node.kind}-${index}`}
              className={`hero-loop__node hero-loop__node--${node.kind}`}
              cx={width * node.x}
              cy={height * node.y}
              r={radius}
            />
          );
        })}
      </svg>
      <div className="hero-loop__pulse hero-loop__pulse--one" />
      <div className="hero-loop__pulse hero-loop__pulse--two" />
      <div className="hero-loop__signals">
        <span className="hero-loop__signal hero-loop__signal--primary">{signals.primary}</span>
        <span className="hero-loop__signal hero-loop__signal--secondary">{signals.secondary}</span>
      </div>
    </div>
  );
}

export default HeroLoop;
