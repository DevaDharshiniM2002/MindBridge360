import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wind,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Play,
  Pause,
  CheckCircle2,
  Smile,
  Heart,
  Zap,
  Eye,
  Feather,
  Flame,
  Music,
  Compass,
  Timer,
  ChevronRight,
  Shield,
  Layers,
  Sparkle
} from 'lucide-react';
import { AppLanguage, CompanionConfig } from '../types';
import { CompanionAvatar } from './CompanionAvatar';

interface MindRelaxSessionViewProps {
  companion: CompanionConfig;
  language: AppLanguage;
  onSessionComplete?: (type: string, durationMinutes: number) => void;
}

type RelaxActivityId = 'breathing' | 'bubble-pop' | 'ambient-soundscape' | 'grounding' | 'zen-doodle';

interface RelaxActivity {
  id: RelaxActivityId;
  title: string;
  titleTa?: string;
  titleTanglish?: string;
  subtitle: string;
  duration: string;
  icon: any;
  badge: string;
  color: string;
  bgLight: string;
  darkBg: string;
  category: 'breath' | 'tactile' | 'sound' | 'grounding';
}

const ACTIVITIES: RelaxActivity[] = [
  {
    id: 'breathing',
    title: '4-7-8 Deep Vagus Reset',
    titleTa: '4-7-8 சுவாசப் பயிற்சி',
    titleTanglish: '4-7-8 Deep Breath Pacer',
    subtitle: 'Gentle science-backed breathing loop that triggers your parasympathetic nervous system to rapidly lower exam heart rate.',
    duration: '2 - 5 mins',
    icon: Wind,
    badge: 'Fast Calm',
    color: '#4A8B8D',
    bgLight: '#EAF4F4',
    darkBg: '#152527',
    category: 'breath',
  },
  {
    id: 'bubble-pop',
    title: 'Stress Bubble Burst',
    titleTa: 'மன அழுத்தக் குமிழிகள்',
    titleTanglish: 'Stress Bubble Popper',
    subtitle: 'Tactile, satisfying micro-action to pop away study thoughts, viva anxiety, and physical tension with calming sound tones.',
    duration: '1 - 3 mins',
    icon: Sparkles,
    badge: 'Tactile Relief',
    color: '#E98A72',
    bgLight: '#FDF2EE',
    darkBg: '#2D1D18',
    category: 'tactile',
  },
  {
    id: 'ambient-soundscape',
    title: 'Campus & Rain Soundscape',
    titleTa: 'மழை மற்றும் அமைதி ஒலிகள்',
    titleTanglish: 'Monsoon Chai & Rain Lo-Fi',
    subtitle: 'Generative, customizable relaxing acoustic sound synthesis: gentle Chennai monsoon, hostel fan, temple bells, and soft river flow.',
    duration: 'Self-Paced',
    icon: Music,
    badge: 'Audio Oasis',
    color: '#3B7A57',
    bgLight: '#EBF5EE',
    darkBg: '#13261C',
    category: 'sound',
  },
  {
    id: 'grounding',
    title: '5-4-3-2-1 Sensory Grounding',
    titleTa: '5-4-3-2-1 உணர்வு அமைதி',
    titleTanglish: '5-4-3-2-1 Sensory Reset',
    subtitle: 'Step-by-step interactive mindful anchor to bring your mind back to safety when overthinking late at night.',
    duration: '3 mins',
    icon: Compass,
    badge: 'Anti-Panic',
    color: '#8A5FB2',
    bgLight: '#F5EFFB',
    darkBg: '#251733',
    category: 'grounding',
  },
  {
    id: 'zen-doodle',
    title: 'Zen Sand Kinetic Drawing',
    titleTa: 'மணல் ஓவிய தியானம்',
    titleTanglish: 'Zen Sand Finger Art',
    subtitle: 'Smooth glowing fingertip ripple trails that smoothly dissolve away, calming racing minds before sleep.',
    duration: 'Relax freely',
    icon: Feather,
    badge: 'Kinetic Flow',
    color: '#D97706',
    bgLight: '#FEF3C7',
    darkBg: '#2E1E09',
    category: 'tactile',
  }
];

