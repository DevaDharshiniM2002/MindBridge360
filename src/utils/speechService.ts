// Speech Synthesis Service for MindBridge 360 (English, Tamil & Tanglish)
import { AppLanguage, CompanionTone, CompanionAvatarType } from '../types';

let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesLoaded = false;

// Tamil Unicode to Phonetic Tanglish transliterator (ensures audio plays even on devices lacking Tamil TTS voice pack)
export function transliterateTamilToPhoneticTanglish(text: string): string {
  if (!text) return '';

  // Common phrase shortcuts for ultra natural pronunciation
  const commonMap: [RegExp, string][] = [
    [/வணக்கம்/g, 'Vanakkam'],
    [/மித்ரா/g, 'Mithra'],
    [/எப்படி/g, 'eppadi'],
    [/இருக்கீங்க/g, 'irukkeenga'],
    [/இருக்கிறீர்கள்/g, 'irukkeereergal'],
    [/நன்றி/g, 'nandri'],
    [/கல்லூரி/g, 'college'],
    [/பயப்படாதீங்க/g, 'bayappadadheenga'],
    [/மன அமைதி/g, 'mana amaithi'],
    [/மூச்சு/g, 'moochu'],
    [/ஆரோக்கியம்/g, 'aarokkiyam'],
    [/நான்/g, 'naan'],
    [/உங்களுடன்/g, 'ungaludan'],
    [/இருக்கிறேன்/g, 'irukkiraen'],
    [/உதவி/g, 'udhavi'],
    [/தேவையா/g, 'thevayaa'],
    [/இளைப்பாறுங்கள்/g, 'ilaippaarungal'],
    [/நண்பா/g, 'nanbaa'],
    [/தோழா/g, 'thozhaa'],
  ];

  let converted = text;
  for (const [pattern, replacement] of commonMap) {
    converted = converted.replace(pattern, replacement);
  }

  // If text contains remaining Tamil characters, do character-level mapping
  const hasTamil = /[\u0B80-\u0BFF]/.test(converted);
  if (!hasTamil) return converted;

  const vowels: Record<string, string> = {
    'அ': 'a', 'ஆ': 'aa', 'இ': 'i', 'ஈ': 'ee', 'உ': 'u', 'ஊ': 'oo',
    'எ': 'e', 'ஏ': 'ae', 'ஐ': 'ai', 'ஒ': 'o', 'ஓ': 'oh', 'ஔ': 'au',
    'ஃ': 'h'
  };

  const vowelSigns: Record<string, string> = {
    'ா': 'aa', 'ி': 'i', 'ீ': 'ee', 'ு': 'u', 'ூ': 'oo',
    'ெ': 'e', 'ே': 'ae', 'ை': 'ai', 'ொ': 'o', 'ோ': 'oh', 'ௌ': 'au',
    '்': ''
  };

  const consonants: Record<string, string> = {
    'க': 'k', 'ங': 'ng', 'ச': 's', 'ஞ': 'gn', 'ட': 't',
    'ண': 'n', 'த': 'th', 'ந': 'n', 'ப': 'p', 'ம': 'm',
    'ய': 'y', 'ர': 'r', 'ல': 'l', 'வ': 'v', 'ழ': 'zh',
    'ள': 'l', 'ற': 'r', 'ன': 'n', 'ஜ': 'j', 'ஷ': 'sh',
    'ஸ': 's', 'ஹ': 'h'
  };

  let result = '';
  const len = converted.length;
  for (let i = 0; i < len; i++) {
    const char = converted[i];
    const nextChar = i + 1 < len ? converted[i + 1] : '';

    if (vowels[char]) {
      result += vowels[char];
    } else if (consonants[char]) {
      const base = consonants[char];
      if (nextChar && vowelSigns[nextChar] !== undefined) {
        result += base + vowelSigns[nextChar];
        i++; // skip vowel sign
      } else {
        result += base + 'a';
      }
    } else if (vowelSigns[char]) {
      result += vowelSigns[char];
    } else {
      result += char;
    }
  }

  return result;
}

