import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw } from './icons';
import { useLocalization } from '../App';
import { triggerHaptic } from '../utils/native';
import { formatDuration } from '../utils/time';

interface FocusTimerProps {
  duration: string; // e.g. "1h 30m" or "45m"
  activity: string;
  onClose: () => void;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ duration, activity, onClose }) => {
  const { t } = useLocalization();
  
  // Parse duration string to seconds
  const parseDurationToSeconds = (dur: string): number => {
    let totalMinutes = 0;
    const hoursMatch = dur.match(/(\d+)h/);
    const minutesMatch = dur.match(/(\d+)m/);
    
    if (hoursMatch) totalMinutes += parseInt(hoursMatch[1]) * 60;
    if (minutesMatch) totalMinutes += parseInt(minutesMatch[1]);
    
    return totalMinutes * 60;
  };

  const [timeLeft, setTimeLeft] = useState(() => parseDurationToSeconds(duration));
  const [isActive, setIsActive] = useState(false);
  const [initialTime] = useState(() => parseDurationToSeconds(duration));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            triggerHaptic('heavy');
            // Could play a sound here
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    triggerHaptic('medium');
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    triggerHaptic('medium');
    setIsActive(false);
    setTimeLeft(initialTime);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center p-6 animate-fade-in backdrop-blur-sm">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white p-2"
      >
        <X className="w-8 h-8" />
      </button>

      <div className="text-center space-y-8 w-full max-w-md">
        <h2 className="text-2xl font-medium text-white/90">{t('focusMode')}</h2>
        <h1 className="text-3xl font-bold text-white truncate px-4">{activity}</h1>
        
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          {/* Circular Progress */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-gray-700"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              className="text-blue-500 transition-all duration-1000 ease-linear"
              strokeLinecap="round"
            />
          </svg>
          
          <div className="text-5xl font-mono font-bold text-white tabular-nums">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={toggleTimer}
            className="w-16 h-16 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95"
          >
            {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>
          
          <button
            onClick={resetTimer}
            className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;
