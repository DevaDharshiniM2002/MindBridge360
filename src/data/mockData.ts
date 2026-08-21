import {
  CheckinData,
  PeerPost,
  FutureMessage,
  DepartmentTrend,
  CrisisHelpline,
  CompanionConfig,
} from '../types';

export const DEFAULT_COMPANION: CompanionConfig = {
  name: 'Mithra',
  avatar: 'blob',
  tone: 'gentle',
  voiceEnabled: true,
};

export const CRISIS_HELPLINES: CrisisHelpline[] = [
  {
    name: 'Tele-MANAS (Govt of India)',
    number: '14416',
    available: '24x7 Free & Confidential',
    languages: 'Hindi, Tamil, English, Telugu, Kannada, Marathi + 15 regional languages',
    description: 'National tele-mental health programme by MoHFW & NIMHANS. Toll-free support.',
    isGovernment: true,
    isTollFree: true,
  },
  {
    name: 'Vandrevala Foundation',
    number: '+91 9999 666 555',
    available: '24x7 Free',
    languages: 'English, Hindi, Tamil, Gujarati, Marathi',
    description: 'Trained psychological counsellors for immediate distress & emotional first aid.',
    isTollFree: true,
  },
  {
    name: 'iCall (TISS Mumbai)',
    number: '022-25521111 / +91 9152987821',
    available: 'Mon-Sat: 8 AM - 10 PM',
    languages: 'English, Hindi, Marathi',
    description: 'Pioneering psychosocial counselling helpline by Tata Institute of Social Sciences.',
  },
  {
    name: 'KIRAN (Govt Helpline)',
    number: '1800-599-0019',
    available: '24x7 Toll-Free',
    languages: '13 Indian Languages',
    description: 'Department of Empowerment of Persons with Disabilities 24x7 support line.',
    isGovernment: true,
    isTollFree: true,
  },
  {
    name: 'AASRA',
    number: '+91 98204 66726',
    available: '24x7 Emergency Line',
    languages: 'English, Hindi',
    description: 'Crisis intervention and suicide prevention helpline.',
  },
];

// Generate 30 days of realistic checkin history
export const INITIAL_CHECKINS: CheckinData[] = Array.from({ length: 30 }, (_, i) => {
  const dayOffset = 29 - i;
  const d = new Date();
  d.setDate(d.getDate() - dayOffset);
  const dateStr = d.toISOString().split('T')[0];

  // Simulating an exam crunch around day 18-24
  const isExamWave = dayOffset >= 6 && dayOffset <= 12;
  const baseStress = isExamWave ? 4 : dayOffset < 5 ? 2 : 3;
  const baseSleep = isExamWave ? 2 : dayOffset < 5 ? 4 : 3;
  const baseEnergy = isExamWave ? 2 : dayOffset < 5 ? 4 : 3;

  return {
    id: `checkin-${i}`,
    timestamp: d.toISOString(),
    dateStr,
    sleep: Math.max(1, Math.min(5, baseSleep + (i % 3 === 0 ? -1 : i % 2 === 0 ? 1 : 0))),
    stress: Math.max(1, Math.min(5, baseStress + (i % 4 === 0 ? 1 : i % 3 === 0 ? -1 : 0))),
    energy: Math.max(1, Math.min(5, baseEnergy + (i % 2 === 0 ? 1 : -1))),
    social: Math.max(1, Math.min(5, isExamWave ? 2 : 4)),
    workload: Math.max(1, Math.min(5, isExamWave ? 5 : 3)),
    journalNote:
      i === 29
        ? 'Feeling a bit more balanced today after finishing the semester lab viva. Grabbed chai with hostel mates.'
        : i === 22
        ? 'Midterm prep is heavy. Had trouble winding down before 3 AM.'
        : undefined,
    streakDay: i + 1,
  };
});