export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      cachedVoices = voices;
      voicesLoaded = true;
      resolve(voices);
      return;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      const updated = window.speechSynthesis.getVoices();
      cachedVoices = updated;
      voicesLoaded = true;
      resolve(updated);
    };

    // Fallback if event doesn't fire promptly
    setTimeout(() => {
      const fallback = window.speechSynthesis.getVoices();
      cachedVoices = fallback;
      voicesLoaded = true;
      resolve(fallback);
    }, 400);
  });
}

// Ensure voices are loaded immediately
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
}

export function findBestVoice(language: AppLanguage): { voice: SpeechSynthesisVoice | null; langCode: string; useTransliteration: boolean } {
  const voices = cachedVoices.length > 0 ? cachedVoices : (typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : []);

  if (language === 'ta') {
    // 1. Look for native Tamil voice (e.g., ta-IN, ta_LK, Google தமிழ், Tamil India, etc.)
    const tamilVoice = voices.find(v => 
      v.lang.toLowerCase().startsWith('ta') || 
      v.lang.toLowerCase().includes('tam') ||
      v.name.toLowerCase().includes('tamil') ||
      v.name.toLowerCase().includes('தமிழ்')
    );

    if (tamilVoice) {
      return { voice: tamilVoice, langCode: 'ta-IN', useTransliteration: false };
    }

    // 2. Fallback: If device lacks Tamil TTS voice engine, pick Indian English or smooth English voice with phonetics
    const indianEnglishVoice = voices.find(v => v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().includes('en_in') || v.name.toLowerCase().includes('india'));
    const anyEnglishVoice = indianEnglishVoice || voices.find(v => v.lang.toLowerCase().startsWith('en')) || voices[0] || null;

    return { voice: anyEnglishVoice, langCode: 'en-IN', useTransliteration: true };
  }

  if (language === 'tanglish') {
    // Tanglish sounds best on Indian English or clear English voice with smooth tempo
    const indianEnglish = voices.find(v => v.lang.toLowerCase().includes('en-in') || v.name.toLowerCase().includes('india'));
    const englishVoice = indianEnglish || voices.find(v => v.lang.toLowerCase().startsWith('en')) || voices[0] || null;
    return { voice: englishVoice, langCode: 'en-IN', useTransliteration: false };
  }

  // English (en)
  const englishIndian = voices.find(v => v.lang.toLowerCase().includes('en-in') || v.name.toLowerCase().includes('india'));
  const naturalEnglish = englishIndian || voices.find(v => v.lang.toLowerCase().startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium'))) || voices.find(v => v.lang.toLowerCase().startsWith('en')) || voices[0] || null;
  return { voice: naturalEnglish, langCode: 'en-IN', useTransliteration: false };
}

export interface SpeakOptions {
  text: string;
  language: AppLanguage;
  tone?: CompanionTone;
  avatar?: CompanionAvatarType;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export function speakText({
  text,
  language,
  tone = 'gentle',
  avatar = 'blob',
  onStart,
  onEnd,
  onError,
}: SpeakOptions): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onError?.(new Error('Speech synthesis not supported on this browser.'));
    return false;
  }

  try {
    window.speechSynthesis.cancel();

    // Clean markdown and symbols
    let cleaned = text
      .replace(/[*_#`~>[\]()]/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    if (!cleaned) {
      onEnd?.();
      return false;
    }

    const { voice, langCode, useTransliteration } = findBestVoice(language);

    // If Tamil and no Tamil voice installed in browser, transliterate to phonetic Tanglish
    if (language === 'ta' && useTransliteration) {
      cleaned = transliterateTamilToPhoneticTanglish(cleaned);
    }

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = langCode;

    if (voice) {
      utterance.voice = voice;
    }

    // Set natural rate and pitch based on companion tone and avatar
    if (tone === 'gentle') {
      utterance.rate = 0.88;
    } else if (tone === 'upbeat') {
      utterance.rate = 1.02;
    } else {
      utterance.rate = 0.95;
    }

    if (avatar === 'blob') {
      utterance.pitch = 1.1;
    } else if (avatar === 'owl') {
      utterance.pitch = 0.95;
    } else if (avatar === 'sprout') {
      utterance.pitch = 1.05;
    } else {
      utterance.pitch = 1.0;
    }

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      onEnd?.();
    };

    utterance.onerror = (e) => {
      // Ignore normal cancel interruptions
      if (e.error === 'canceled' || e.error === 'interrupted') {
        onEnd?.();
      } else {
        console.warn('SpeechSynthesis error:', e);
        onError?.(e);
        onEnd?.();
      }
    };

    // Unpause in case synthesis was paused
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Speech invocation failed:', err);
    onError?.(err);
    onEnd?.();
    return false;
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Auto-detect language of text (Tamil, Tanglish, or English)
export function detectTextLanguage(text: string): 'ta' | 'tanglish' | 'en' {
  if (!text) return 'en';

  // Check for Tamil Unicode characters
  if (/[\u0B80-\u0BFF]/.test(text)) {
    return 'ta';
  }

  // Common conversational Tanglish tokens
  const tanglishPatterns = [
    /\b(vanakkam|eppadi|irukku|irukken|irukkeenga|aachu|romba|panna|pannunga|mudiyala|mudiyum|enna|enga|inga|illana|theriyala|solla|pesu|pesunga|nanba|thozha|thozhi|machan|bro|akka|anna|amma|appa|veedu|college|exam|tension|bayam|porumai|kooda|mattum|seri|aama|illa|kavalapadatheenga|sapteengala|saptiya)\b/i,
    /\b(feel panren|stress aagudhu|bayama irukku|lonely-aa|tired-aa|overload-aa|tension-aa)\b/i,
  ];

  const lower = text.toLowerCase();
  for (const pattern of tanglishPatterns) {
    if (pattern.test(lower)) {
      return 'tanglish';
    }
  }

  return 'en';
}

// Check if browser supports Speech Recognition
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export interface SpeechRecognitionOptions {
  language: 'ta' | 'en' | 'tanglish';
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (error: any) => void;
  onEnd?: () => void;
  onStart?: () => void;
}

export interface RecognizerInstance {
  start: () => void;
  stop: () => void;
  abort: () => void;
}

// Create and configure a Speech Recognition instance
export function createSpeechRecognizer(options: SpeechRecognitionOptions): RecognizerInstance | null {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    options.onError?.(new Error('Speech recognition not supported in this browser.'));
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    // For Tamil use ta-IN; for English and Tanglish use en-IN / en-US
    if (options.language === 'ta') {
      recognition.lang = 'ta-IN';
    } else if (options.language === 'tanglish') {
      // Tanglish recognition: en-IN captures Romanized/Indian English phonetics well
      recognition.lang = 'en-IN';
    } else {
      recognition.lang = 'en-IN';
    }

    recognition.onstart = () => {
      options.onStart?.();
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTranscript += item[0].transcript;
        } else {
          interimTranscript += item[0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      const isFinal = Boolean(finalTranscript);
      options.onResult(text, isFinal);
    };

    recognition.onerror = (event: any) => {
      // Don't treat normal 'no-speech' or 'aborted' as fatal errors
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.warn('SpeechRecognition error:', event.error);
        options.onError?.(event);
      }
    };

    recognition.onend = () => {
      options.onEnd?.();
    };

    return {
      start: () => {
        try {
          recognition.start();
        } catch (e) {
          console.warn('Recognizer already running or failed to start:', e);
        }
      },
      stop: () => {
        try {
          recognition.stop();
        } catch (e) {
          // ignore
        }
      },
      abort: () => {
        try {
          recognition.abort();
        } catch (e) {
          // ignore
        }
      },
    };
  } catch (err) {
    console.error('Failed to init speech recognition:', err);
    options.onError?.(err);
    return null;
  }
}

