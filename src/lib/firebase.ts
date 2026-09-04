import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  arrayUnion,
  increment,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  CheckinData,
  CompanionConfig,
  FutureMessage,
  PeerPost,
  PeerReply,
  CounsellorBooking,
  UserRole,
  AppLanguage,
  AcademicEvent,
  InterventionOutcome,
  PersonalCopingProfile,
} from '../types';

// Initialize Firebase App instance
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with custom databaseId if configured
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

// Error Handling conforming to FirestoreErrorInfo
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error Logged:', JSON.stringify(errInfo));
}

// Test Connection on Initial Boot
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline notice: client is running in local cached mode.');
    }
  }
}
testFirestoreConnection();

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Authentication Handlers
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.warn('Popup sign in failed, trying redirect fallback:', error);
    if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/cancelled-popup-request') {
      try {
        await signInWithRedirect(auth, googleProvider);
      } catch (redirectErr) {
        console.error('Redirect sign in failed:', redirectErr);
        throw redirectErr;
      }
    }
    throw error;
  }
};

export const signInAsGuest = async () => {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error('Anonymous sign in failed:', error);
    throw error;
  }
};

export const registerWithEmail = async (
  email: string,
  pass: string,
  displayName: string,
  extraProfile: {
    studentId?: string;
    department?: string;
    academicYear?: string;
    isHostel?: boolean;
    role?: UserRole;
  } = {}
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    const user = userCredential.user;
    if (displayName.trim()) {
      await updateProfile(user, { displayName: displayName.trim() });
    }
    await syncUserProfile(user, {
      displayName: displayName.trim() || 'Student',
      studentId: extraProfile.studentId || '',
      department: extraProfile.department || 'Computer Science & Engineering',
      academicYear: extraProfile.academicYear || '3rd Year',
      isHostel: extraProfile.isHostel ?? true,
      role: extraProfile.role || 'student',
    });
    return user;
  } catch (error) {
    console.error('Email registration error:', error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, pass: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
    return userCredential.user;
  } catch (error) {
    console.error('Email login error:', error);
    throw error;
  }
};