export const INITIAL_FUTURE_MESSAGES: FutureMessage[] = [
  {
    id: 'msg-1',
    title: 'Reminder from post-midterms',
    content:
      'Hey you! Remember how terrified you were for the Operating Systems viva last semester? You ended up getting an A- and laughing about it over samosas the next day. This exam will pass too. Drink some water and take a 10-minute walk.',
    triggerTag: 'exam-anxiety',
    createdAt: '2026-07-15T14:20:00Z',
    isOpened: false,
  },
  {
    id: 'msg-2',
    title: 'When hostel feels too lonely',
    content:
      'The first few weeks away from home in the hostel are hard for everyone, even if they pretend it is easy. Call Didi or Mom for 10 minutes, put on your comfort playlist, and remember why you chose this degree. You belong here.',
    triggerTag: 'homesick',
    createdAt: '2026-07-28T19:00:00Z',
    isOpened: false,
  },
  {
    id: 'msg-3',
    title: 'A gentle reminder on a low-energy day',
    content:
      'Your productivity is not your worth. You are allowed to have a slow Tuesday. Lie down, rest your eyes, and do not beat yourself up.',
    triggerTag: 'hard-day',
    createdAt: '2026-08-05T10:15:00Z',
    isOpened: false,
  },
];

export const INITIAL_PEER_POSTS: PeerPost[] = [
  {
    id: 'post-1',
    room: 'exams',
    authorPseudonym: 'QuietSparrow42',
    isVolunteer: false,
    title: 'How do you deal with placement season comparison when friends get day-1 offers?',
    content:
      'Day 1 of campus placements happened yesterday and 3 of my closest hostel friends got placed in top product firms. I am genuinely happy for them, but I couldn’t clear the coding round for my dream company. Feeling like a total failure and dreading going to the mess hall because everyone is discussing CTC packages.',
    upvotes: 24,
    helpfulCount: 18,
    createdAt: '2 hours ago',
    flaggedForReview: false,
    replies: [
      {
        id: 'reply-1',
        authorPseudonym: 'CalmRiver99',
        isVolunteer: true,
        volunteerKarma: 142,
        content:
          'Hey QuietSparrow, 4th-year volunteer here. I went through the exact same thing last year. Day 1 is only 5% of companies. The placement process is a marathon with a huge luck factor on any given day. Skip the mess gossip for a couple of days if it triggers you, grab food with a friend who understands, and review what you learned from yesterday. You have months of great hiring drives ahead. You are NOT behind!',
        createdAt: '1 hour ago',
        thanked: true,
      },
      {
        id: 'reply-2',
        authorPseudonym: 'HostelWanderer',
        isVolunteer: false,
        content:
          'Big hug. Comparison during placement season is the absolute worst. Took me 3 weeks of rejections before landing a role I actually love more than the Day 1 ones. Hang in there!',
        createdAt: '45 mins ago',
        thanked: false,
      },
    ],
  },
  {
    id: 'post-2',
    room: 'homesick',
    authorPseudonym: 'NorthernFern88',
    isVolunteer: false,
    title: 'First month in South India campus — language barrier & missing home food',
    content:
      'Moved from Lucknow to Chennai for engineering. Everything from the mess rasam to not understanding local Tamil outside campus is making me feel so isolated. I end up staying in my room all weekend. Does it get easier?',
    upvotes: 31,
    helpfulCount: 22,
    createdAt: '5 hours ago',
    flaggedForReview: false,
    replies: [
      {
        id: 'reply-3',
        authorPseudonym: 'WarmChaiVolunteer',
        isVolunteer: true,
        volunteerKarma: 98,
        content:
          'Welcome to Chennai! As a 3rd year who moved from Jaipur: the first 6 weeks are the hardest bump. A small tip: join one of the cultural clubs or sports hours in the evening. Most local batchmates are super sweet and will happily teach you basic Tamil phrases or show you the best Parotta & Dosa spots near the back gate. You will find your second family soon!',
        createdAt: '3 hours ago',
        thanked: true,
      },
    ],
  },
  {
    id: 'post-3',
    room: 'transitions',
    authorPseudonym: 'SilverSprout14',
    isVolunteer: false,
    title: 'Overwhelmed by syllabus speed compared to school',
    content:
      'In high school I had teachers explaining chapters for weeks. Here professors cover an entire unit in 3 lectures and ask us to read 40 research pages. I feel like I am drowning before midterms even start.',
    upvotes: 19,
    helpfulCount: 14,
    createdAt: '1 day ago',
    flaggedForReview: false,
    replies: [
      {
        id: 'reply-4',
        authorPseudonym: 'BookishOwl',
        isVolunteer: false,
        content:
          'Best hack: form a 3-person study pod where each person summarizes 1 lecture for the group. It cuts down reading time by 70%.',
        createdAt: '18 hours ago',
        thanked: true,
      },
    ],
  },
  {
    id: 'post-4',
    room: 'relationships',
    authorPseudonym: 'GentleBreeze12',
    isVolunteer: false,
    title: 'Saying no to toxic group project dynamics without drama',
    content:
      'Two seniors in our elective group are pushing all the documentation and coding onto me while taking credit. How do I politely set boundaries?',
    upvotes: 15,
    helpfulCount: 9,
    createdAt: '2 days ago',
    flaggedForReview: false,
    replies: [],
  },
  {
    id: 'post-5',
    room: 'research',
    authorPseudonym: 'LateNightScholar',
    isVolunteer: false,
    title: 'Guide rejecting thesis drafts for the 4th time',
    content:
      'Master’s thesis review tomorrow and my advisor tore apart my methodology again. Feeling like I am not cut out for academia.',
    upvotes: 12,
    helpfulCount: 8,
    createdAt: '3 days ago',
    flaggedForReview: false,
    replies: [],
  },
];

