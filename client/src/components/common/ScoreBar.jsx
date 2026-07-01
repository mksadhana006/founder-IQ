/**
 * components/common/ScoreBar.jsx
 * Animated score progress bar.
 */

import { useEffect, useState } from 'react';

const ScoreBar = ({ label, score, color, delay = 0 }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(score), delay + 100);
    return () => clearTimeout(timer);
  }, [score, delay]);

  const getColor = () => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#84cc16';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const barColor = color || getColor();

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-300 font-medium">{label}</span>
        <span className="text-sm font-bold" style={{ color: barColor }}>
          {Math.round(score)}/100
        </span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            backgroundColor: barColor,
            boxShadow: `0 0 8px ${barColor}60`,
          }}
        />
      </div>
    </div>
  );
};

export default ScoreBar;
