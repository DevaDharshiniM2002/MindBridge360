import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  Sparkles,
  Heart,
  TrendingUp,
  Activity,
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
  Cloud,
  User,
  LogIn,
  LogOut,
  BarChart3,
  Lock,
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
  AcademicEvent,
  StressForecast,
  InterventionOutcome,
  PersonalCopingProfile,
  InterventionType,
} from './types';
import {
  DEFAULT_COMPANION,
  MOCK_CHECKINS,
  MOCK_PEER_POSTS,
  MOCK_FUTURE_MESSAGES,
  MOCK_ACADEMIC_EVENTS,
  MOCK_STRESS_FORECAST,
  MOCK_INTERVENTION_OUTCOMES,
  MOCK_COPING_PROFILE,
  I18N_TEXT,
} from './data/mockData';
import {
  auth,
  syncUserProfile,
  updateUserDoc,
  subscribeToCheckins,
  addCheckinToFirestore,
  subscribeToFutureMessages,
  addFutureMessageToFirestore,
  markFutureMessageOpenedInFirestore,
  subscribeToPeerPosts,
  addPeerPostToFirestore,
  addPeerReplyToFirestore,
  togglePostUpvoteInFirestore,
  flagPostInFirestore,
  subscribeToBookings,
  saveBookingToFirestore,
  subscribeToAcademicEvents,
  addAcademicEventToFirestore,
  deleteAcademicEventFromFirestore,
  subscribeToInterventionOutcomes,
  addInterventionOutcomeToFirestore,
  subscribeToPersonalCopingProfile,
  savePersonalCopingProfileToFirestore,
  logOut,
  signInAsGuest,
} from './lib/firebase';
import { AuthGateway } from './components/AuthGateway';
import { CrisisBar } from './components/CrisisBar';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';
import { CompanionCustomizer } from './components/CompanionCustomizer';
import { CompanionAvatar } from './components/CompanionAvatar';
import { CompanionChatDrawer } from './components/CompanionChatDrawer';
import { CheckinView } from './components/CheckinView';
import { HomeInsightsView } from './components/HomeInsightsView';
import { PeerSupportView } from './components/PeerSupportView';
import { TalkToSomeoneView } from './components/TalkToSomeoneView';
import { ParentToolkitView } from './components/ParentToolkitView';
import { ParentBridgeView } from './components/ParentBridgeView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { CampusWellnessRadarView } from './components/CampusWellnessRadarView';
import { MindRelaxSessionView } from './components/MindRelaxSessionView';
import { MindMitraMomentModal } from './components/MindMitraMomentModal';
import { MyWellnessView } from './components/MyWellnessView';
import { CounsellingPreparationView } from './components/CounsellingPreparationView';
import { TalkToMithraView } from './components/TalkToMithraView';
import { ProfessionalSupportView } from './components/ProfessionalSupportView';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { LandingPageView } from './components/LandingPageView';
import {
  TopSectionTabStrip,
  AllSectionsDrawer,
  MindMitraTabId,
  MINDMITRA_SECTIONS,
} from './components/NavigationHub';