export const MOCK_CHECKINS = INITIAL_CHECKINS;
export const MOCK_FUTURE_MESSAGES = INITIAL_FUTURE_MESSAGES;
export const MOCK_PEER_POSTS = INITIAL_PEER_POSTS;

export const MOCK_ADMIN_DEPARTMENT_TRENDS: DepartmentTrend[] = [
  {
    department: 'Computer Science & Eng (CSE)',
    year: '3rd Year (Semester 5)',
    totalActiveStudents: 312,
    burnoutIndex: 78,
    stressSpikeRatio: 1.34,
    primaryStressors: ['Placement coding drives', 'Lab viva deadlines', 'Sleep debt (<5.5h avg)'],
    isSuppressed: false,
  },
  {
    department: 'Electronics & Comm (ECE)',
    year: '2nd Year (Semester 3)',
    totalActiveStudents: 184,
    burnoutIndex: 62,
    stressSpikeRatio: 1.15,
    primaryStressors: ['Signals & Systems syllabus load', 'Hostel transition'],
    isSuppressed: false,
  },
  {
    department: 'Mechanical Engineering',
    year: '4th Year (Semester 7)',
    totalActiveStudents: 140,
    burnoutIndex: 54,
    stressSpikeRatio: 0.98,
    primaryStressors: ['Core vs IT job dilemmas', 'Capstone design fabrication'],
    isSuppressed: false,
  },
  {
    department: 'Biotechnology & Life Sciences',
    year: '1st Year (Semester 1)',
    totalActiveStudents: 68,
    burnoutIndex: 48,
    stressSpikeRatio: 1.05,
    primaryStressors: ['Homesickness', 'Commute fatigue'],
    isSuppressed: false,
  },
  {
    department: 'Design & Interaction (B.Des)',
    year: 'Postgraduate (1st Year)',
    totalActiveStudents: 11, // Less than 15! Must be suppressed for k-anonymity privacy guarantee
    burnoutIndex: 0,
    stressSpikeRatio: 0,
    primaryStressors: [],
    isSuppressed: true,
  },
];

