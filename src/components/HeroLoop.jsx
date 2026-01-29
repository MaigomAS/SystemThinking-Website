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

  const primaryPath = useMemo(() => {
    if (!width || !height) return '';
    return [
      `M ${width * 0.08} ${height * 0.58}`,
      `C ${width * 0.22} ${height * 0.22}, ${width * 0.46} ${height * 0.1}, ${width * 0.6} ${height * 0.34}`,
      `C ${width * 0.72} ${height * 0.5}, ${width * 0.82} ${height * 0.78}, ${width * 0.92} ${height * 0.56}`,
    ].join(' ');
  }, [width, height]);

  const secondaryPath = useMemo(() => {
    if (!width || !height) return '';
    return [
      `M ${width * 0.06} ${height * 0.36}`,
      `C ${width * 0.2} ${height * 0.62}, ${width * 0.36} ${height * 0.94}, ${width * 0.56} ${height * 0.7}`,
      `C ${width * 0.72} ${height * 0.5}, ${width * 0.84} ${height * 0.2}, ${width * 0.94} ${height * 0.32}`,
    ].join(' ');
  }, [width, height]);

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
        <path className="hero-loop__path hero-loop__path--primary" d={primaryPath} />
        <path className="hero-loop__path hero-loop__path--secondary" d={secondaryPath} />
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