export function App() {
  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Landing Page Mode (shown by default for unauthenticated visitors)
  const [showLandingPage, setShowLandingPage] = useState<boolean>(true);
  const [initialAuthPortal, setInitialAuthPortal] = useState<'student' | 'admin'>('student');

  // Navigation Tabs: 'home' | 'checkin' | 'peer' | 'relax' | 'counsellor' | 'parent-bridge' | 'campus-insights'
  const [activeTab, setActiveTab] = useState<string>('home');

  // Role: 'student' | 'volunteer' | 'counsellor' | 'admin'
  const [role, setRole] = useState<UserRole>('student');

  // Desktop Mobile Frame Toggle ('frame' for phone mockup or 'fluid' for full width responsive)
  const [mobileViewMode, setMobileViewMode] = useState<'frame' | 'fluid'>('fluid');

  // Voice Assistant Modal (Module 12: Voice-First Accessibility)
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);

  // Mobile Quick Action Drawer & Mobile Settings Drawer
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const [isAllSectionsDrawerOpen, setIsAllSectionsDrawerOpen] = useState(false);

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

  // 🔮 Innovation #1: Academic Events & Stress Forecast State
  const [academicEvents, setAcademicEvents] = useState<AcademicEvent[]>(() => {
    try {
      const saved = localStorage.getItem('mm_academic_events');
      if (!saved) return MOCK_ACADEMIC_EVENTS;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : MOCK_ACADEMIC_EVENTS;
    } catch {
      return MOCK_ACADEMIC_EVENTS;
    }
  });

  const [stressForecast, setStressForecast] = useState<StressForecast>(() => {
    try {
      const saved = localStorage.getItem('mm_stress_forecast');
      if (!saved) return MOCK_STRESS_FORECAST;
      const parsed = JSON.parse(saved);
      return parsed && parsed.predictedRiskLevel ? parsed : MOCK_STRESS_FORECAST;
    } catch {
      return MOCK_STRESS_FORECAST;
    }
  });

  // 🎯 Innovation #2 & #3: Personal Coping Engine & "Did It Help?" Outcomes
  const [copingProfile, setCopingProfile] = useState<PersonalCopingProfile>(() => {
    try {
      const saved = localStorage.getItem('mm_coping_profile');
      if (!saved) return MOCK_COPING_PROFILE;
      const parsed = JSON.parse(saved);
      return parsed && Array.isArray(parsed.strategies) ? parsed : MOCK_COPING_PROFILE;
    } catch {
      return MOCK_COPING_PROFILE;
    }
  });

  const [interventionOutcomes, setInterventionOutcomes] = useState<InterventionOutcome[]>(() => {
    try {
      const saved = localStorage.getItem('mm_intervention_outcomes');
      if (!saved) return MOCK_INTERVENTION_OUTCOMES;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : MOCK_INTERVENTION_OUTCOMES;
    } catch {
      return MOCK_INTERVENTION_OUTCOMES;
    }
  });

  // 60s MindMitra Moment Modal State
  const [isMindMitraMomentOpen, setIsMindMitraMomentOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('mm_academic_events', JSON.stringify(academicEvents));
  }, [academicEvents]);

  useEffect(() => {
    localStorage.setItem('mm_stress_forecast', JSON.stringify(stressForecast));
  }, [stressForecast]);

  useEffect(() => {
    localStorage.setItem('mm_coping_profile', JSON.stringify(copingProfile));
  }, [copingProfile]);

  useEffect(() => {
    localStorage.setItem('mm_intervention_outcomes', JSON.stringify(interventionOutcomes));
  }, [interventionOutcomes]);

  // PWA Install Prompt State
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Firestore & Firebase Auth Listeners
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsAuthChecking(false);
      if (user) {
        try {
          const isMasterAdmin = user.email === 'deva10042002@gmail.com';
          const profile = await syncUserProfile(user, {
            role: isMasterAdmin ? 'admin' : role,
            language,
            theme,
            companion,
          });
          if (profile.role) {
            setRole(profile.role);
            if (profile.role === 'admin') {
              setActiveTab('campus-insights');
            }
          }
          if (profile.language) setLanguage(profile.language);
          if (profile.theme) setTheme(profile.theme);
          if (profile.companion) setCompanion(profile.companion);
        } catch (e) {
          console.warn('Could not sync user profile with Firestore:', e);
        }
      }
    });

    // Subscribe to Community Peer Posts in Firestore
    const unsubscribePeerPosts = subscribeToPeerPosts((posts) => {
      if (posts && posts.length > 0) {
        setPeerPosts(posts);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribePeerPosts();
    };
  }, []);

  // Subscribe to user-specific Firestore collections when user is authenticated
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribeCheckins = subscribeToCheckins(currentUser.uid, (cloudCheckins) => {
      if (cloudCheckins && cloudCheckins.length > 0) {
        setCheckins(cloudCheckins);
      }
    });

    const unsubscribeFutureMsgs = subscribeToFutureMessages(currentUser.uid, (cloudMsgs) => {
      if (cloudMsgs && cloudMsgs.length > 0) {
        setFutureMessages(cloudMsgs);
      }
    });

    const unsubscribeBookings = subscribeToBookings(currentUser.uid, (cloudBookings) => {
      if (cloudBookings && cloudBookings.length > 0) {
        setActiveBooking(cloudBookings[0]);
      }
    });

    const unsubscribeEvents = subscribeToAcademicEvents(currentUser.uid, (cloudEvents) => {
      if (cloudEvents && cloudEvents.length > 0) {
        setAcademicEvents(cloudEvents);
      }
    });

    const unsubscribeOutcomes = subscribeToInterventionOutcomes(currentUser.uid, (cloudOutcomes) => {
      if (cloudOutcomes && cloudOutcomes.length > 0) {
        setInterventionOutcomes(cloudOutcomes);
      }
    });

    const unsubscribeCoping = subscribeToPersonalCopingProfile(currentUser.uid, (cloudProfile) => {
      if (cloudProfile && cloudProfile.strategies) {
        setCopingProfile(cloudProfile);
      }
    });

    return () => {
      unsubscribeCheckins();
      unsubscribeFutureMsgs();
      unsubscribeBookings();
      unsubscribeEvents();
      unsubscribeOutcomes();
      unsubscribeCoping();
    };
  }, [currentUser]);

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
    if (currentUser) {
      updateUserDoc(currentUser.uid, { companion: newConfig });
    }
  };

  const handleSaveCheckin = (newCheckin: CheckinData) => {
    triggerHaptic();
    setCheckins((prev) => [...prev, newCheckin]);
    if (currentUser) {
      addCheckinToFirestore(currentUser.uid, newCheckin);
    }
    setActiveTab('home');
  };

  const handleSaveFutureMessage = (newMsg: FutureMessage) => {
    setFutureMessages((prev) => [newMsg, ...prev]);
    if (currentUser) {
      addFutureMessageToFirestore(currentUser.uid, newMsg);
    }
  };

  // 🔮 Innovation #1: Academic Event Handlers
  const handleAddAcademicEvent = (event: AcademicEvent) => {
    triggerHaptic();
    setAcademicEvents((prev) => [event, ...prev]);
    if (currentUser) {
      addAcademicEventToFirestore(currentUser.uid, event);
    }
  };

  const handleDeleteAcademicEvent = (id: string) => {
    triggerHaptic();
    setAcademicEvents((prev) => prev.filter((e) => e.id !== id));
    if (currentUser) {
      deleteAcademicEventFromFirestore(id);
    }
  };

  // 🎯 Innovation #2 & #3: Closed-Loop "Did It Help?" Outcome Completion
  const handleCompleteMoment = (outcome: InterventionOutcome) => {
    triggerHaptic();
    const updatedOutcomes = [outcome, ...interventionOutcomes];
    setInterventionOutcomes(updatedOutcomes);
    if (currentUser) {
      addInterventionOutcomeToFirestore(currentUser.uid, outcome);
    }

    // Dynamic Recalculation of Personal Coping Profile
    const typeOutcomes = updatedOutcomes.filter((o) => o.interventionType === outcome.interventionType);
    const avgDelta = typeOutcomes.reduce((acc, curr) => acc + Math.abs(curr.delta), 0) / typeOutcomes.length;

    const updatedStrategies = copingProfile.strategies.map((strat) => {
      if (strat.type === outcome.interventionType) {
        return {
          ...strat,
          avgStressReduction: Number(avgDelta.toFixed(1)),
          sessionsCompleted: strat.sessionsCompleted + 1,
        };
      }
      return strat;
    });

    updatedStrategies.sort((a, b) => b.avgStressReduction - a.avgStressReduction);
    const topKey = updatedStrategies[0]?.type || 'mindmitra-moment';
    const topItem = updatedStrategies[0];
    const finalStrategies = updatedStrategies.map((s) => ({
      ...s,
      isTopRecommendation: s.type === topKey,
    }));

    const totalDeltas = updatedOutcomes.reduce((acc, curr) => acc + Math.abs(curr.delta), 0);
    const overallAvg = totalDeltas / updatedOutcomes.length;

    const newProfile: PersonalCopingProfile = {
      topEfficacyType: topKey,
      topEfficacyName: topItem?.name || '60s MindMitra Moment',
      totalInterventionsCompleted: updatedOutcomes.length,
      avgOverallReduction: Number(overallAvg.toFixed(1)),
      strategies: finalStrategies,
      lastLearnedAt: new Date().toISOString(),
    };

    setCopingProfile(newProfile);
    if (currentUser) {
      savePersonalCopingProfileToFirestore(currentUser.uid, newProfile);
    }
  };

  const handleSelectIntervention = (type: InterventionType) => {
    triggerHaptic();
    if (type === 'mindmitra-moment') {
      setIsMindMitraMomentOpen(true);
    } else if (type === 'breathing-478' || type === 'ambient-sound' || type === 'bubble-pop' || type === 'zen-sand' || type === 'sensory-grounding') {
      setActiveTab('relax');
    } else if (type === 'mithra-chat') {
      setIsChatDrawerOpen(true);
    } else if (type === 'counsellor-booking') {
      setActiveTab('counsellor');
    } else {
      setActiveTab('relax');
    }
  };

  const handleAddPeerPost = (newPost: PeerPost) => {
    setPeerPosts((prev) => [newPost, ...prev]);
    if (currentUser) {
      addPeerPostToFirestore(currentUser.uid, newPost);
    }
  };

  const handleAddPeerReply = (postId: string, reply: PeerReply) => {
    setPeerPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, replies: [...p.replies, reply] } : p))
    );
    addPeerReplyToFirestore(postId, reply);
  };

  const handleFlagPeerPost = (postId: string, reason: string) => {
    setPeerPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, flaggedForReview: true, flagReason: reason } : p
      )
    );
    flagPostInFirestore(postId, reason, currentUser?.uid || 'anonymous');
  };

  const handleUpvotePeerPost = (postId: string) => {
    triggerHaptic();
    const targetPost = peerPosts.find((p) => p.id === postId);
    const hasUpvoted = targetPost?.hasUpvoted;
    const diff = hasUpvoted ? -1 : 1;

    setPeerPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            upvotes: hasUpvoted ? p.upvotes - 1 : p.upvotes + 1,
            hasUpvoted: !hasUpvoted,
          };
        }
        return p;
      })
    );
    togglePostUpvoteInFirestore(postId, diff);
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
    if (currentUser) {
      saveBookingToFirestore(currentUser.uid, updated);
    }
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
            onClick={() => handleTabChange('talk-mithra')}
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
                MindMitra
              </h1>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-[#F0EDE4] dark:bg-[#253235] text-[#4A8B8D] dark:text-[#63C1C4] rounded-full border border-[#E8E4D9] dark:border-[#2F3D42]">
                Wellbeing
              </span>
            </div>
            <p className="text-[10px] text-[#7A756D] dark:text-[#9BA3AF] font-medium leading-none">
              Understand. Relax. Talk. Get Support.
            </p>
          </div>
        </div>

        {/* Right Header Actions: Auth Profile + Streak + Theme + Settings Sheet */}
        <div className="flex items-center gap-1.5">
          {/* Module 12: Prominent Talk to MindMitra Voice Mode Button */}
          <button
            id="header-voice-assistant-btn"
            onClick={() => {
              triggerHaptic();
              setIsVoiceAssistantOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-95 text-white text-[11px] font-bold shadow-xs cursor-pointer transition-all"
            title="Voice-First Mode: Talk to MindMitra in English, Tamil, or Tanglish"
          >
            <Mic className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Talk to MindMitra</span>
            <span className="sm:hidden">Voice</span>
          </button>

          {/* 10-Sections Quick Switcher Trigger */}
          <button
            onClick={() => setIsAllSectionsDrawerOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#4A8B8D]/30 bg-teal-50/80 dark:bg-teal-950/60 text-[#4A8B8D] dark:text-[#63C1C4] hover:bg-teal-100 dark:hover:bg-teal-900 active:scale-95 transition-all cursor-pointer shadow-2xs text-[11px] font-bold"
            title="Explore all MindMitra Sections"
          >
            <span>🧭</span>
            <span className="hidden xs:inline">Sections</span>
            <span className="text-[10px] bg-[#4A8B8D] text-white px-1 rounded-full">10</span>
          </button>

          {/* Admin Overall Analytics Report Shortcut Button */}
          {role === 'admin' && (
            <button
              onClick={() => handleTabChange('campus-insights')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full border transition-all cursor-pointer shadow-2xs text-[11px] font-bold ${
                activeTab === 'campus-insights' || activeTab === 'admin'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-purple-50 dark:bg-purple-950/80 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200 hover:bg-purple-100'
              }`}
              title="Overall Institutional Analytics & Wellness Radar"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Overall Analytics</span>
            </button>
          )}

          {/* Dedicated Student & Admin Login Button / Role Badge */}
          <button
            onClick={() => {
              triggerHaptic();
              setIsAuthModalOpen(true);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all cursor-pointer shadow-2xs text-[11px] font-bold ${
              role === 'admin'
                ? 'bg-purple-100 dark:bg-purple-950/80 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200 hover:bg-purple-200'
                : currentUser
                ? 'bg-teal-50 dark:bg-teal-950/80 border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-200 hover:bg-teal-100'
                : 'bg-white dark:bg-[#1A2326] border-[#E8E4D9] dark:border-[#2F3D42] text-[#2D2D2B] dark:text-[#F3F6F8] hover:bg-[#F0EDE4]'
            }`}
            title={currentUser ? `Signed in as ${role === 'admin' ? 'Institutional Admin' : 'Student'} (${currentUser.displayName || currentUser.email || 'User'})` : 'Student Login / Admin Login'}
          >
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Profile"
                className="w-4 h-4 rounded-full object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : role === 'admin' ? (
              <Shield className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
            ) : currentUser ? (
              <div className="w-4 h-4 rounded-full bg-teal-600 text-white text-[9px] flex items-center justify-center font-bold shrink-0">
                {currentUser.displayName ? currentUser.displayName[0] : 'S'}
              </div>
            ) : (
              <User className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            )}
            <span className="hidden xs:inline">
              {role === 'admin'
                ? '🛡️ Admin'
                : currentUser
                ? `🎓 ${currentUser.displayName?.split(' ')[0] || (currentUser.isAnonymous ? 'Guest' : 'Student')}`
                : 'Login'}
            </span>
          </button>

          {/* Direct Sign Out Button */}
          {currentUser && (
            <button
              onClick={async () => {
                triggerHaptic();
                await logOut();
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-full border border-rose-200 dark:border-rose-800/80 bg-rose-50/80 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 active:scale-95 transition-all cursor-pointer shadow-2xs text-[11px] font-bold"
              title="Sign Out / Switch Account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          )}

          {/* Day Streak badge */}
          <div
            onClick={() => handleTabChange('checkin')}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#F0EDE4] dark:bg-[#253235] text-[#4A8B8D] dark:text-[#63C1C4] rounded-full border border-[#E8E4D9] dark:border-[#2F3D42] cursor-pointer active:scale-95 transition-transform"
            title="Your Daily Check-in Streak"
          >
            <Flame className="w-3.5 h-3.5 text-[#E98A72] fill-[#E98A72]" />
            <span className="text-xs font-bold font-mono">{streakDays}d</span>
          </div>

          {/* Platform Vision & Founders quick icon */}
          <button
            onClick={() => handleTabChange('landing')}
            className={`w-8 h-8 rounded-full border transition-all cursor-pointer shadow-2xs flex items-center justify-center active:scale-95 ${
              activeTab === 'landing'
                ? 'bg-[#4A8B8D] text-white border-[#4A8B8D]'
                : 'border-teal-200 dark:border-teal-800/80 bg-teal-50/80 dark:bg-teal-950/60 text-[#4A8B8D] dark:text-[#88D4D6] hover:bg-teal-100'
            }`}
            title="MindMitra Vision, Founders & Project Overview"
          >
            <Sparkles className="w-4 h-4" />
          </button>

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

      {/* Top 9-Sections Horizontal Tab Strip */}
      <TopSectionTabStrip
        activeTab={
          activeTab === 'counsellor'
            ? 'counselling-prep'
            : activeTab === 'peer'
            ? 'community'
            : activeTab === 'admin'
            ? 'campus-insights'
            : (activeTab as MindMitraTabId)
        }
        onSelectTab={(tabId) => handleTabChange(tabId)}
      />

      {/* Main Scrollable Viewport */}
      <main className="flex-1 overflow-y-auto px-3.5 sm:px-6 py-4 pb-28">
        <AnimatePresence mode="wait">
          {/* Section 0: ✨ Overview / Landing Page (Mission, Vision, Founders) */}
          {activeTab === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <div className="pb-8">
                <LandingPageView
                  onEnterApp={(authedRole, initialTab) => {
                    if (authedRole) setRole(authedRole);
                    if (initialTab) handleTabChange(initialTab);
                    else handleTabChange('home');
                  }}
                  onOpenAuth={(mode) => {
                    if (mode === 'admin') handleTabChange('campus-insights');
                    else handleTabChange('home');
                  }}
                  language={language}
                  onLanguageChange={setLanguage}
                  isLoggedIn={true}
                />
              </div>
            </motion.div>
          )}

          {/* Section 1: 🏠 Home */}
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
                onOpenCompanionChat={() => handleTabChange('talk-mithra')}
                onOpenRelax={() => handleTabChange('relax')}
                forecast={stressForecast}
                academicEvents={academicEvents}
                onAddAcademicEvent={handleAddAcademicEvent}
                onDeleteAcademicEvent={handleDeleteAcademicEvent}
                copingProfile={copingProfile}
                interventionOutcomes={interventionOutcomes}
                onSelectIntervention={handleSelectIntervention}
                onOpenMoment={() => setIsMindMitraMomentOpen(true)}
                onOpenCounsellorBooking={() => handleTabChange('counselling-prep')}
                onOpenCrisisBar={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {/* Section 2: 🧠 Quick Pulse */}
          {(activeTab === 'checkin' || activeTab === 'quick-pulse') && (
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

          {/* Section 3: 🧘 Mind Relax */}
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

          {/* Section 4: 🤖 Talk to Mithra */}
          {activeTab === 'talk-mithra' && (
            <motion.div
              key="talk-mithra"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <TalkToMithraView
                companion={companion}
                onCompanionChange={(comp) => setCompanion(comp)}
                language={language}
                onLanguageChange={(lang) => setLanguage(lang)}
                latestCheckin={checkins[checkins.length - 1]}
                onOpenCounsellorBooking={() => handleTabChange('counselling-prep')}
                onOpenRelax={() => handleTabChange('relax')}
              />
            </motion.div>
          )}

          {/* Section 5: 🎓 Counselling Preparation */}
          {(activeTab === 'counselling-prep' || activeTab === 'counsellor') && (
            <motion.div
              key="counselling-prep"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <CounsellingPreparationView
                activeBooking={activeBooking}
                onBookCounsellor={(booking) => setActiveBooking(booking)}
                onUpdateFollowUp={handleUpdateFollowUp}
                language={language}
                onOpenCrisisBar={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {/* Section 6: 👨‍👩‍👧 Parent Bridge (Module 9) */}
          {(activeTab === 'parent-bridge' || activeTab === 'parent') && (
            <motion.div
              key="parent-bridge"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <ParentBridgeView
                language={language}
                onNavigateToTab={(t) => handleTabChange(t)}
                onOpenCrisisBar={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              />
            </motion.div>
          )}

          {/* Section 7: 👥 Anonymous Community */}
          {(activeTab === 'community' || activeTab === 'peer') && (
            <motion.div
              key="community"
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

          {/* Section 8: 📊 My Wellness */}
          {activeTab === 'my-wellness' && (
            <motion.div
              key="my-wellness"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <MyWellnessView
                checkins={checkins}
                copingProfile={copingProfile}
                interventionOutcomes={interventionOutcomes}
                forecast={stressForecast}
                language={language}
                companion={companion}
                streakDays={streakDays}
                onOpenCheckin={() => handleTabChange('checkin')}
                onOpenRelax={() => handleTabChange('relax')}
                onSelectIntervention={handleSelectIntervention}
                onOpenMoment={() => setIsMindMitraMomentOpen(true)}
              />
            </motion.div>
          )}

          {/* Section 9: 🏫 Campus Wellness Radar (Module 10) */}
          {(activeTab === 'campus-insights' || activeTab === 'admin') && (
            <motion.div
              key="campus-insights"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <CampusWellnessRadarView
                userRole={role}
                flaggedPosts={flaggedQueue}
                academicEvents={academicEvents}
                onReviewFlaggedPost={handleReviewFlaggedPost}
                onAddAcademicEvent={handleAddAcademicEvent}
              />
            </motion.div>
          )}

          {/* Section 10: 🆘 Professional Support */}
          {activeTab === 'professional-support' && (
            <motion.div
              key="professional-support"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <ProfessionalSupportView
                onOpenCounsellorBooking={() => handleTabChange('counselling-prep')}
                onOpenChatbot={() => handleTabChange('talk-mithra')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Center Companion Voice Call / Chat Button */}
      <div className="absolute bottom-18 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
        <button
          id="fab-voice-assistant"
          onClick={() => {
            triggerHaptic();
            setIsVoiceAssistantOpen(true);
          }}
          className="p-3 bg-linear-to-tr from-[#376F71] to-[#4A8B8D] hover:from-[#2D5A5C] hover:to-[#3E7678] active:scale-90 text-white rounded-full shadow-[0_8px_25px_rgba(74,139,141,0.45)] border-3 border-white dark:border-[#161E20] flex items-center justify-center cursor-pointer transition-all gap-1.5"
          title="Talk to MindMitra (Voice Assistant)"
        >
          <Mic className="w-5 h-5 animate-pulse text-amber-300" />
          <span className="text-[11px] font-bold pr-1 hidden sm:inline">Talk to MindMitra</span>
        </button>

        <button
          id="fab-companion-chat"
          onClick={() => {
            triggerHaptic();
            handleTabChange('talk-mithra');
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
          {/* Tab 1: Home */}
          <button
            onClick={() => handleTabChange('home')}
            className={`flex flex-col items-center justify-center py-1 gap-1 transition-all cursor-pointer relative ${
              activeTab === 'home'
                ? 'text-[#4A8B8D] dark:text-[#63C1C4] font-bold'
                : 'text-[#7A756D] dark:text-[#9BA3AF] hover:text-[#2D2D2B]'
            }`}
          >
            <TrendingUp className={`w-5 h-5 transition-transform ${activeTab === 'home' ? 'scale-110 stroke-[2.5]' : ''}`} />
            <span className="text-[10px] tracking-tight">Home</span>
            {activeTab === 'home' && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute -bottom-1 w-6 h-1 bg-[#4A8B8D] dark:bg-[#63C1C4] rounded-full"
              />
            )}
          </button>

          {/* Tab 2: Quick Pulse */}
          <button
            onClick={() => handleTabChange('checkin')}
            className={`flex flex-col items-center justify-center py-1 gap-1 transition-all cursor-pointer relative ${
              activeTab === 'checkin'
                ? 'text-[#4A8B8D] dark:text-[#63C1C4] font-bold'
                : 'text-[#7A756D] dark:text-[#9BA3AF] hover:text-[#2D2D2B]'
            }`}
          >
            <Activity className={`w-5 h-5 transition-transform ${activeTab === 'checkin' ? 'scale-110 stroke-[2.5]' : ''}`} />
            <span className="text-[10px] tracking-tight">Pulse</span>
            {activeTab === 'checkin' && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute -bottom-1 w-6 h-1 bg-[#4A8B8D] dark:bg-[#63C1C4] rounded-full"
              />
            )}
          </button>

          {/* Center Space for Floating Companion Button */}
          <div
            onClick={() => handleTabChange('talk-mithra')}
            className="flex flex-col items-center justify-end pb-1 cursor-pointer"
          >
            <span className="text-[9px] font-bold text-[#4A8B8D] dark:text-[#63C1C4] uppercase tracking-wider mt-5">
              {companion.name}
            </span>
          </div>

          {/* Tab 4: Mind Relax */}
          <button
            onClick={() => handleTabChange('relax')}
            className={`flex flex-col items-center justify-center py-1 gap-1 transition-all cursor-pointer relative ${
              activeTab === 'relax'
                ? 'text-[#4A8B8D] dark:text-[#63C1C4] font-bold'
                : 'text-[#7A756D] dark:text-[#9BA3AF] hover:text-[#2D2D2B]'
            }`}
          >
            <Heart className={`w-5 h-5 transition-transform ${activeTab === 'relax' ? 'scale-110 stroke-[2.5]' : ''}`} />
            <span className="text-[10px] tracking-tight">Relax</span>
            {activeTab === 'relax' && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute -bottom-1 w-6 h-1 bg-[#4A8B8D] dark:bg-[#63C1C4] rounded-full"
              />
            )}
          </button>

          {/* Tab 5: All 9 Sections Hub */}
          <button
            onClick={() => setIsAllSectionsDrawerOpen(true)}
            className={`flex flex-col items-center justify-center py-1 gap-1 transition-all cursor-pointer relative ${
              isAllSectionsDrawerOpen ||
              ['counselling-prep', 'community', 'my-wellness', 'campus-insights', 'professional-support'].includes(activeTab)
                ? 'text-[#4A8B8D] dark:text-[#63C1C4] font-bold'
                : 'text-[#7A756D] dark:text-[#9BA3AF] hover:text-[#2D2D2B]'
            }`}
          >
            <div className="relative">
              <Compass className="w-5 h-5 transition-transform" />
              <span className="absolute -top-1 -right-1 text-[8px] bg-[#E98A72] text-white font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                9
              </span>
            </div>
            <span className="text-[10px] tracking-tight">Sections</span>
            {['counselling-prep', 'community', 'my-wellness', 'campus-insights', 'professional-support'].includes(activeTab) && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute -bottom-1 w-6 h-1 bg-[#4A8B8D] dark:bg-[#63C1C4] rounded-full"
              />
            )}
          </button>
        </div>
      </nav>

      {/* Full 9 Sections Navigation Drawer */}
      <AllSectionsDrawer
        isOpen={isAllSectionsDrawerOpen}
        onClose={() => setIsAllSectionsDrawerOpen(false)}
        activeTab={
          activeTab === 'counsellor'
            ? 'counselling-prep'
            : activeTab === 'peer'
            ? 'community'
            : activeTab === 'admin'
            ? 'campus-insights'
            : (activeTab as MindMitraTabId)
        }
        onSelectTab={(t) => handleTabChange(t)}
      />
    </div>
  );

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] dark:bg-[#111719] flex flex-col items-center justify-center text-[#2D2D2B] dark:text-white p-4">
        <div className="w-14 h-14 rounded-3xl bg-[#4A8B8D] text-white flex items-center justify-center text-2xl font-serif italic shadow-xl animate-pulse mb-3">
          M
        </div>
        <h2 className="font-serif italic text-xl font-bold tracking-tight mb-1">MindMitra 360°</h2>
        <p className="text-xs text-[#7A756D] dark:text-[#A6B4B9]">Verifying Session & Securing Portal...</p>
      </div>
    );
  }

  if (!currentUser) {
    if (showLandingPage) {
      return (
        <LandingPageView
          onEnterApp={async (authedRole, initialTab) => {
            if (authedRole) setRole(authedRole);
            if (initialTab) setActiveTab(initialTab);
            try {
              await signInAsGuest();
            } catch (e) {
              console.error('Guest sign-in error:', e);
            }
          }}
          onOpenAuth={(mode) => {
            setInitialAuthPortal(mode || 'student');
            setShowLandingPage(false);
          }}
          language={language}
          onLanguageChange={setLanguage}
          isLoggedIn={false}
        />
      );
    }

    return (
      <AuthGateway
        onAuthenticated={(authedRole) => {
          setRole(authedRole);
          if (authedRole === 'admin') {
            setActiveTab('campus-insights');
          } else {
            setActiveTab('home');
          }
        }}
        language={language}
        onLanguageChange={setLanguage}
        initialPortal={initialAuthPortal}
        onBackToLanding={() => setShowLandingPage(true)}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F2EB] dark:bg-[#070A0B] flex flex-col selection:bg-[#D1E5E6] selection:text-[#1F4647] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Desktop Presentation Toolbar (for previewing the mobile app frame) */}
      <div className="w-full bg-[#1C2527] text-white px-4 py-2 flex items-center justify-between text-xs z-50 shadow-md shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="font-bold tracking-tight">MindMitra — Student Wellbeing Platform</span>
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-[#D1E5E6] hidden sm:inline">
            Understand. Relax. Talk. Get Support.
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* ✨ Platform Vision & Founders Landing Tab */}
          <button
            onClick={() => handleTabChange('landing')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[11px] transition-all cursor-pointer shadow-xs ${
              activeTab === 'landing'
                ? 'bg-[#4A8B8D] text-white'
                : 'bg-white/10 hover:bg-white/20 text-[#D1E5E6]'
            }`}
            title="MindMitra Vision, Founders & Capabilities"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Vision & Founders</span>
          </button>

          {/* 🎙️ Module 12: Voice-First Accessibility Button */}
          <button
            onClick={() => {
              triggerHaptic();
              setIsVoiceAssistantOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-[#4A8B8D] to-teal-600 hover:opacity-95 text-white font-bold text-[11px] transition-all cursor-pointer shadow-xs"
          >
            <Mic className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Talk to MindMitra</span>
          </button>

          {/* Admin Analytics Quick Switch */}
          {role === 'admin' && (
            <button
              onClick={() => handleTabChange('campus-insights')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] transition-all cursor-pointer shadow-xs"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Overall Campus Report</span>
            </button>
          )}

          {/* Cloud Account / User Role Pill */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white font-medium text-[11px] transition-all cursor-pointer"
          >
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Avatar"
                className="w-4 h-4 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : currentUser ? (
              <div className="w-4 h-4 rounded-full bg-teal-500 text-white text-[9px] flex items-center justify-center font-bold">
                {currentUser.displayName ? currentUser.displayName[0] : 'S'}
              </div>
            ) : (
              <Cloud className="w-3.5 h-3.5 text-teal-400" />
            )}
            <span>
              {role === 'admin'
                ? `🛡️ Admin: ${currentUser.displayName || currentUser.email || 'Admin'}`
                : `🎓 ${currentUser.displayName || (currentUser.isAnonymous ? 'Guest Student' : 'Student')}`}
            </span>
          </button>

          {/* Direct Sign Out Button on Desktop Header */}
          <button
            onClick={async () => {
              triggerHaptic();
              await logOut();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-900/60 hover:bg-rose-800 border border-rose-700/60 text-rose-200 font-semibold text-[11px] transition-all cursor-pointer"
            title="Sign Out to Login Gateway"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>

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

              {/* Account & Firestore Cloud Sync Card */}
              <div
                onClick={() => {
                  setIsMobileSettingsOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="p-4 bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-teal-500/10 dark:from-teal-950/40 dark:to-emerald-950/20 rounded-2xl border border-teal-500/30 flex items-center justify-between cursor-pointer hover:border-teal-500 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="User"
                      className="w-10 h-10 rounded-xl object-cover border border-white dark:border-zinc-800"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                      {currentUser?.displayName ? currentUser.displayName[0] : <Cloud className="w-5 h-5" />}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#2D2D2B] dark:text-[#F3F6F8] flex items-center gap-1.5">
                      <span>{currentUser ? currentUser.displayName || 'Guest Student' : 'Google & Cloud Sync'}</span>
                      <span className="text-[10px] font-normal px-1.5 py-0.2 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200">
                        {currentUser ? (currentUser.isAnonymous ? 'Guest' : 'Firestore') : 'Offline'}
                      </span>
                    </h4>
                    <p className="text-[11px] text-[#7A756D] dark:text-[#9BA3AF]">
                      {currentUser
                        ? 'Cloud database & streak sync active'
                        : 'Sign in to preserve your check-in streaks'}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#4A8B8D] dark:text-[#63C1C4] font-bold">
                  {currentUser ? 'Manage →' : 'Sign In →'}
                </span>
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
                        const newRole = item.id as UserRole;
                        setRole(newRole);
                        if (currentUser) {
                          updateUserDoc(currentUser.uid, { role: newRole });
                        }
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
                      onClick={() => {
                        const newLang = l.id as AppLanguage;
                        setLanguage(newLang);
                        if (currentUser) {
                          updateUserDoc(currentUser.uid, { language: newLang });
                        }
                      }}
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
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        currentRole={role}
        onChangeRole={(newRole) => {
          setRole(newRole);
          if (currentUser) {
            updateUserDoc(currentUser.uid, { role: newRole });
          }
          if (newRole === 'admin') setActiveTab('admin');
        }}
        checkinsCount={checkins.length}
        streakCount={streakDays}
      />

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

      {/* 60s Evidence-Based MindMitra Moment Modal */}
      <MindMitraMomentModal
        isOpen={isMindMitraMomentOpen}
        onClose={() => setIsMindMitraMomentOpen(false)}
        onComplete={handleCompleteMoment}
        initialPreStress={stressForecast?.trajectory?.[0]?.predictedStress || 75}
        triggerReason={stressForecast?.headline || 'Pre-Exam High Stress Window'}
      />

      {/* Module 12: Voice-First Accessibility Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        language={language}
        onLanguageChange={setLanguage}
        companionName={companion?.name || 'Mithra'}
        onNavigate={(tab) => handleTabChange(tab)}
        onSaveVoiceCheckin={(checkin) => {
          handleSaveCheckin(checkin);
        }}
      />
    </div>
  );
}

export default App;