export const I18N_TEXT = {
  en: {
    appName: 'MindBridge 360',
    tagline: 'Your private, non-clinical college wellbeing space',
    studentSpace: 'Student Space',
    sanctuarySub: 'A warm, privacy-first sanctuary for Indian university life',
    onboardingTitle: 'Welcome to MindBridge 360',
    onboardingSub: 'A safe, judgment-free friend for your university journey.',
    privacyPledge: 'Zero Surveillance Guarantee',
    privacyPoints: [
      'Voluntary & Private: Your daily entries stay on your device or encrypted.',
      'Non-Clinical & Safe: No medical diagnoses or labels. Just genuine human-friendly support.',
      'Zero Faculty Tracking: Professors and admins only see aggregated campus trends (never names or individual logs).',
      'Human-First Care: The companion is a caring cartoon guide. If you need serious help, we immediately connect you to real human counsellors.',
    ],
    consentButton: 'I Understand & Agree (Start Freely)',
    skipPersonalization: 'Use Default Companion (Mithra)',
    customizeCompanion: 'Personalize My Companion',
    dailyCheckin: 'Daily Pulse',
    insights: 'Home / Insights',
    peerSupport: 'Peer Support Forum',
    talkToSomeone: 'Talk to Someone',
    parentToolkit: 'Parent Toolkit',
    adminAnalytics: 'Aggregated Analytics',
    needHelpNow: 'Need help right now?',
    crisisTag: 'Crisis Support',
    crisisSub: 'Free 24x7 confidential student support & helplines across India',
    streakSuffix: 'Day Check-in Streak',
    installApp: 'Install App',
    chatWith: 'Chat with',
    chatVoiceOn: 'Voice is ON',
    chatVoiceOff: 'Voice is OFF',
    typeMessagePlaceholder: 'Type your thoughts freely or tap prompts...',
    breathingPacer: '2-Min Calming Breathing Exercise',
    breatheIn: 'Breathe In (4s)',
    breatheHold: 'Hold (7s)',
    breatheOut: 'Breathe Out (8s)',
    startExercise: 'Start Breathing Pause',
    stopExercise: 'Stop',
    quickReflectTitle: 'How is your semester rhythm today?',
    quickReflectSub: 'Log your energy, stress, and sleep in 30 seconds.',
    startDailyPulseBtn: 'Log Today’s Pulse',
    openChatbotBtn: 'Open Companion Chat',
    listenAudio: 'Listen Voice',
    stopAudio: 'Stop Audio',
  },
  ta: {
    appName: 'மைண்ட்பிரிட்ஜ் 360',
    tagline: 'கல்லூரி மாணவர்களுக்கான பாதுகாப்பான நல்வாழ்வு தளம்',
    studentSpace: 'மாணவர் தளம்',
    sanctuarySub: 'இந்திய பல்கலைக்கழக மாணவர்களுக்கான பிரத்யேக பாதுகாப்பான நட்பு தளம்',
    onboardingTitle: 'மைண்ட்பிரிட்ஜ் 360-க்கு வரவேற்கிறோம்',
    onboardingSub: 'உங்கள் கல்லூரிப் பயணத்தில் எந்தவித முன்முடிவுகளும் இல்லாத ஒரு தோழன்.',
    privacyPledge: 'முழுமையான தனியுரிமை உத்தரவாதம்',
    privacyPoints: [
      'முற்றிலும் உங்கள் விருப்பம்: உங்கள் பதிவுகள் தனிப்பட்டவை மற்றும் பாதுகாப்பானவை.',
      'மருத்துவ முத்திரைகள் இல்லை: இது நண்பனைப் போன்ற ஒரு வழிகாட்டி.',
      'பேராசிரியர்களுக்கு தனிப்பட்ட தகவல்கள் தெரியாது: ஒட்டுமொத்த புள்ளிவிவரங்கள் மட்டுமே தெரியும்.',
      'மனித உதவி முதன்மையானது: தீவிர உதவி தேவைப்பட்டால் உடனே மனித ஆலோசகர்களுடன் இணைக்கப்படும்.',
    ],
    consentButton: 'புரிந்துகொண்டேன், தொடங்கவும்',
    skipPersonalization: 'வழக்கமான தோழன் (மித்ரா)',
    customizeCompanion: 'தோழனைத் தேர்ந்தெடுக்கவும்',
    dailyCheckin: 'தினசரி பல்ஸ்',
    insights: 'முகப்பு / போக்குகள்',
    peerSupport: 'தோழமை மன்றம்',
    talkToSomeone: 'ஆலோசகரிடம் பேசுக',
    parentToolkit: 'பெற்றோர் உரையாடல்',
    adminAnalytics: 'ஒட்டுமொத்த பகுப்பாய்வு',
    needHelpNow: 'உடனடி உதவி தேவையா?',
    crisisTag: 'அவசர உதவி',
    crisisSub: 'இந்தியா முழுவதும் 24x7 இலவச மாணவர் உதவி எண்கள்',
    streakSuffix: 'நாள் தொடர் பதிவு',
    installApp: 'செயலியை நிறுவுக',
    chatWith: 'உரையாடுங்கள்',
    chatVoiceOn: 'குரல் இயக்கத்தில் உள்ளது',
    chatVoiceOff: 'குரல் அணைக்கப்பட்டுள்ளது',
    typeMessagePlaceholder: 'உங்கள் மனதை வெளிப்படையாகப் பகிருங்கள்...',
    breathingPacer: '2 நிமிட மன அமைதி மூச்சுப் பயிற்சி',
    breatheIn: 'மூச்சை உள்ளிழுக்கவும் (4 வி)',
    breatheHold: 'அடக்கி வைக்கவும் (7 வி)',
    breatheOut: 'மூச்சை வெளியிடவும் (8 வி)',
    startExercise: 'மூச்சுப் பயிற்சியைத் தொடங்கு',
    stopExercise: 'நிறுத்து',
    quickReflectTitle: 'இன்றைய உங்கள் மனநிலை எப்படி இருக்கிறது?',
    quickReflectSub: 'தூக்கம், அழுத்தம் மற்றும் ஆற்றலை 30 நொடிகளில் பதிவு செய்யுங்கள்.',
    startDailyPulseBtn: 'இன்றைய பல்ஸ் பதிவு செய்',
    openChatbotBtn: 'தோழனுடன் பேசுக',
    listenAudio: 'குரலைக் கேட்க',
    stopAudio: 'குரலை நிறுத்து',
  },
  tanglish: {
    appName: 'MindBridge 360',
    tagline: 'College students-kaana private and safe wellbeing space',
    studentSpace: 'Student Space',
    sanctuarySub: 'Indian college life-ku oru safe, friendly sanctuary',
    onboardingTitle: 'Welcome to MindBridge 360',
    onboardingSub: 'College journey-la ungalukku support panna oru safe friend.',
    privacyPledge: '100% Privacy Guarantee',
    privacyPoints: [
      'Voluntary & Private: Unga daily entries unga phone-la mattumae safe-aa irukkum.',
      'Non-Clinical & Safe: Medical labels illai. Just genuine friendly support mattumae.',
      'Faculty Tracking Illai: Professors & admins individual details paakka mudiyadhu.',
      'Real Human Support: Companion oru friend maadhiri. Thevaipattaal real counsellors kooda connect pannuvom.',
    ],
    consentButton: 'Purinjikitten, Let’s Start',
    skipPersonalization: 'Default Companion (Mithra) Podhum',
    customizeCompanion: 'En Companion-ai Customize Panna',
    dailyCheckin: 'Daily Pulse',
    insights: 'Home / Insights',
    peerSupport: 'Peer Support Forum',
    talkToSomeone: 'Counsellor Kitta Pesunga',
    parentToolkit: 'Parents Toolkit',
    adminAnalytics: 'Campus Analytics',
    needHelpNow: 'Help thevaiya?',
    crisisTag: 'Crisis Support',
    crisisSub: 'All-India 24x7 free confidential student helplines',
    streakSuffix: 'Days Streak',
    installApp: 'App Install Panna',
    chatWith: 'Chat with',
    chatVoiceOn: 'Voice ON-la irukku',
    chatVoiceOff: 'Voice OFF-la irukku',
    typeMessagePlaceholder: 'Unga thoughts-ah inga type pannunga...',
    breathingPacer: '2-Mins Calm Breathing Exercise',
    breatheIn: 'Inhale Pannunga (4s)',
    breatheHold: 'Hold Pannunga (7s)',
    breatheOut: 'Exhale Pannunga (8s)',
    startExercise: 'Breathing Start Panna',
    stopExercise: 'Stop Panna',
    quickReflectTitle: 'Inniki semester rhythm eppadi irukku?',
    quickReflectSub: 'Unga stress, sleep and energy-ah 30 seconds-la record pannunga.',
    startDailyPulseBtn: 'Today’s Pulse Record Panna',
    openChatbotBtn: 'Companion Kooda Chat Panna',
    listenAudio: 'Voice Kettu Paarka',
    stopAudio: 'Voice Stop Panna',
  },
};