export const registerAdminWithPasskey = async (
  email: string,
  pass: string,
  passkey: string,
  displayName: string = 'Campus Administrator'
) => {
  const validPasskeys = ['MINDMITRA2026', 'ADMIN-CAMPUS-2026', 'DEVA-ADMIN'];
  if (!validPasskeys.includes(passkey.trim())) {
    throw new Error('Invalid Institutional Admin Passkey. Access Denied.');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    const user = userCredential.user;
    await updateProfile(user, { displayName: displayName.trim() || 'Wellness Admin' });
    
    // Register in admins collection and user profile as admin
    await setDoc(doc(db, 'admins', user.uid), {
      email: user.email,
      name: displayName.trim() || 'Campus Wellness Administrator',
      institution: 'Directorate of Student Wellness & Counselling',
      role: 'Super Admin',
      verifiedAt: serverTimestamp(),
    }, { merge: true });

    await syncUserProfile(user, {
      displayName: displayName.trim() || 'Wellness Admin',
      role: 'admin',
    });

    return user;
  } catch (error) {
    console.error('Admin registration error:', error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// User Profile Firestore Sync
export interface UserProfileDoc {
  uid: string;
  email: string | null;
  displayName: string | null;
  studentId?: string;
  department?: string;
  academicYear?: string;
  isHostel?: boolean;
  photoURL: string | null;
  role: UserRole;
  language: AppLanguage;
  theme: 'light' | 'dark';
  companion: CompanionConfig;
  onboarded: boolean;
  isAnonymous?: boolean;
  createdAt?: any;
  lastActive?: any;
}

export const syncUserProfile = async (
  user: FirebaseUser,
  additionalData: Partial<UserProfileDoc> = {}
): Promise<UserProfileDoc> => {
  const path = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    // Check if user is known admin email
    const isMasterAdmin = user.email === 'deva10042002@gmail.com';
    const computedRole = isMasterAdmin ? 'admin' : (additionalData.role || 'student');

    if (!snap.exists()) {
      const newProfile: UserProfileDoc = {
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || (user.isAnonymous ? 'Guest Student' : 'Student'),
        studentId: additionalData.studentId || '',
        department: additionalData.department || 'Computer Science & Engineering',
        academicYear: additionalData.academicYear || '3rd Year',
        isHostel: additionalData.isHostel ?? true,
        photoURL: user.photoURL || null,
        role: computedRole,
        language: additionalData.language || 'en',
        theme: additionalData.theme || 'light',
        companion: additionalData.companion || {
          name: 'Mithra',
          avatar: 'blob',
          tone: 'gentle',
          voiceEnabled: true,
        },
        onboarded: additionalData.onboarded ?? true,
        isAnonymous: user.isAnonymous,
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp(),
      };
      await setDoc(userRef, newProfile, { merge: true });

      if (isMasterAdmin) {
        // Auto-provision admins document
        await setDoc(doc(db, 'admins', user.uid), {
          email: user.email,
          name: user.displayName || 'Master Admin',
          institution: 'Campus Wellness Cell',
          role: 'Super Admin',
          verifiedAt: serverTimestamp(),
        }, { merge: true });
      }

      return newProfile;
    } else {
      const data = snap.data() as UserProfileDoc;
      const finalRole = isMasterAdmin ? 'admin' : (additionalData.role || data.role || 'student');
      const updated = {
        ...data,
        ...additionalData,
        role: finalRole,
        lastActive: serverTimestamp(),
      };
      await setDoc(userRef, updated, { merge: true });
      return updated;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || 'Student',
      photoURL: user.photoURL || null,
      role: additionalData.role || 'student',
      language: additionalData.language || 'en',
      theme: additionalData.theme || 'light',
      companion: additionalData.companion || {
        name: 'Mithra',
        avatar: 'blob',
        tone: 'gentle',
        voiceEnabled: true,
      },
      onboarded: true,
      isAnonymous: user.isAnonymous,
    };
  }
};

export const updateUserDoc = async (userId: string, data: Partial<UserProfileDoc>) => {
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { ...data, lastActive: serverTimestamp() }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

// Admin Verification Helpers
export const verifyAdminPasskey = async (
  user: FirebaseUser | null,
  passkey: string
): Promise<{ success: boolean; message: string }> => {
  const validPasskeys = ['MINDMITRA2026', 'ADMIN-CAMPUS-2026', 'DEVA-ADMIN'];
  const trimmed = passkey.trim();

  if (!validPasskeys.includes(trimmed)) {
    return { success: false, message: 'Invalid Admin Security Key. Please contact the campus wellness head.' };
  }

  if (user) {
    try {
      // Mark as admin in firestore
      await setDoc(doc(db, 'admins', user.uid), {
        email: user.email || 'anonymous-admin',
        name: user.displayName || 'Institutional Admin',
        institution: 'Student Wellness & Counselling Directorate',
        role: 'Wellness Admin',
        verifiedAt: serverTimestamp(),
      }, { merge: true });

      await updateUserDoc(user.uid, { role: 'admin' });
    } catch (e) {
      console.warn('Admin record write note:', e);
    }
  }

  return { success: true, message: 'Institutional Admin authentication verified successfully.' };
};

// Check-ins Cloud Synchronization
export const subscribeToCheckins = (
  userId: string,
  onData: (checkins: CheckinData[]) => void
) => {
  const path = 'checkins';
  try {
    const q = query(
      collection(db, 'checkins'),
      where('userId', '==', userId),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const items: CheckinData[] = [];
        snapshot.forEach((doc) => {
          const d = doc.data();
          items.push({
            id: doc.id,
            timestamp: d.timestamp,
            dateStr: d.dateStr,
            sleep: d.sleep ?? 3,
            stress: d.stress ?? 3,
            energy: d.energy ?? 3,
            social: d.social ?? 3,
            workload: d.workload ?? 3,
            journalNote: d.journalNote,
            voiceNoteUrl: d.voiceNoteUrl,
            voiceNoteDuration: d.voiceNoteDuration,
            isQuietPulse: d.isQuietPulse,
            quietPulseMood: d.quietPulseMood,
            streakDay: d.streakDay,
          });
        });
        onData(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (e) {
    handleFirestoreError(e, OperationType.LIST, path);
    return () => {};
  }
};

export const addCheckinToFirestore = async (userId: string, checkin: CheckinData) => {
  const path = `checkins/${checkin.id}`;
  try {
    const checkinRef = doc(db, 'checkins', checkin.id);
    await setDoc(checkinRef, {
      ...checkin,
      userId,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

// Future Capsule Messages Cloud Synchronization
export const subscribeToFutureMessages = (
  userId: string,
  onData: (messages: FutureMessage[]) => void
) => {
  const path = 'futureMessages';
  try {
    const q = query(
      collection(db, 'futureMessages'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const items: FutureMessage[] = [];
        snapshot.forEach((doc) => {
          const d = doc.data();
          items.push({
            id: doc.id,
            title: d.title,
            content: d.content,
            audioBlobUrl: d.audioBlobUrl,
            triggerTag: d.triggerTag || 'general',
            createdAt: d.createdAt,
            openedAt: d.openedAt,
            isOpened: d.isOpened ?? false,
          });
        });
        onData(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (e) {
    handleFirestoreError(e, OperationType.LIST, path);
    return () => {};
  }
};

export const addFutureMessageToFirestore = async (userId: string, msg: FutureMessage) => {
  const path = `futureMessages/${msg.id}`;
  try {
    const msgRef = doc(db, 'futureMessages', msg.id);
    await setDoc(msgRef, {
      ...msg,
      userId,
      serverCreatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const markFutureMessageOpenedInFirestore = async (msgId: string) => {
  const path = `futureMessages/${msgId}`;
  try {
    const msgRef = doc(db, 'futureMessages', msgId);
    await updateDoc(msgRef, {
      isOpened: true,
      openedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

// Community Peer Support Forum Synchronization
export const subscribeToPeerPosts = (onData: (posts: PeerPost[]) => void) => {
  const path = 'peerPosts';
  try {
    const q = query(collection(db, 'peerPosts'), orderBy('createdAt', 'desc'), limit(60));

    return onSnapshot(
      q,
      (snapshot) => {
        const items: PeerPost[] = [];
        snapshot.forEach((doc) => {
          const d = doc.data();
          items.push({
            id: doc.id,
            room: d.room || 'exams',
            authorPseudonym: d.authorPseudonym || 'Student',
            isVolunteer: d.isVolunteer || false,
            volunteerKarma: d.volunteerKarma,
            title: d.title || '',
            content: d.content || '',
            upvotes: d.upvotes ?? 0,
            helpfulCount: d.helpfulCount ?? 0,
            replies: d.replies || [],
            flaggedForReview: d.flaggedForReview || false,
            flagReason: d.flagReason,
            flaggedBy: d.flaggedBy,
            createdAt: d.createdAt || 'Recent',
          });
        });
        if (items.length > 0) {
          onData(items);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (e) {
    handleFirestoreError(e, OperationType.LIST, path);
    return () => {};
  }
};

export const addPeerPostToFirestore = async (userId: string, post: PeerPost) => {
  const path = `peerPosts/${post.id}`;
  try {
    const postRef = doc(db, 'peerPosts', post.id);
    await setDoc(postRef, {
      ...post,
      userId,
      serverCreatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const addPeerReplyToFirestore = async (
  postId: string,
  reply: PeerReply
) => {
  const path = `peerPosts/${postId}`;
  try {
    const postRef = doc(db, 'peerPosts', postId);
    await updateDoc(postRef, {
      replies: arrayUnion(reply),
      helpfulCount: increment(1),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const togglePostUpvoteInFirestore = async (postId: string, incrementVal: number) => {
  const path = `peerPosts/${postId}`;
  try {
    const postRef = doc(db, 'peerPosts', postId);
    await updateDoc(postRef, {
      upvotes: increment(incrementVal),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const flagPostInFirestore = async (postId: string, reason: string, userId: string) => {
  const path = `peerPosts/${postId}`;
  try {
    const postRef = doc(db, 'peerPosts', postId);
    await updateDoc(postRef, {
      flaggedForReview: true,
      flagReason: reason,
      flaggedBy: userId,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const dismissFlaggedPostInFirestore = async (postId: string) => {
  const path = `peerPosts/${postId}`;
  try {
    const postRef = doc(db, 'peerPosts', postId);
    await updateDoc(postRef, {
      flaggedForReview: false,
      flagReason: '',
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

// Counsellor Bookings
export const subscribeToBookings = (
  userId: string,
  onData: (bookings: CounsellorBooking[]) => void
) => {
  const path = 'counsellorBookings';
  try {
    const q = query(
      collection(db, 'counsellorBookings'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const items: CounsellorBooking[] = [];
        snapshot.forEach((doc) => {
          const d = doc.data();
          items.push({
            id: doc.id,
            urgency: d.urgency || 'routine',
            topic: d.topic || '',
            slotTime: d.slotTime || '',
            counsellorName: d.counsellorName || 'Campus Counsellor',
            counsellorTitle: d.counsellorTitle || 'Student Wellness Cell',
            mode: d.mode || 'in-person',
            status: d.status || 'booked',
            createdAt: d.createdAt || new Date().toISOString(),
            estimatedWaitMinutes: d.estimatedWaitMinutes ?? 10,
            followUpSchedule: d.followUpSchedule || [],
          });
        });
        onData(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (e) {
    handleFirestoreError(e, OperationType.LIST, path);
    return () => {};
  }
};

export const subscribeToAllBookingsForAdmin = (
  onData: (bookings: CounsellorBooking[]) => void
) => {
  const path = 'counsellorBookings';
  try {
    const q = query(
      collection(db, 'counsellorBookings'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const items: CounsellorBooking[] = [];
        snapshot.forEach((doc) => {
          const d = doc.data();
          items.push({
            id: doc.id,
            urgency: d.urgency || 'routine',
            topic: d.topic || '',
            slotTime: d.slotTime || '',
            counsellorName: d.counsellorName || 'Campus Counsellor',
            counsellorTitle: d.counsellorTitle || 'Student Wellness Cell',
            mode: d.mode || 'in-person',
            status: d.status || 'booked',
            createdAt: d.createdAt || new Date().toISOString(),
            estimatedWaitMinutes: d.estimatedWaitMinutes ?? 10,
            followUpSchedule: d.followUpSchedule || [],
          });
        });
        onData(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (e) {
    handleFirestoreError(e, OperationType.LIST, path);
    return () => {};
  }
};

export const saveBookingToFirestore = async (userId: string, booking: CounsellorBooking) => {
  const path = `counsellorBookings/${booking.id}`;
  try {
    const bookingRef = doc(db, 'counsellorBookings', booking.id);
    await setDoc(bookingRef, {
      ...booking,
      userId,
      serverCreatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const updateBookingStatusInFirestore = async (
  bookingId: string,
  status: 'booked' | 'in-progress' | 'completed'
) => {
  const path = `counsellorBookings/${bookingId}`;
  try {
    const bookingRef = doc(db, 'counsellorBookings', bookingId);
    await updateDoc(bookingRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

// Academic Events Synchronization
export const subscribeToAcademicEvents = (
  userId: string,
  onData: (events: AcademicEvent[]) => void
) => {
  const path = 'academicEvents';
  try {
    const q = query(
      collection(db, 'academicEvents'),
      where('userId', '==', userId),
      orderBy('dateStr', 'asc')
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const items: AcademicEvent[] = [];
        snapshot.forEach((doc) => {
          const d = doc.data();
          items.push({
            id: doc.id,
            title: d.title || '',
            category: d.category || 'internal-exam',
            dateStr: d.dateStr || '',
            daysRemaining: d.daysRemaining ?? 0,
            weight: d.weight || 'high',
            notes: d.notes,
          });
        });
        onData(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (e) {
    handleFirestoreError(e, OperationType.LIST, path);
    return () => {};
  }
};

export const addAcademicEventToFirestore = async (userId: string, event: AcademicEvent) => {
  const path = `academicEvents/${event.id}`;
  try {
    const eventRef = doc(db, 'academicEvents', event.id);
    await setDoc(eventRef, {
      ...event,
      userId,
      serverCreatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const deleteAcademicEventFromFirestore = async (eventId: string) => {
  const path = `academicEvents/${eventId}`;
  try {
    const eventRef = doc(db, 'academicEvents', eventId);
    await deleteDoc(eventRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// Intervention Outcomes Synchronization
export const subscribeToInterventionOutcomes = (
  userId: string,
  onData: (outcomes: InterventionOutcome[]) => void
) => {
  const path = 'interventionOutcomes';
  try {
    const q = query(
      collection(db, 'interventionOutcomes'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const items: InterventionOutcome[] = [];
        snapshot.forEach((doc) => {
          const d = doc.data();
          items.push({
            id: doc.id,
            userId: d.userId,
            interventionType: d.interventionType,
            interventionName: d.interventionName,
            preStress: d.preStress ?? 50,
            postStress: d.postStress ?? 50,
            delta: d.delta ?? 0,
            timestamp: d.timestamp,
            dateStr: d.dateStr,
            feedback: d.feedback,
            contextTag: d.contextTag,
            durationSeconds: d.durationSeconds,
          });
        });
        onData(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (e) {
    handleFirestoreError(e, OperationType.LIST, path);
    return () => {};
  }
};

export const addInterventionOutcomeToFirestore = async (
  userId: string,
  outcome: InterventionOutcome
) => {
  const path = `interventionOutcomes/${outcome.id}`;
  try {
    const outRef = doc(db, 'interventionOutcomes', outcome.id);
    await setDoc(outRef, {
      ...outcome,
      userId,
      serverCreatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

// Personal Coping Profile Cloud Sync
export const subscribeToPersonalCopingProfile = (
  userId: string,
  onData: (profile: PersonalCopingProfile | null) => void
) => {
  const path = `copingProfiles/${userId}`;
  try {
    const profileRef = doc(db, 'copingProfiles', userId);
    return onSnapshot(
      profileRef,
      (snap) => {
        if (snap.exists()) {
          onData(snap.data() as PersonalCopingProfile);
        } else {
          onData(null);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (e) {
    handleFirestoreError(e, OperationType.GET, path);
    return () => {};
  }
};

export const updatePersonalCopingProfileInFirestore = async (
  userId: string,
  profile: PersonalCopingProfile
) => {
  const path = `copingProfiles/${userId}`;
  try {
    const profileRef = doc(db, 'copingProfiles', userId);
    await setDoc(
      profileRef,
      {
        ...profile,
        userId,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const savePersonalCopingProfileToFirestore = updatePersonalCopingProfileInFirestore;
