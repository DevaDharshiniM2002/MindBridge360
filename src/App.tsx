import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Heart,
  TrendingUp,
  MessageSquare,
  UserCheck,
  Languages,
  ShieldCheck,
  Plus,
  Sliders,
  Bell,
  Download,
  AlertCircle,
  Clock,
  Compass,
  Smile,
  Shield,
  Sun,
  Moon,
  Smartphone,
  Maximize2,
  Minimize2,
  Wifi,
  Battery,
  PhoneCall,
  Wind,
  Mic,
  Settings,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import {
  UserRole,
  AppLanguage,
  CompanionConfig,
  CheckinData,
  PeerPost,
  PeerReply,
  FutureMessage,
  CounsellorBooking,
} from './types';
import {
  DEFAULT_COMPANION,
  MOCK_CHECKINS,
  MOCK_PEER_POSTS,
  MOCK_FUTURE_MESSAGES,
  I18N_TEXT,
} from './data/mockData';
import { CrisisBar } from './components/CrisisBar';
import { OnboardingModal } from './components/OnboardingModal';
import { CompanionCustomizer } from './components/CompanionCustomizer';
import { CompanionAvatar } from './components/CompanionAvatar';
import { CompanionChatDrawer } from './components/CompanionChatDrawer';
import { CheckinView } from './components/CheckinView';
import { HomeInsightsView } from './components/HomeInsightsView';
import { PeerSupportView } from './components/PeerSupportView';
import { TalkToSomeoneView } from './components/TalkToSomeoneView';
import { ParentToolkitView } from './components/ParentToolkitView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { MindRelaxSessionView } from './components/MindRelaxSessionView';