export const MindRelaxSessionView: React.FC<MindRelaxSessionViewProps> = ({
  companion,
  language,
  onSessionComplete,
}) => {
  const [selectedActivity, setSelectedActivity] = useState<RelaxActivityId>('breathing');
  const [sessionActive, setSessionActive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [completedSessionsCount, setCompletedSessionsCount] = useState(() => {
    try {
      return parseInt(localStorage.getItem('mb_relax_sessions_count') || '3', 10);
    } catch {
      return 3;
    }
  });

  // Haptic Feedback Helper
  const triggerHaptic = (duration = 10) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate?.(duration);
      } catch {}
    }
  };

  // Timer Effect
  useEffect(() => {
    let interval: any;
    if (sessionActive) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive]);

  const handleFinishSession = () => {
    triggerHaptic(30);
    setSessionActive(false);
    const newCount = completedSessionsCount + 1;
    setCompletedSessionsCount(newCount);
    try {
      localStorage.setItem('mb_relax_sessions_count', newCount.toString());
    } catch {}
    if (onSessionComplete) {
      onSessionComplete(selectedActivity, Math.max(1, Math.round(elapsedSeconds / 60)));
    }
    setElapsedSeconds(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner: Mind Oasis / Relaxation Hub */}
      <div className="bg-linear-to-br from-[#4A8B8D] via-[#3B7274] to-[#254F51] text-white p-6 sm:p-8 rounded-[32px] sm:rounded-[36px] shadow-sm relative overflow-hidden">
        {/* Subtle Ambient Shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#F5D5CB]/15 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 bg-white/20 text-[#D1E5E6] rounded-full backdrop-blur-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F5D5CB]" />
                {language === 'ta' ? 'அமைதி மற்றும் தியான மையம்' : language === 'tanglish' ? 'Mind Relax & Reset Hub' : 'Mind Oasis & De-Stress Room'}
              </span>
              <span className="text-[11px] bg-[#E98A72] text-white font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                {completedSessionsCount} Resets Done
              </span>
            </div>

            <h2 className="font-serif italic text-2xl sm:text-3xl text-white tracking-tight">
              {language === 'ta'
                ? 'உங்கள் மனதை அமைதிப்படுத்தும் பயிற்சிகள்'
                : language === 'tanglish'
                ? 'Mind stress-ah relax panna quick activities'
                : 'Pause, Breathe & Center Your Mind'}
            </h2>

            <p className="text-xs sm:text-sm text-[#D1E5E6] max-w-xl leading-relaxed">
              {language === 'ta'
                ? 'தேர்வு பயம், அதிக சிந்தனை அல்லது தூக்கமின்மை ஏற்படும் போது, 2-3 நிமிடங்களில் உங்கள் இதயத் துடிப்பையும் மூளையையும் அமைதிப்படுத்துங்கள்.'
                : language === 'tanglish'
                ? 'Exam tension, viva pressure or late night overthinking irukkum pothu gentle exercises to relax instantly.'
                : 'Science-backed calming micro-sessions curated for student life: rapid vagus nerve reset, kinetic sensory relief, and soothing natural soundscapes.'}
            </p>
          </div>

          {/* Mini Companion Presence in Oasis */}
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 self-start md:self-center shrink-0">
            <CompanionAvatar avatar={companion?.avatar || 'blob'} emotion={sessionActive ? 'breathing' : 'happy'} size="sm" />
            <div>
              <p className="text-xs font-bold text-white">{companion.name}</p>
              <p className="text-[10px] text-[#D1E5E6]">
                {sessionActive ? 'Breathe with me...' : 'Ready when you are'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ACTIVITIES.map((act) => {
          const Icon = act.icon;
          const isSelected = selectedActivity === act.id;
          return (
            <button
              key={act.id}
              onClick={() => {
                triggerHaptic(12);
                setSelectedActivity(act.id);
                setSessionActive(false);
                setElapsedSeconds(0);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                isSelected
                  ? 'bg-[#4A8B8D] text-white border-[#4A8B8D] shadow-sm scale-102'
                  : 'bg-white dark:bg-[#161E20] border-[#E8E4D9] dark:border-[#223034] text-[#7A756D] dark:text-[#9BA3AF] hover:text-[#2D2D2B] dark:hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#4A8B8D]'}`} />
              <span>
                {language === 'ta' && act.titleTa ? act.titleTa : language === 'tanglish' && act.titleTanglish ? act.titleTanglish : act.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Selected Interactive Session Container */}
      <div className="bg-white dark:bg-[#161E20] rounded-[32px] sm:rounded-[36px] border border-[#E8E4D9] dark:border-[#223034] shadow-sm p-4 sm:p-8 relative overflow-hidden transition-all">
        {selectedActivity === 'breathing' && (
          <BreathingExerciseInteractive
            language={language}
            companion={companion}
            sessionActive={sessionActive}
            onToggleSession={() => {
              triggerHaptic(15);
              setSessionActive(!sessionActive);
            }}
            elapsedSeconds={elapsedSeconds}
            onFinish={handleFinishSession}
          />
        )}

        {selectedActivity === 'bubble-pop' && (
          <BubblePopperInteractive
            language={language}
            triggerHaptic={triggerHaptic}
            onSessionDone={handleFinishSession}
          />
        )}

        {selectedActivity === 'ambient-soundscape' && (
          <AmbientSoundscapeInteractive
            language={language}
            triggerHaptic={triggerHaptic}
          />
        )}

        {selectedActivity === 'grounding' && (
          <SensoryGroundingInteractive
            language={language}
            triggerHaptic={triggerHaptic}
            onFinish={handleFinishSession}
          />
        )}

        {selectedActivity === 'zen-doodle' && (
          <ZenSandDrawingInteractive
            language={language}
            triggerHaptic={triggerHaptic}
          />
        )}
      </div>

      {/* Benefits & Tips for Students */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 bg-white dark:bg-[#161E20] rounded-[24px] border border-[#E8E4D9] dark:border-[#223034] space-y-1.5 shadow-2xs">
          <div className="w-8 h-8 rounded-full bg-[#F0EDE4] dark:bg-[#253235] flex items-center justify-center text-[#4A8B8D] dark:text-[#63C1C4]">
            <Zap className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-[#2D2D2B] dark:text-[#F3F6F8]">Before Exam or Viva</h4>
          <p className="text-[11px] sm:text-xs text-[#7A756D] dark:text-[#9BA3AF] leading-relaxed">
            Use 2 minutes of 4-7-8 breathing right outside the hall to lower cortisol and stop hand tremors.
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-[#161E20] rounded-[24px] border border-[#E8E4D9] dark:border-[#223034] space-y-1.5 shadow-2xs">
          <div className="w-8 h-8 rounded-full bg-[#FDF2EE] dark:bg-[#2D1D18] flex items-center justify-center text-[#E98A72]">
            <Heart className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-[#2D2D2B] dark:text-[#F3F6F8]">Late Night Overthinking</h4>
          <p className="text-[11px] sm:text-xs text-[#7A756D] dark:text-[#9BA3AF] leading-relaxed">
            Play Monsoon Rain soundscapes + 5-4-3-2-1 sensory grounding to break repetitive thoughts.
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-[#161E20] rounded-[24px] border border-[#E8E4D9] dark:border-[#223034] space-y-1.5 shadow-2xs">
          <div className="w-8 h-8 rounded-full bg-[#EBF5EE] dark:bg-[#13261C] flex items-center justify-center text-[#3B7A57]">
            <Smile className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-xs sm:text-sm text-[#2D2D2B] dark:text-[#F3F6F8]">Screen Fatigue Reset</h4>
          <p className="text-[11px] sm:text-xs text-[#7A756D] dark:text-[#9BA3AF] leading-relaxed">
            Pop bubble worries or trace the glowing sand ripples for 60 seconds after continuous coding.
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   1. Interactive 4-7-8 Breathing Pacer with Sound Tones & Animation
   ========================================================================= */
interface BreathingProps {
  language: AppLanguage;
  companion: CompanionConfig;
  sessionActive: boolean;
  onToggleSession: () => void;
  elapsedSeconds: number;
  onFinish: () => void;
}

const BreathingExerciseInteractive: React.FC<BreathingProps> = ({
  language,
  companion,
  sessionActive,
  onToggleSession,
  elapsedSeconds,
  onFinish,
}) => {
  const [phaseIndex, setPhaseIndex] = useState<0 | 1 | 2>(0); // 0 = Inhale (4s), 1 = Hold (7s), 2 = Exhale (8s)
  const [phaseCountdown, setPhaseCountdown] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [soundMuted, setSoundMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Audio gentle chime synthesis
  const playTone = (frequency: number, duration: number) => {
    if (soundMuted) return;
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) audioContextRef.current = new AudioContextClass();
      }
      if (!audioContextRef.current) return;
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const osc = audioContextRef.current.createOscillator();
      const gain = audioContextRef.current.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      gain.gain.setValueAtTime(0.08, audioContextRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContextRef.current.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioContextRef.current.destination);

      osc.start();
      osc.stop(audioContextRef.current.currentTime + duration);
    } catch {}
  };

  useEffect(() => {
    let timer: any;
    if (sessionActive) {
      timer = setInterval(() => {
        setPhaseCountdown((prev) => {
          if (prev <= 1) {
            // Transition phase
            if (phaseIndex === 0) {
              // From Inhale (4) -> Hold (7)
              setPhaseIndex(1);
              playTone(520, 1.2);
              return 7;
            } else if (phaseIndex === 1) {
              // From Hold (7) -> Exhale (8)
              setPhaseIndex(2);
              playTone(390, 1.8);
              return 8;
            } else {
              // From Exhale (8) -> Inhale (4)
              setPhaseIndex(0);
              setCompletedCycles((c) => c + 1);
              playTone(440, 1.5);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setPhaseCountdown(4);
      setPhaseIndex(0);
    }
    return () => clearInterval(timer);
  }, [sessionActive, phaseIndex, soundMuted]);

  const getPhaseDetails = () => {
    switch (phaseIndex) {
      case 0:
        return {
          title: language === 'ta' ? 'மூச்சை உள்ளிழுக்கவும் (Inhale)' : language === 'tanglish' ? 'Inhale Deeply (4s)' : 'Breathe In Deeply',
          instruction: 'Fill your lower lungs with fresh air through your nose...',
          color: '#4A8B8D',
          scale: 1.35,
          bgColor: 'bg-[#4A8B8D]',
        };
      case 1:
        return {
          title: language === 'ta' ? 'மூச்சை அடக்கவும் (Hold)' : language === 'tanglish' ? 'Hold Your Breath (7s)' : 'Hold Gently & Relax Shoulders',
          instruction: 'Let oxygen distribute through your bloodstream...',
          color: '#E98A72',
          scale: 1.35,
          bgColor: 'bg-[#E98A72]',
        };
      case 2:
        return {
          title: language === 'ta' ? 'மூச்சை வெளியிடவும் (Exhale)' : language === 'tanglish' ? 'Exhale Slowly Through Mouth (8s)' : 'Slowly Release Through Mouth',
          instruction: 'Gently release all built-up tension and exam anxiety...',
          color: '#3B7A57',
          scale: 0.85,
          bgColor: 'bg-[#3B7A57]',
        };
    }
  };

  const details = getPhaseDetails();

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-4">
      {/* Controls Bar: Sound Toggle & Cycles */}
      <div className="w-full flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#7A756D] dark:text-[#9BA3AF] px-3 py-1 bg-[#F0EDE4] dark:bg-[#253235] rounded-full">
            Cycle: <span className="text-[#4A8B8D] dark:text-[#63C1C4]">{completedCycles + 1}</span>
          </span>
          {sessionActive && (
            <span className="text-xs font-mono font-bold text-[#7A756D] dark:text-[#9BA3AF]">
              {Math.floor(elapsedSeconds / 60)}:{((elapsedSeconds % 60) < 10 ? '0' : '') + (elapsedSeconds % 60)}
            </span>
          )}
        </div>

        <button
          onClick={() => setSoundMuted(!soundMuted)}
          className="p-2 rounded-full border border-[#E8E4D9] dark:border-[#2F3D42] bg-white dark:bg-[#1A2326] text-[#7A756D] dark:text-[#9BA3AF] hover:text-[#4A8B8D] transition-colors cursor-pointer"
          title={soundMuted ? 'Unmute Calming Chimes' : 'Mute Sound'}
        >
          {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#4A8B8D]" />}
        </button>
      </div>

      {/* Main Breathing Orb */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-4">
        {/* Outer Glow Halo Rings */}
        <motion.div
          animate={{
            scale: sessionActive ? (phaseIndex === 0 ? 1.4 : phaseIndex === 1 ? 1.4 : 0.8) : 1,
            opacity: sessionActive ? 0.35 : 0.15,
          }}
          transition={{ duration: phaseIndex === 0 ? 4 : phaseIndex === 1 ? 7 : 8, ease: 'easeInOut' }}
          className={`absolute inset-0 rounded-full ${details.bgColor} blur-2xl`}
        />

        {/* Outer Pulsing Border */}
        <motion.div
          animate={{
            scale: sessionActive ? (phaseIndex === 0 ? 1.25 : phaseIndex === 1 ? 1.25 : 0.85) : 1,
          }}
          transition={{ duration: phaseIndex === 0 ? 4 : phaseIndex === 1 ? 7 : 8, ease: 'easeInOut' }}
          className="absolute inset-4 rounded-full border-2 border-dashed border-[#4A8B8D]/40"
        />

        {/* Central Core Breathing Orb */}
        <motion.div
          animate={{
            scale: sessionActive ? details.scale : 1,
            backgroundColor: sessionActive ? details.color : '#4A8B8D',
          }}
          transition={{
            duration: phaseIndex === 0 ? 4 : phaseIndex === 1 ? 0.8 : 8,
            ease: 'easeInOut',
          }}
          className="w-44 h-44 sm:w-48 sm:h-48 rounded-full shadow-xl flex flex-col items-center justify-center text-white p-4 text-center cursor-pointer select-none"
          onClick={onToggleSession}
        >
          {sessionActive ? (
            <div className="space-y-1">
              <span className="text-4xl font-bold font-serif">{phaseCountdown}</span>
              <p className="text-xs font-bold uppercase tracking-wider opacity-90">
                {phaseIndex === 0 ? 'Inhale' : phaseIndex === 1 ? 'Hold' : 'Exhale'}
              </p>
            </div>
          ) : (
            <div className="space-y-2 flex flex-col items-center">
              <Play className="w-8 h-8 fill-white ml-1" />
              <span className="text-xs font-bold uppercase tracking-wider">Tap to Begin</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Dynamic Subtitles & Guidance */}
      <div className="text-center space-y-1 max-w-sm">
        <h3 className="font-serif italic text-xl font-bold text-[#2D2D2B] dark:text-[#F3F6F8]">
          {sessionActive ? details.title : '4-7-8 Relaxation Loop'}
        </h3>
        <p className="text-xs text-[#7A756D] dark:text-[#9BA3AF] leading-relaxed">
          {sessionActive ? details.instruction : 'Takes only 2 minutes to slow racing heartbeats before presentations or exams.'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 w-full max-w-xs pt-2">
        <button
          onClick={onToggleSession}
          className={`flex-1 py-3 px-6 rounded-full font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
            sessionActive
              ? 'bg-[#F0EDE4] dark:bg-[#253235] text-[#2D2D2B] dark:text-[#F3F6F8] hover:bg-[#E8E4D9]'
              : 'bg-[#4A8B8D] hover:bg-[#376F71] text-white'
          }`}
        >
          {sessionActive ? (
            <>
              <Pause className="w-4 h-4" /> Pause Loop
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" /> Start 4-7-8 Breathing
            </>
          )}
        </button>

        {sessionActive && (
          <button
            onClick={onFinish}
            className="py-3 px-4 bg-[#3B7A57] hover:bg-[#2D6044] text-white rounded-full font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
            title="Complete & Log Reset"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Done</span>
          </button>
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   2. Tactile Stress Bubble Popper with Sound Effects
   ========================================================================= */
interface Bubble {
  id: string;
  label: string;
  size: number;
  x: number;
  y: number;
  popped: boolean;
  color: string;
}

const DEFAULT_WORRIES = [
  'Exam Anxiety',
  'Lab Viva',
  'CGPA Worry',
  'Deadline Stress',
  'Assignment Backlog',
  'Placement Worry',
  'Hostel Homesickness',
  'Comparison',
  'Tired Eyes',
  'Late Submission',
  'Attendance Shortage',
  'Self-Doubt',
];

const BUBBLE_COLORS = ['#4A8B8D', '#E98A72', '#3B7A57', '#8A5FB2', '#D97706', '#D36B51'];

const BubblePopperInteractive: React.FC<{
  language: AppLanguage;
  triggerHaptic: (ms?: number) => void;
  onSessionDone: () => void;
}> = ({ language, triggerHaptic, onSessionDone }) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initBubbles = () => {
    const newBubbles: Bubble[] = DEFAULT_WORRIES.map((worry, idx) => ({
      id: `b-${idx}-${Date.now()}`,
      label: worry,
      size: Math.floor(Math.random() * 20) + 75,
      x: (idx % 4) * 22 + 5 + Math.random() * 5,
      y: Math.floor(idx / 4) * 28 + 8 + Math.random() * 4,
      popped: false,
      color: BUBBLE_COLORS[idx % BUBBLE_COLORS.length],
    }));
    setBubbles(newBubbles);
    setPoppedCount(0);
  };

  useEffect(() => {
    initBubbles();
  }, []);

  const playPopSound = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioClass) audioCtxRef.current = new AudioClass();
      }
      if (!audioCtxRef.current) return;
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = 'triangle';
      const freq = 600 + Math.random() * 400;
      osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtxRef.current.currentTime + 0.12);

      gain.gain.setValueAtTime(0.15, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + 0.13);
    } catch {}
  };

  const handlePop = (id: string) => {
    triggerHaptic(18);
    playPopSound();
    setBubbles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
    setPoppedCount((c) => c + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif italic text-lg sm:text-xl font-bold text-[#2D2D2B] dark:text-[#F3F6F8]">
            {language === 'ta' ? 'அழுத்தக் குமிழிகளை வெடிக்கச் செய்யுங்கள்' : 'Pop & Release College Worries'}
          </h3>
          <p className="text-xs text-[#7A756D] dark:text-[#9BA3AF]">
            Tap on any worry bubble to pop it out of your mind with satisfying feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#4A8B8D] dark:text-[#63C1C4] px-3 py-1 bg-[#F0EDE4] dark:bg-[#253235] rounded-full">
            {poppedCount}/{bubbles.length} Popped
          </span>
          <button
            onClick={() => {
              triggerHaptic(10);
              initBubbles();
            }}
            className="p-2 rounded-full border border-[#E8E4D9] dark:border-[#2F3D42] hover:bg-[#F0EDE4] dark:hover:bg-[#253235] text-[#7A756D] transition-colors cursor-pointer"
            title="Reset All Bubbles"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bubble Playground Field */}
      <div className="relative min-h-[300px] sm:min-h-[360px] bg-[#F9F7F2] dark:bg-[#12191B] rounded-[28px] border border-[#E8E4D9] dark:border-[#223034] p-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4 overflow-hidden select-none">
        {bubbles.map((b) => {
          if (b.popped) {
            return (
              <motion.div
                key={b.id}
                initial={{ scale: 1 }}
                animate={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-16 h-16 rounded-full border-2 border-dashed border-[#E8E4D9] dark:border-[#2F3D42] flex items-center justify-center text-emerald-500 opacity-40"
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            );
          }
          return (
            <motion.button
              key={b.id}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => handlePop(b.id)}
              style={{
                backgroundColor: `${b.color}20`,
                borderColor: b.color,
              }}
              className="p-3 sm:p-4 rounded-full border-2 text-center flex flex-col items-center justify-center shadow-xs cursor-pointer active:scale-90 transition-all"
            >
              <span
                style={{ color: b.color }}
                className="text-[11px] sm:text-xs font-bold leading-tight max-w-[90px]"
              >
                {b.label}
              </span>
              <span className="text-[9px] text-[#7A756D] dark:text-[#9BA3AF] mt-0.5">Pop 💥</span>
            </motion.button>
          );
        })}
      </div>

      {poppedCount >= 6 && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Great job letting those tensions go! Your mind is lighter now.</span>
          </div>
          <button
            onClick={onSessionDone}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold shadow-xs cursor-pointer"
          >
            Finish Reset
          </button>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   3. Generative Ambient Campus Soundscapes (Monsoon, Tea Stall, Waves)
   ========================================================================= */
interface SoundTrack {
  id: string;
  name: string;
  nameTa?: string;
  nameTanglish?: string;
  desc: string;
  icon: any;
  color: string;
}

const SOUND_TRACKS: SoundTrack[] = [
  {
    id: 'monsoon',
    name: 'Chennai Monsoon Rain',
    nameTa: 'மழைச்சாரல்',
    nameTanglish: 'Monsoon Rain & Thunder',
    desc: 'Gentle raindrops falling on hostel roof tiles with rhythmic white-noise frequencies.',
    icon: Wind,
    color: '#4A8B8D',
  },
  {
    id: 'breeze',
    name: 'Hostel Night Breeze & Fan',
    nameTa: 'இரவு தென்றல்',
    nameTanglish: 'Hostel Room Fan & Breeze',
    desc: 'Calming constant binaural whirring that masks distracting roommate noises.',
    icon: Feather,
    color: '#3B7A57',
  },
  {
    id: 'temple',
    name: 'Peaceful Singing Bowl & Bells',
    nameTa: 'அமைதி மணி ஓசை',
    nameTanglish: 'Meditation Bowl Resonance',
    desc: 'Deep 432Hz harmonic tones that naturally slow racing brain waves.',
    icon: Sparkle,
    color: '#8A5FB2',
  },
  {
    id: 'waves',
    name: 'Marina Beach Ocean Waves',
    nameTa: 'கடல் அலைகள்',
    nameTanglish: 'Marina Beach Sea Waves',
    desc: 'Deep rhythmic tidal surges for deep concentration and restful sleep.',
    icon: Compass,
    color: '#E98A72',
  },
];

const AmbientSoundscapeInteractive: React.FC<{
  language: AppLanguage;
  triggerHaptic: (ms?: number) => void;
}> = ({ language, triggerHaptic }) => {
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodesRef = useRef<{ osc?: OscillatorNode; noise?: AudioNode; gain?: GainNode } | null>(null);

  const stopAudio = () => {
    try {
      if (soundNodesRef.current) {
        if (soundNodesRef.current.osc) {
          soundNodesRef.current.osc.stop();
          soundNodesRef.current.osc.disconnect();
        }
        if (soundNodesRef.current.gain) {
          soundNodesRef.current.gain.disconnect();
        }
        soundNodesRef.current = null;
      }
    } catch {}
  };

  const startTrack = (trackId: string) => {
    stopAudio();
    try {
      const AudioClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioClass) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioClass();
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const masterGain = audioCtxRef.current.createGain();
      masterGain.gain.setValueAtTime(volume * 0.15, audioCtxRef.current.currentTime);
      masterGain.connect(audioCtxRef.current.destination);

      if (trackId === 'monsoon' || trackId === 'breeze' || trackId === 'waves') {
        // Pink / White Noise Generator for rain / breeze
        const bufferSize = audioCtxRef.current.sampleRate * 2;
        const noiseBuffer = audioCtxRef.current.createBuffer(1, bufferSize, audioCtxRef.current.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.08;
        }

        const whiteNoise = audioCtxRef.current.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = audioCtxRef.current.createBiquadFilter();
        filter.type = trackId === 'monsoon' ? 'lowpass' : trackId === 'waves' ? 'bandpass' : 'highpass';
        filter.frequency.setValueAtTime(trackId === 'monsoon' ? 800 : 400, audioCtxRef.current.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();

        soundNodesRef.current = { gain: masterGain, noise: whiteNoise };
      } else if (trackId === 'temple') {
        // 432Hz Pure Zen Harmonic Oscillator
        const osc = audioCtxRef.current.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, audioCtxRef.current.currentTime);

        const lfo = audioCtxRef.current.createOscillator();
        lfo.frequency.setValueAtTime(0.2, audioCtxRef.current.currentTime);
        const lfoGain = audioCtxRef.current.createGain();
        lfoGain.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime);
        lfo.connect(lfoGain.gain);

        osc.connect(masterGain);
        osc.start();
        lfo.start();

        soundNodesRef.current = { osc, gain: masterGain };
      }
    } catch (e) {
      console.warn('Audio synthesis note:', e);
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const handleToggleTrack = (trackId: string) => {
    triggerHaptic(15);
    if (activeTrack === trackId) {
      stopAudio();
      setActiveTrack(null);
    } else {
      setActiveTrack(trackId);
      startTrack(trackId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-serif italic text-lg sm:text-xl font-bold text-[#2D2D2B] dark:text-[#F3F6F8]">
            {language === 'ta' ? 'அமைதி ஒலிச்சூழல்' : 'Generative Ambient Soundscapes'}
          </h3>
          <p className="text-xs text-[#7A756D] dark:text-[#9BA3AF]">
            Continuous relaxing acoustic frequencies synthesised in real time for studying or falling asleep.
          </p>
        </div>

        {/* Master Volume Slider */}
        <div className="flex items-center gap-2 bg-[#F0EDE4] dark:bg-[#253235] px-3 py-1.5 rounded-full self-start sm:self-auto">
          <Volume2 className="w-4 h-4 text-[#4A8B8D] dark:text-[#63C1C4]" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setVolume(v);
              if (soundNodesRef.current?.gain && audioCtxRef.current) {
                soundNodesRef.current.gain.gain.setValueAtTime(v * 0.15, audioCtxRef.current.currentTime);
              }
            }}
            className="w-20 accent-[#4A8B8D]"
          />
        </div>
      </div>

      {/* Grid of Soundscapes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SOUND_TRACKS.map((t) => {
          const Icon = t.icon;
          const isPlaying = activeTrack === t.id;
          return (
            <div
              key={t.id}
              onClick={() => handleToggleTrack(t.id)}
              className={`p-5 rounded-[24px] border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isPlaying
                  ? 'border-[#4A8B8D] bg-[#F0EDE4] dark:bg-[#253235] shadow-md'
                  : 'border-[#E8E4D9] dark:border-[#223034] bg-white dark:bg-[#1A2326] hover:border-[#4A8B8D]/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: `${t.color}20`, color: t.color }}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#2D2D2B] dark:text-[#F3F6F8]">
                      {language === 'ta' && t.nameTa ? t.nameTa : t.name}
                    </h4>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#4A8B8D] dark:text-[#63C1C4]">
                      {isPlaying ? 'Playing Ambient...' : 'Tap to Play'}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isPlaying ? 'bg-[#4A8B8D] text-white' : 'bg-[#F9F7F2] dark:bg-[#253235] text-[#7A756D]'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                </div>
              </div>

              <p className="text-xs text-[#7A756D] dark:text-[#9BA3AF] leading-relaxed">
                {t.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* =========================================================================
   4. 5-4-3-2-1 Sensory Grounding Walkthrough
   ========================================================================= */
const GROUNDING_STEPS = [
  {
    step: 5,
    title: '5 Things You Can SEE Around You',
    instruction: 'Look around your room or desk right now: a water bottle, study lamp, notebook, hostel fan, your shoes...',
    color: '#4A8B8D',
    icon: Eye,
  },
  {
    step: 4,
    title: '4 Things You Can PHYSICALLY TOUCH',
    instruction: 'Feel the fabric of your shirt, the cool desk surface, the phone screen under your fingers, your feet on the ground...',
    color: '#E98A72',
    icon: Feather,
  },
  {
    step: 3,
    title: '3 Things You Can HEAR',
    instruction: 'Listen carefully: the hum of the AC/fan, distant vehicles on the campus road, birds, a clock ticking...',
    color: '#3B7A57',
    icon: Volume2,
  },
  {
    step: 2,
    title: '2 Things You Can SMELL',
    instruction: 'Notice the smell of fresh tea, rain, books, or take a deep grounding breath through your nose...',
    color: '#8A5FB2',
    icon: Wind,
  },
  {
    step: 1,
    title: '1 Thing You Appreciate About Yourself',
    instruction: 'Silently acknowledge: "I survived hard exams before, and I am doing my absolute best today."',
    color: '#D97706',
    icon: Heart,
  },
];

const SensoryGroundingInteractive: React.FC<{
  language: AppLanguage;
  triggerHaptic: (ms?: number) => void;
  onFinish: () => void;
}> = ({ language, triggerHaptic, onFinish }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const current = GROUNDING_STEPS[currentStepIdx];
  const Icon = current.icon;

  const handleNext = () => {
    triggerHaptic(20);
    if (currentStepIdx < GROUNDING_STEPS.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      onFinish();
    }
  };

  const handlePrev = () => {
    triggerHaptic(10);
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto py-2">
      {/* Step Indicators */}
      <div className="flex items-center justify-between gap-2">
        {GROUNDING_STEPS.map((s, idx) => (
          <div
            key={s.step}
            className={`flex-1 h-2 rounded-full transition-all ${
              idx <= currentStepIdx ? 'bg-[#4A8B8D]' : 'bg-[#E8E4D9] dark:bg-[#253235]'
            }`}
          />
        ))}
      </div>

      {/* Main Grounding Card */}
      <motion.div
        key={currentStepIdx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="p-6 sm:p-8 bg-[#F9F7F2] dark:bg-[#1C2527] rounded-[32px] border border-[#E8E4D9] dark:border-[#2F3D42] text-center space-y-4 shadow-sm"
      >
        <div
          style={{ backgroundColor: `${current.color}25`, color: current.color }}
          className="w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-xs"
        >
          <Icon className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span
            style={{ color: current.color }}
            className="text-xs font-bold uppercase tracking-widest block"
          >
            Step {currentStepIdx + 1} of 5
          </span>
          <h3 className="font-serif italic text-xl sm:text-2xl font-bold text-[#2D2D2B] dark:text-[#F3F6F8]">
            {current.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#7A756D] dark:text-[#9BA3AF] leading-relaxed max-w-md mx-auto">
            {current.instruction}
          </p>
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3">
        {currentStepIdx > 0 && (
          <button
            onClick={handlePrev}
            className="py-3 px-5 bg-[#F0EDE4] dark:bg-[#253235] text-[#2D2D2B] dark:text-[#F3F6F8] rounded-full font-bold text-xs cursor-pointer hover:bg-[#E8E4D9]"
          >
            Back
          </button>
        )}

        <button
          onClick={handleNext}
          className="flex-1 py-3 px-6 bg-[#4A8B8D] hover:bg-[#376F71] text-white rounded-full font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{currentStepIdx === GROUNDING_STEPS.length - 1 ? 'Complete Grounding Reset' : 'I see/feel them → Next Step'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/* =========================================================================
   5. Zen Sand Glowing Canvas Finger Flow
   ========================================================================= */
const ZenSandDrawingInteractive: React.FC<{
  language: AppLanguage;
  triggerHaptic: (ms?: number) => void;
}> = ({ language, triggerHaptic }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPI canvas
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = 320 * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Initial Warm Zen Sand Base
    ctx.fillStyle = '#22282A';
    ctx.fillRect(0, 0, rect.width, 320);

    // Draw peaceful ripple rings
    ctx.strokeStyle = '#4A8B8D25';
    ctx.lineWidth = 2;
    for (let r = 20; r < 200; r += 25) {
      ctx.beginPath();
      ctx.arc(rect.width / 2, 160, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    triggerHaptic(8);
    drawRipple(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    drawRipple(e);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const drawRipple = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#63C1C4';
    ctx.fillStyle = '#63C1C4';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();

    // Subtle glowing wave around finger touch
    ctx.strokeStyle = '#F5D5CB50';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  const handleClear = () => {
    triggerHaptic(12);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#22282A';
    ctx.fillRect(0, 0, rect.width, 320);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif italic text-lg sm:text-xl font-bold text-[#2D2D2B] dark:text-[#F3F6F8]">
            {language === 'ta' ? 'ஒளிரும் மணல் தியானம்' : 'Kinetic Glowing Sand Canvas'}
          </h3>
          <p className="text-xs text-[#7A756D] dark:text-[#9BA3AF]">
            Drag your finger or cursor slowly across the dark sand to trace peaceful glowing fluid lines.
          </p>
        </div>

        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F0EDE4] dark:bg-[#253235] hover:bg-[#E8E4D9] text-[#2D2D2B] dark:text-[#F3F6F8] rounded-full text-xs font-bold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Smooth Sand</span>
        </button>
      </div>

      <div className="w-full rounded-[28px] overflow-hidden border border-[#E8E4D9] dark:border-[#2F3D42] shadow-inner touch-none bg-[#22282A]">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ width: '100%', height: '320px', display: 'block', cursor: 'crosshair' }}
        />
      </div>
    </div>
  );
};
