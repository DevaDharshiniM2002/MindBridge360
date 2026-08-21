import React from 'react';
import { motion } from 'motion/react';
import { CompanionAvatarType, CompanionEmotion } from '../types';

interface CompanionAvatarProps {
  avatar: CompanionAvatarType;
  emotion?: CompanionEmotion;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isAnimated?: boolean;
}

export const CompanionAvatar: React.FC<CompanionAvatarProps> = ({
  avatar = 'blob',
  emotion = 'happy',
  size = 'md',
  className = '',
  isAnimated = true,
}) => {
  const safeAvatar = avatar || 'blob';
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44',
  };

  // Variants for animations based on emotion
  const getAnimationVariants = () => {
    if (!isAnimated) return {};

    switch (emotion) {
      case 'happy':
        return {
          animate: {
            y: [0, -6, 0],
            rotate: [0, 2, -2, 0],
            transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
          },
        };
      case 'celebrating':
        return {
          animate: {
            y: [0, -14, 0],
            scale: [1, 1.1, 1],
            rotate: [0, -6, 6, 0],
            transition: { repeat: Infinity, duration: 1.2, ease: 'easeOut' },
          },
        };
      case 'concerned':
        return {
          animate: {
            rotate: [-2, 2, -2],
            scale: [0.98, 1, 0.98],
            transition: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
          },
        };
      case 'listening':
        return {
          animate: {
            scale: [1, 1.05, 1],
            rotate: [0, 3, 0],
            transition: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
          },
        };
      case 'sleepy':
        return {
          animate: {
            y: [0, 3, 0],
            scale: [1, 0.97, 1],
            transition: { repeat: Infinity, duration: 5, ease: 'easeInOut' },
          },
        };
      case 'breathing':
        return {
          animate: {
            scale: [0.9, 1.15, 0.9],
            transition: { repeat: Infinity, duration: 6, ease: 'easeInOut' },
          },
        };
      default:
        return {
          animate: {
            y: [0, -4, 0],
            transition: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' },
          },
        };
    }
  };

  // Eyes rendering based on emotion
  const renderEyes = (cx1: number, cx2: number, cy: number, radius = 4) => {
    if (emotion === 'sleepy') {
      return (
        <g stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d={`M ${cx1 - 5} ${cy} Q ${cx1} ${cy + 4} ${cx1 + 5} ${cy}`} />
          <path d={`M ${cx2 - 5} ${cy} Q ${cx2} ${cy + 4} ${cx2 + 5} ${cy}`} />
        </g>
      );
    }
    if (emotion === 'happy' || emotion === 'celebrating') {
      return (
        <g stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d={`M ${cx1 - 5} ${cy} Q ${cx1} ${cy - 5} ${cx1 + 5} ${cy}`} />
          <path d={`M ${cx2 - 5} ${cy} Q ${cx2} ${cy - 5} ${cx2 + 5} ${cy}`} />
        </g>
      );
    }
    if (emotion === 'concerned') {
      return (
        <g>
          {/* Eyebrows angled with care */}
          <path d={`M ${cx1 - 6} ${cy - 7} L ${cx1 + 4} ${cy - 10}`} stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          <path d={`M ${cx2 + 6} ${cy - 7} L ${cx2 - 4} ${cy - 10}`} stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          <circle cx={cx1} cy={cy} r={radius} fill="#1e293b" />
          <circle cx={cx2} cy={cy} r={radius} fill="#1e293b" />
          <circle cx={cx1 - 1.5} cy={cy - 1.5} r={radius / 2.5} fill="#ffffff" />
          <circle cx={cx2 - 1.5} cy={cy - 1.5} r={radius / 2.5} fill="#ffffff" />
        </g>
      );
    }
    if (emotion === 'listening') {
      return (
        <g>
          <circle cx={cx1} cy={cy} r={radius * 1.2} fill="#0f766e" />
          <circle cx={cx2} cy={cy} r={radius * 1.2} fill="#0f766e" />
          <circle cx={cx1 - 2} cy={cy - 2} r={radius / 2} fill="#ffffff" />
          <circle cx={cx2 - 2} cy={cy - 2} r={radius / 2} fill="#ffffff" />
          <circle cx={cx1 + 1} cy={cy + 1} r={radius / 3.5} fill="#ffffff" />
          <circle cx={cx2 + 1} cy={cy + 1} r={radius / 3.5} fill="#ffffff" />
        </g>
      );
    }

    // Default neutral/curious
    return (
      <g>
        <circle cx={cx1} cy={cy} r={radius} fill="#1e293b" />
        <circle cx={cx2} cy={cy} r={radius} fill="#1e293b" />
        <circle cx={cx1 - 1.5} cy={cy - 1.5} r={radius / 2.5} fill="#ffffff" />
        <circle cx={cx2 - 1.5} cy={cy - 1.5} r={radius / 2.5} fill="#ffffff" />
      </g>
    );
  };

  // Mouth rendering
  const renderMouth = (cx: number, cy: number) => {
    if (emotion === 'celebrating' || emotion === 'happy') {
      return (
        <path
          d={`M ${cx - 7} ${cy} Q ${cx} ${cy + 8} ${cx + 7} ${cy}`}
          stroke="#1e293b"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="#f43f5e"
        />
      );
    }
    if (emotion === 'concerned') {
      return (
        <path
          d={`M ${cx - 5} ${cy + 4} Q ${cx} ${cy + 1} ${cx + 5} ${cy + 4}`}
          stroke="#1e293b"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      );
    }
    if (emotion === 'listening') {
      return (
        <circle cx={cx} cy={cy + 2} r="3" fill="#1e293b" opacity="0.8" />
      );
    }
    // Default gentle smile
    return (
      <path
        d={`M ${cx - 5} ${cy + 1} Q ${cx} ${cy + 5} ${cx + 5} ${cy + 1}`}
        stroke="#1e293b"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    );
  };

  // Cheeks
  const renderCheeks = (x1: number, x2: number, y: number) => (
    <g opacity="0.65">
      <ellipse cx={x1} cy={y} rx="6" ry="3.5" fill="#fb7185" />
      <ellipse cx={x2} cy={y} rx="6" ry="3.5" fill="#fb7185" />
    </g>
  );

  return (
    <motion.div
      {...getAnimationVariants()}
      className={`relative inline-flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}
    >
      {/* 1. SOFT BLOB CREATURE (Default) */}
      {(safeAvatar === 'blob' || (safeAvatar !== 'otter' && safeAvatar !== 'sprout' && safeAvatar !== 'owl')) && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#77B9BB" />
              <stop offset="60%" stopColor="#4A8B8D" />
              <stop offset="100%" stopColor="#316365" />
            </linearGradient>
            <linearGradient id="blobBelly" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D1E5E6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#A8D4D6" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          {/* Main Blob Body */}
          <path
            d="M 50 14 C 74 14, 88 32, 86 56 C 84 80, 68 88, 50 88 C 32 88, 16 80, 14 56 C 12 32, 26 14, 50 14 Z"
            fill="url(#blobGrad)"
          />
          {/* Belly patch */}
          <ellipse cx="50" cy="62" rx="22" ry="16" fill="url(#blobBelly)" />
          {/* Cheeks */}
          {renderCheeks(32, 68, 56)}
          {/* Eyes */}
          {renderEyes(38, 62, 50, 4)}
          {/* Mouth */}
          {renderMouth(50, 56)}
          {/* Little Sprout/Antenna on top */}
          <path
            d="M 50 16 C 50 8, 44 4, 38 7 C 43 9, 47 13, 49 16 Z"
            fill="#F5D5CB"
          />
          <path
            d="M 50 16 C 50 7, 56 3, 62 6 C 57 8, 53 12, 51 16 Z"
            fill="#E98A72"
          />
          {/* Party Hat when celebrating */}
          {emotion === 'celebrating' && (
            <polygon points="50,2 40,20 60,20" fill="#E98A72" />
          )}
          {/* Headphones when listening */}
          {emotion === 'listening' && (
            <g>
              <path d="M 22 52 C 22 28, 78 28, 78 52" stroke="#E98A72" strokeWidth="4" fill="none" strokeLinecap="round" />
              <rect x="15" y="44" width="9" height="18" rx="4" fill="#D36B51" />
              <rect x="76" y="44" width="9" height="18" rx="4" fill="#D36B51" />
            </g>
          )}
        </svg>
      )}

      {/* 2. GENTLE OTTER */}
      {safeAvatar === 'otter' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id="otterBrown" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
          {/* Ears */}
          <circle cx="28" cy="30" r="10" fill="#92400e" />
          <circle cx="28" cy="30" r="6" fill="#fde68a" />
          <circle cx="72" cy="30" r="10" fill="#92400e" />
          <circle cx="72" cy="30" r="6" fill="#fde68a" />
          {/* Head & Body */}
          <ellipse cx="50" cy="55" rx="34" ry="32" fill="url(#otterBrown)" />
          {/* Snout patch */}
          <ellipse cx="50" cy="58" rx="20" ry="14" fill="#fef3c7" />
          {/* Nose */}
          <ellipse cx="50" cy="53" rx="4.5" ry="3.5" fill="#1e293b" />
          {/* Cheeks */}
          {renderCheeks(30, 70, 56)}
          {/* Eyes */}
          {renderEyes(38, 62, 46, 3.8)}
          {/* Mouth */}
          {renderMouth(50, 60)}
          {/* Paws resting */}
          <ellipse cx="38" cy="78" rx="8" ry="6" fill="#92400e" />
          <ellipse cx="62" cy="78" rx="8" ry="6" fill="#92400e" />
        </svg>
      )}

      {/* 3. GLOWING SPROUT */}
      {safeAvatar === 'sprout' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          {/* Leaves on top */}
          <path
            d="M 50 45 C 32 30, 20 40, 32 50 C 40 52, 48 48, 50 45 Z"
            fill="url(#leafGrad)"
          />
          <path
            d="M 50 45 C 68 30, 80 40, 68 50 C 60 52, 52 48, 50 45 Z"
            fill="url(#leafGrad)"
          />
          <path d="M 50 45 L 50 56" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
          {/* Clay Pot (The character body) */}
          <path
            d="M 28 54 L 72 54 L 66 86 C 65 89, 35 89, 34 86 Z"
            fill="url(#potGrad)"
          />
          {/* Pot Rim */}
          <rect x="24" y="50" width="52" height="7" rx="3.5" fill="#fdba74" />
          {/* Cheeks */}
          {renderCheeks(36, 64, 70)}
          {/* Eyes */}
          {renderEyes(40, 60, 65, 3.5)}
          {/* Mouth */}
          {renderMouth(50, 71)}
        </svg>
      )}

      {/* 4. LITTLE OWL */}
      {safeAvatar === 'owl' && (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id="owlBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4338ca" />
            </linearGradient>
          </defs>
          {/* Feather tufts / ears */}
          <polygon points="30,34 22,18 42,26" fill="#3730a3" />
          <polygon points="70,34 78,18 58,26" fill="#3730a3" />
          {/* Body */}
          <ellipse cx="50" cy="56" rx="33" ry="31" fill="url(#owlBlue)" />
          {/* Belly */}
          <ellipse cx="50" cy="65" rx="18" ry="16" fill="#e0e7ff" />
          {/* Eye rings */}
          <circle cx="38" cy="46" r="12" fill="#ffffff" />
          <circle cx="62" cy="46" r="12" fill="#ffffff" />
          {/* Eyes */}
          {renderEyes(38, 62, 46, 4.5)}
          {/* Beak */}
          <polygon points="50,48 46,55 54,55" fill="#f59e0b" />
          {/* Cheeks */}
          {renderCheeks(28, 72, 56)}
        </svg>
      )}
    </motion.div>
  );
};