export function App() {
  // Navigation Tabs: 'home' | 'checkin' | 'peer' | 'counsellor' | 'parent' | 'admin'
  const [activeTab, setActiveTab] = useState<string>('home');

  // Role: 'student' | 'volunteer' | 'admin'
  const [role, setRole] = useState<UserRole>('student');

  // Desktop Mobile Frame Toggle ('frame' for phone mockup or 'fluid' for full width)
  const [mobileViewMode, setMobileViewMode] = useState<'frame' | 'fluid'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'fluid';
    }
    return 'frame';
  });

  // Mobile Quick Action Drawer & Mobile Settings Drawer
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);

  // Live status bar time simulation for mobile
  const [currentTime, setCurrentTime] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  // Theme: 'light' | 'dark' (High-contrast Night Study Mode)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('mb360_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return 'light';
    } catch {
      return 'light';
    }
  });

  // Apply theme class to document
  useEffect(() => {
    try {
      localStorage.setItem('mb360_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } catch (e) {
      console.warn('Theme update error:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    triggerHaptic();
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Haptic feedback helper for mobile touch
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate?.(12);
      } catch {}
    }
  };

  // Language: 'en' | 'ta' | 'tanglish'
  const [language, setLanguage] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem('mb360_lang');
      if (saved === 'en' || saved === 'ta' || saved === 'tanglish') return saved;
      return 'en';
    } catch {
      return 'en';
    }
  });

  // Onboarding & Customizer Modal States
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);

  // User State with defensive parse
  const [companion, setCompanion] = useState<CompanionConfig>(() => {
    try {
      const saved = localStorage.getItem('mb360_companion');
      if (!saved) return DEFAULT_COMPANION;
      const parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== 'object') return DEFAULT_COMPANION;
      return { ...DEFAULT_COMPANION, ...parsed };
    } catch {
      return DEFAULT_COMPANION;
    }
  });

  const [checkins, setCheckins] = useState<CheckinData[]>(() => {
    try {
      const saved = localStorage.getItem('mb360_checkins');
      if (!saved) return MOCK_CHECKINS;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : MOCK_CHECKINS;
    } catch {
      return MOCK_CHECKINS;
    }
  });

  const [peerPosts, setPeerPosts] = useState<PeerPost[]>(() => {
    try {
      const saved = localStorage.getItem('mb360_posts');
      if (!saved) return MOCK_PEER_POSTS;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : MOCK_PEER_POSTS;
    } catch {
      return MOCK_PEER_POSTS;
    }
  });

  const [futureMessages, setFutureMessages] = useState<FutureMessage[]>(() => {
    try {
      const saved = localStorage.getItem('mb360_future_messages');
      if (!saved) return MOCK_FUTURE_MESSAGES;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : MOCK_FUTURE_MESSAGES;
    } catch {
      return MOCK_FUTURE_MESSAGES;
    }
  });

  const [activeBooking, setActiveBooking] = useState<CounsellorBooking | null>(() => {
    try {
      const saved = localStorage.getItem('mb360_booking');
      if (!saved) return null;
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  // PWA Install Prompt State
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Check onboarding on mount
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('mb360_onboarded');
    if (!hasCompletedOnboarding) {
      setIsOnboardingOpen(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('mb360_companion', JSON.stringify(companion));
  }, [companion]);

  useEffect(() => {
    localStorage.setItem('mb360_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('mb360_checkins', JSON.stringify(checkins));
  }, [checkins]);

  useEffect(() => {
    localStorage.setItem('mb360_posts', JSON.stringify(peerPosts));
  }, [peerPosts]);

  useEffect(() => {
    localStorage.setItem('mb360_future_messages', JSON.stringify(futureMessages));
  }, [futureMessages]);

  useEffect(() => {
    if (activeBooking) {
      localStorage.setItem('mb360_booking', JSON.stringify(activeBooking));
    }
  }, [activeBooking]);

  const handleInstallClick = async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredInstallPrompt(null);
  };

  const handleCompleteOnboarding = (openCustomizer: boolean) => {
    localStorage.setItem('mb360_onboarded', 'true');
    setIsOnboardingOpen(false);
    if (openCustomizer) {
      setIsCustomizerOpen(true);
    }
  };

  const handleSaveCompanion = (newConfig: CompanionConfig) => {
    setCompanion(newConfig);
    setIsCustomizerOpen(false);
  };

  const handleSaveCheckin = (newCheckin: CheckinData) => {
    triggerHaptic();
    setCheckins((prev) => [...prev, newCheckin]);
    setActiveTab('home');
  };

  const handleSaveFutureMessage = (newMsg: FutureMessage) => {
    setFutureMessages((prev) => [newMsg, ...prev]);
  };

  const handleAddPeerPost = (newPost: PeerPost) => {
    setPeerPosts((prev) => [newPost, ...prev]);
  };

  const handleAddPeerReply = (postId: string, reply: PeerReply) => {
    setPeerPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, replies: [...p.replies, reply] } : p))
    );
  };

  const handleFlagPeerPost = (postId: string, reason: string) => {
    setPeerPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, flaggedForReview: true, flagReason: reason } : p
      )
    );
  };

  const handleUpvotePeerPost = (postId: string) => {
    triggerHaptic();
    setPeerPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const hasUpvoted = p.hasUpvoted;
          return {
            ...p,
            upvotes: hasUpvoted ? p.upvotes - 1 : p.upvotes + 1,
            hasUpvoted: !hasUpvoted,
          };
        }
        return p;
      })
    );
  };

  const handleThankReply = (postId: string, replyId: string) => {
    triggerHaptic();
    setPeerPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            replies: p.replies.map((r) =>
              r.id === replyId ? { ...r, thanked: true, volunteerKarma: (r.volunteerKarma || 100) + 1 } : r
            ),
          };
        }
        return p;
      })
    );
  };

  const handleReviewFlaggedPost = (postId: string, action: 'dismiss' | 'assign-counsellor') => {
    setPeerPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, flaggedForReview: false, reviewedByCounsellor: true } : p
      )
    );
  };

  const handleUpdateFollowUp = (
    weekNumber: number,
    status: 'completed' | 'skipped',
    note?: string
  ) => {
    if (!activeBooking) return;
    const updated = {
      ...activeBooking,
      followUpSchedule: activeBooking.followUpSchedule.map((fu) =>
        fu.weekNumber === weekNumber ? { ...fu, status, responseNote: note } : fu
      ),
    };
    setActiveBooking(updated);
  };

  const streakDays = checkins.length;
  const flaggedQueue = peerPosts.filter((p) => p.flaggedForReview);

  // Tab change with haptic
  const handleTabChange = (tabId: string) => {
    triggerHaptic();
    setActiveTab(tabId);
  };

  // Mobile App Core Content
  const appContent = (
    <div className="flex-1 flex flex-col min-h-0 relative bg-[#F9F7F2] dark:bg-[#0F1416] text-[#3D3A35] dark:text-[#F3F6F8] selection:bg-[#D1E5E6] selection:text-[#1F4647] overflow-hidden">
      {/* Top Persistent Non-Intrusive Crisis Helpline Bar */}
      <CrisisBar />

      {/* Mobile Top App Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#161E20]/95 backdrop-blur-md border-b border-[#E8E4D9] dark:border-[#223034] px-4 py-2.5 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2.5">
          {/* Companion mini avatar as logo & trigger */}
          <div
            onClick={() => setIsChatDrawerOpen(true)}
            className="relative cursor-pointer group"
            title="Chat with Companion"
          >
            <div className="w-9 h-9 rounded-2xl bg-[#4A8B8D] flex items-center justify-center text-white shadow-xs p-0.5 border border-white/20">
              <CompanionAvatar avatar={companion?.avatar || 'blob'} emotion="happy" size="sm" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#161E20] rounded-full"></span>
          </div>

          <div
            onClick={() => handleTabChange('home')}
            className="cursor-pointer select-none"
          >
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-serif font-bold tracking-tight text-[#2D2D2B] dark:text-[#F3F6F8]">
                MindBridge
              </h1>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-[#F0EDE4] dark:bg-[#253235] text-[#4A8B8D] dark:text-[#63C1C4] rounded-full border border-[#E8E4D9] dark:border-[#2F3D42]">
                App
              </span>
            </div>
            <p className="text-[10px] text-[#7A756D] dark:text-[#9BA3AF] font-medium leading-none">
              {companion.name} is with you
            </p>
          </div>
        </div>

        {/* Right Header Actions: Streak + Theme + Settings Sheet */}
        <div className="flex items-center gap-1.5">
          {/* Day Streak badge */}
          <div
            onClick={() => handleTabChange('checkin')}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#F0EDE4] dark:bg-[#253235] text-[#4A8B8D] dark:text-[#63C1C4] rounded-full border border-[#E8E4D9] dark:border-[#2F3D42] cursor-pointer active:scale-95 transition-transform"
            title="Your Daily Check-in Streak"
          >
            <Flame className="w-3.5 h-3.5 text-[#E98A72] fill-[#E98A72]" />
            <span className="text-xs font-bold font-mono">{streakDays}d</span>
          </div>

          {/* Quick Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle Night Study Mode"
            className="w-8 h-8 rounded-full border border-[#E8E4D9] dark:border-[#2F3D42] bg-white dark:bg-[#1A2326] flex items-center justify-center text-[#2D2D2B] dark:text-[#F3F6F8] hover:bg-[#F0EDE4] dark:hover:bg-[#253235] active:scale-95 transition-all cursor-pointer shadow-2xs"
            title={theme === 'dark' ? 'Night Study Mode active' : 'Switch to Night Study Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#F89E88]" />
            ) : (
              <Moon className="w-4 h-4 text-[#4A8B8D]" />
            )}
          </button>

          {/* Mobile Settings & Role Menu */}
          <button
            onClick={() => {
              triggerHaptic();
              setIsMobileSettingsOpen(true);
            }}
            className="w-8 h-8 rounded-full border border-[#E8E4D9] dark:border-[#2F3D42] bg-white dark:bg-[#1A2326] flex items-center justify-center text-[#2D2D2B] dark:text-[#F3F6F8] hover:bg-[#F0EDE4] dark:hover:bg-[#253235] active:scale-95 transition-all cursor-pointer shadow-2xs"
            title="App Settings & Role"
          >
            <Settings className="w-4 h-4 text-[#7A756D] dark:text-[#9BA3AF]" />
          </button>
        </div>
      </header>

      {/* Main Scrollable Viewport */}
      <main className="flex-1 overflow-y-auto px-3.5 sm:px-6 py-4 pb-28">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <HomeInsightsView
                checkins={checkins}
                futureMessages={futureMessages}
                onSaveFutureMessage={handleSaveFutureMessage}
                companion={companion}
                language={language}
                onOpenCheckin={() => handleTabChange('checkin')}
                onOpenCompanionChat={() => setIsChatDrawerOpen(true)}
                onOpenRelax={() => handleTabChange('relax')}
              />
            </motion.div>
          )}

          {activeTab === 'checkin' && (
            <motion.div
              key="checkin"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <CheckinView
                companion={companion}
                language={language}
                onSaveCheckin={handleSaveCheckin}
                streakCount={streakDays}
              />
            </motion.div>
          )}

          {activeTab === 'peer' && (
            <motion.div
              key="peer"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <PeerSupportView
                posts={peerPosts}
                currentRole={role}
                onAddPost={handleAddPeerPost}
                onAddReply={handleAddPeerReply}
                onFlagPost={handleFlagPeerPost}
                onUpvotePost={handleUpvotePeerPost}
                onThankReply={handleThankReply}
              />
            </motion.div>
          )}

          {activeTab === 'relax' && (
            <motion.div
              key="relax"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <MindRelaxSessionView
                companion={companion}
                language={language}
                onSessionComplete={(activityType, durationMins) => {
                  console.log('Completed relaxation session:', activityType, durationMins);
                }}
              />
            </motion.div>
          )}

          {activeTab === 'counsellor' && (
            <motion.div
              key="counsellor"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <TalkToSomeoneView
                activeBooking={activeBooking}
                onBookCounsellor={(booking) => setActiveBooking(booking)}
                onUpdateFollowUp={handleUpdateFollowUp}
              />
            </motion.div>
          )}

          {activeTab === 'parent' && (
            <motion.div
              key="parent"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <ParentToolkitView language={language} />
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <AdminDashboardView
                flaggedPosts={flaggedQueue}
                onReviewFlaggedPost={handleReviewFlaggedPost}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Center Companion Voice Call / Chat Button */}
      <div className="absolute bottom-18 left-1/2 -translate-x-1/2 z-40">
        <button
          id="fab-companion-chat"
          onClick={() => {
            triggerHaptic();
            setIsChatDrawerOpen(true);
          }}
          className="p-3.5 bg-linear-to-tr from-[#376F71] to-[#4A8B8D] hover:from-[#2D5A5C] hover:to-[#3E7678] active:scale-90 text-white rounded-full shadow-[0_8px_25px_rgba(74,139,141,0.45)] border-3 border-white dark:border-[#161E20] flex items-center justify-center cursor-pointer transition-all"
          title={`Talk with ${companion?.name || 'Mithra'}`}
        >
          <div className="relative">
            <CompanionAvatar avatar={companion?.avatar || 'blob'} emotion="happy" size="sm" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E98A72] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E98A72]"></span>
            </span>
          </div>
        </button>
      </div>

      {/* Native Mobile Bottom Navigation Dock */}
      <nav className="absolute bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-[#161E20]/95 backdrop-blur-lg border-t border-[#E8E4D9] dark:border-[#223034] safe-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {/* Tab 1: Home / Insights */}
          <button
            onClick={() => handleTabChange('home')}
            className={`flex flex-col items-center justify-center py-1 gap-1 transition-all cursor-pointer relative ${
              activeTab === 'home'
                ? 'text-[#4A8B8D] dark:text-[#63C1C4] font-bold'
                : 'text-[#7A756D] dark:text-[#9BA3AF] hover:text-[#2D2D2B]'
            }`}
          >
            <TrendingUp className={`w-5 h-5 transition-transform ${activeTab === 'home' ? 'scale-110 stroke-[2.5]' : ''}`} />
            <span className="text-[10px] tracking-tight">{I18N_TEXT[language]?.navInsights?.split(' ')[0] || 'Home'}</span>
            {activeTab === 'home' && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute -bottom-1 w-6 h-1 bg-[#4A8B8D] dark:bg-[#63C1C4] rounded-full"
              />
            )}
          </button>

          {/* Tab 2: Daily Pulse Check-in */}
          <button
            onClick={() => handleTabChange('checkin')}
            className={`flex flex-col items-center justify-center py-1 gap-1 transition-all cursor-pointer relative ${
              activeTab === 'checkin'
                ? 'text-[#4A8B8D] dark:text-[#63C1C4] font-bold'
                : 'text-[#7A756D] dark:text-[#9BA3AF] hover:text-[#2D2D2B]'
            }`}
          >
            <Sparkles className={`w-5 h-5 transition-transform ${activeTab === 'checkin' ? 'scale-110 stroke-[2.5]' : ''}`} />
            <span className="text-[10px] tracking-tight">{I18N_TEXT[language]?.navPulse?.split(' ')[0] || 'Pulse'}</span>
            {activeTab === 'checkin' && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute -bottom-1 w-6 h-1 bg-[#4A8B8D] dark:bg-[#63C1C4] rounded-full"
              />
            )}
          </button>

          {/* Center Space for Floating Companion Button */}
          <div className="flex flex-col items-center justify-end pb-1 pointer-events-none">
            <span className="text-[9px] font-bold text-[#4A8B8D] dark:text-[#63C1C4] uppercase tracking-wider mt-5">
              {companion.name}
            </span>
          </div>

          {/* Tab 4: Peer Support Room */}
          <button
            onClick={() => handleTabChange('peer')}
            className={`flex flex-col items-center justify-center py-1 gap-1 transition-all cursor-pointer relative ${
              activeTab === 'peer'
                ? 'text-[#4A8B8D] dark:text-[#63C1C4] font-bold'
                : 'text-[#7A756D] dark:text-[#9BA3AF] hover:text-[#2D2D2B]'
            }`}
          >
            <MessageSquare className={`w-5 h-5 transition-transform ${activeTab === 'peer' ? 'scale-110 stroke-[2.5]' : ''}`} />
            <span className="text-[10px] tracking-tight">{I18N_TEXT[language]?.navPeer?.split(' ')[0] || 'Peers'}</span>
            {activeTab === 'peer' && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute -bottom-1 w-6 h-1 bg-[#4A8B8D] dark:bg-[#63C1C4] rounded-full"
              />
            )}
          </button>

          {/* Tab 5: Support / Counsellor or Toolkit */}
          <button
            onClick={() => handleTabChange(role === 'admin' ? 'admin' : 'counsellor')}
            className={`flex flex-col items-center justify-center py-1 gap-1 transition-all cursor-pointer relative ${
              activeTab === 'counsellor' || activeTab === 'admin'
                ? 'text-[#4A8B8D] dark:text-[#63C1C4] font-bold'
                : 'text-[#7A756D] dark:text-[#9BA3AF] hover:text-[#2D2D2B]'
            }`}
          >
            {role === 'admin' ? (
              <ShieldCheck className={`w-5 h-5 transition-transform ${activeTab === 'admin' ? 'scale-110 stroke-[2.5]' : ''}`} />
            ) : (
              <UserCheck className={`w-5 h-5 transition-transform ${activeTab === 'counsellor' ? 'scale-110 stroke-[2.5]' : ''}`} />
            )}
            <span className="text-[10px] tracking-tight">{role === 'admin' ? 'Admin' : 'Support'}</span>
            {(activeTab === 'counsellor' || activeTab === 'admin') && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute -bottom-1 w-6 h-1 bg-[#4A8B8D] dark:bg-[#63C1C4] rounded-full"
              />
            )}
          </button>
        </div>
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#EFECE6] dark:bg-[#070A0B] flex flex-col items-center justify-center selection:bg-[#D1E5E6] selection:text-[#1F4647] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Desktop Presentation Toolbar (for previewing the mobile app frame) */}
      <div className="w-full bg-[#1C2527] text-white px-4 py-2 flex items-center justify-between text-xs z-50 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="font-bold tracking-tight">MindBridge 360 Mobile App</span>
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-[#D1E5E6] hidden sm:inline">
            PWA Standalone Ready
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Frame vs Fluid Toggle (on desktop) */}
          <div className="hidden sm:flex items-center bg-black/30 p-0.5 rounded-full border border-white/10">
            <button
              onClick={() => setMobileViewMode('frame')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                mobileViewMode === 'frame' ? 'bg-[#4A8B8D] text-white shadow-xs' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone Frame</span>
            </button>
            <button
              onClick={() => setMobileViewMode('fluid')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                mobileViewMode === 'fluid' ? 'bg-[#4A8B8D] text-white shadow-xs' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </button>
          </div>

          {/* Quick Install Button */}
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="bg-[#E98A72] hover:bg-[#d67860] text-white px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
            >
              <Download className="w-3 h-3" />
              <span>Install App</span>
            </button>
          )}
        </div>
      </div>

      {/* App Container Rendering */}
      {mobileViewMode === 'frame' ? (
        <div className="w-full flex-1 flex items-center justify-center p-2 sm:p-4">
          <div className="mobile-device-frame bg-[#F9F7F2] dark:bg-[#0F1416] border border-[#2F393E]/20">
            {/* Dynamic Island / Notch */}
            <div className="mobile-notch">
              <div className="w-3 h-3 rounded-full bg-[#111] border border-white/10 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#222]"></div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#0d2a1b]"></div>
            </div>

            {/* Mobile Status Bar (Clock, WiFi, Battery) */}
            <div className="w-full pt-2.5 px-6 pb-1 flex items-center justify-between text-[11px] font-bold text-[#2D2D2B] dark:text-[#F3F6F8] select-none z-40 bg-white/95 dark:bg-[#161E20]/95 border-b border-[#E8E4D9]/40 dark:border-[#223034]/40">
              <span>{currentTime}</span>
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5" />
                <span className="text-[9px] font-mono">5G</span>
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* App View inside Phone Shell */}
            {appContent}
          </div>
        </div>
      ) : (
        <div className="w-full flex-1 flex flex-col max-w-2xl mx-auto shadow-2xl">
          {appContent}
        </div>
      )}

      {/* Mobile Settings & Role Bottom Sheet Modal */}
      <AnimatePresence>
        {isMobileSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="bg-white dark:bg-[#161E20] w-full max-w-lg rounded-t-[32px] border-t border-[#E8E4D9] dark:border-[#223034] shadow-2xl p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            >
              {/* Drag Pill Handle */}
              <div className="w-12 h-1.5 bg-[#E8E4D9] dark:bg-[#2F3D42] rounded-full mx-auto mb-2"></div>

              <div className="flex items-center justify-between border-b border-[#E8E4D9] dark:border-[#223034] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#F0EDE4] dark:bg-[#253235] flex items-center justify-center text-[#4A8B8D] dark:text-[#63C1C4]">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#2D2D2B] dark:text-[#F3F6F8]">
                      App Settings & Space
                    </h3>
                    <p className="text-xs text-[#7A756D] dark:text-[#9BA3AF]">MindBridge 360 Mobile Preferences</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileSettingsOpen(false)}
                  className="p-1.5 hover:bg-[#F0EDE4] dark:hover:bg-[#253235] rounded-full text-[#7A756D] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Personalize Companion Card */}
              <div
                onClick={() => {
                  setIsMobileSettingsOpen(false);
                  setIsCustomizerOpen(true);
                }}
                className="p-4 bg-[#F9F7F2] dark:bg-[#1C2527] rounded-2xl border border-[#E8E4D9] dark:border-[#2F3D42] flex items-center justify-between cursor-pointer hover:border-[#4A8B8D] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#4A8B8D] p-1 flex items-center justify-center">
                    <CompanionAvatar avatar={companion?.avatar || 'blob'} emotion="happy" size="sm" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#2D2D2B] dark:text-[#F3F6F8]">
                      Personalize {companion.name}
                    </h4>
                    <p className="text-[11px] text-[#7A756D] dark:text-[#9BA3AF]">
                      Avatar: {companion.avatar} • Tone: {companion.tone}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#4A8B8D] dark:text-[#63C1C4] font-bold">Edit →</span>
              </div>

              {/* User Role Switcher */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2D2D2B] dark:text-[#F3F6F8] block">
                  Campus Space / Active Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'student', label: 'Student', icon: '🎓' },
                    { id: 'volunteer', label: 'Volunteer', icon: '🛡️' },
                    { id: 'admin', label: 'Counsellor', icon: '📊' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setRole(item.id as UserRole);
                        if (item.id === 'admin') setActiveTab('admin');
                      }}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        role === item.id
                          ? 'border-[#4A8B8D] bg-[#F0EDE4] dark:bg-[#253235] text-[#4A8B8D] dark:text-[#63C1C4]'
                          : 'border-[#E8E4D9] dark:border-[#2F3D42] bg-white dark:bg-[#1A2326] text-[#7A756D]'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2D2D2B] dark:text-[#F3F6F8] block">
                  App Language / மொழி
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'en', label: 'English' },
                    { id: 'ta', label: 'தமிழ்' },
                    { id: 'tanglish', label: 'Tanglish' },
                  ].map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLanguage(l.id as AppLanguage)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        language === l.id
                          ? 'border-[#4A8B8D] bg-[#4A8B8D] text-white'
                          : 'border-[#E8E4D9] dark:border-[#2F3D42] bg-white dark:bg-[#1A2326] text-[#7A756D]'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parent Toolkit quick link */}
              <button
                onClick={() => {
                  setIsMobileSettingsOpen(false);
                  handleTabChange('parent');
                }}
                className="w-full py-3 px-4 bg-[#F9F7F2] dark:bg-[#1C2527] border border-[#E8E4D9] dark:border-[#2F3D42] rounded-2xl text-xs font-bold text-[#2D2D2B] dark:text-[#F3F6F8] flex items-center justify-between cursor-pointer hover:bg-[#F0EDE4]"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#E98A72]" /> Parent Wellbeing & Bridge Toolkit
                </span>
                <span>→</span>
              </button>

              <button
                onClick={() => setIsMobileSettingsOpen(false)}
                className="w-full py-3 bg-[#4A8B8D] hover:bg-[#376F71] text-white font-bold text-xs rounded-full cursor-pointer shadow-xs"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modals & Drawers */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        language={language}
        onLanguageChange={setLanguage}
        onComplete={handleCompleteOnboarding}
        companion={companion}
      />

      <CompanionCustomizer
        isOpen={isCustomizerOpen}
        currentConfig={companion}
        language={language}
        onSave={handleSaveCompanion}
        onClose={() => setIsCustomizerOpen(false)}
      />

      <CompanionChatDrawer
        isOpen={isChatDrawerOpen}
        onClose={() => setIsChatDrawerOpen(false)}
        companion={companion}
        language={language}
        latestCheckin={checkins[checkins.length - 1]}
        onUpdateVoicePref={(voiceEnabled) => setCompanion((prev) => ({ ...prev, voiceEnabled }))}
        onOpenCounsellorBooking={() => {
          setIsChatDrawerOpen(false);
          handleTabChange('counsellor');
        }}
      />
    </div>
  );
}

export default App;

