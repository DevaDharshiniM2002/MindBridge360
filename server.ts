import express, { Request, Response } from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy/Safe Gemini initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    app: "MindBridge 360",
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// Companion Chat Endpoint
app.post("/api/companion/chat", async (req: Request, res: Response) => {
  try {
    const {
      message,
      history = [],
      companion = { name: "Mithra", tone: "gentle", avatar: "blob" },
      language = "auto",
      recentCheckin = null,
    } = req.body;

    const toneInstructions: Record<string, string> = {
      gentle: "Speak softly, with deep empathy, validation, and zero judgment. Like a quiet cup of warm chai with a supportive close friend.",
      upbeat: "Be encouraging, warm, optimistic and energizing, while remaining respectful and validating of hard emotions.",
      "straight-talking": "Be pragmatic, honest, grounded, concise and action-oriented without being harsh or dismissive.",
    };

    const systemPrompt = `You are ${companion.name || "Mithra"}, an original friendly student companion character on the MindBridge 360 platform for Indian college students.
Role & Identity Rules:
- You are a supportive cartoon/abstract companion friend, NEVER a doctor, psychologist, psychiatrist, or real identifiable human.
- Never claim to diagnose mental health disorders (do not say 'you have clinical depression' or 'you have generalized anxiety').
- Tone: ${toneInstructions[companion.tone] || toneInstructions.gentle}
- Multilingual & Voice Intelligence (English, தமிழ் (Tamil), and Tanglish):
  - Seamlessly detect the language of the student's message (Tamil script, Tanglish/Romanized Tamil words like 'Vanakkam, enakku romba stress-aa irukku / exam tension / mudiyala', or English).
  - Always respond in the EXACT same language and script style the student used:
    1. If the student speaks/writes in Tamil script, reply in warm, comforting conversational Tamil script.
    2. If the student speaks/writes in Tanglish (Tamil in English alphabet, e.g., 'Enna aachu?', 'Don't worry nanba, naan unga kooda irukken. Take a slow breath.'), reply in conversational, modern student Tanglish.
    3. If the student speaks/writes in English, reply in natural, supportive English tailored for Indian university students.
  - If language parameter '${language}' is specified as 'ta', prefer Tamil; if 'tanglish', prefer Tanglish; if 'en', prefer English; if 'auto', match the user's input language.
- Cultural Context: You understand Indian college realities: internal exams, semester crunches, placements, hostel food, family expectations, mess food, commuting, and viva stress.
- Safety & Crisis Protocol: If the student expresses severe despair, self-harm thoughts, or overwhelming crisis, immediately and warmly validate their pain and explicitly guide them to human help (campus counsellor or 24x7 Tele-MANAS 14416 / iCall 9152987821 / Vandrevala 9999 666 555). Do not try to resolve a crisis entirely on your own.
- Keep responses conversational, comforting, and concise (2-3 short paragraphs max) so it sounds natural in both voice chat playback and text.`;

    const ai = getGeminiClient();
    if (ai) {
      const contents = [
        ...history.slice(-6).map((h: { role: string; content: string }) => ({
          role: h.role === "assistant" ? "model" : "user",
          parts: [{ text: h.content }],
        })),
        {
          role: "user",
          parts: [
            {
              text: `${recentCheckin ? `[Context: Student's recent checkin: Stress=${recentCheckin.stress}/5, Sleep=${recentCheckin.sleep}/5, Energy=${recentCheckin.energy}/5]` : ""}
Student says: ${message}`,
            },
          ],
        },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      return res.json({ reply: response.text });
    }

    // High quality offline fallback
    let fallbackReply = `I hear you, and it's completely okay to feel this way right now. University life can get really overwhelming between exams, deadlines, and just taking care of yourself. Take a slow breath — you don't have to carry everything in one single evening. What's one small thing that would give you 5 minutes of relief right now?`;
    if (companion.tone === "upbeat") {
      fallbackReply = `Hey, thank you for sharing that with me! Even on heavy days, you're doing so much just by showing up. Let's break things down into bite-sized steps so it doesn't feel like a huge mountain. What would feel good to tackle first, or do you just need a quick break?`;
    } else if (companion.tone === "straight-talking") {
      fallbackReply = `I get it. College workload piles up fast and ignoring it only adds friction. Let's look at today pragmatically: what is the single non-negotiable thing you actually need to do, and what can wait until tomorrow? Let's take it one item at a time.`;
    }

    return res.json({ reply: fallbackReply });
  } catch (error: any) {
    console.error("Companion chat error:", error);
    res.json({
      reply: "I'm right here with you. Take a slow, calm breath. Even when things feel tangled, you don't have to figure everything out right this second.",
    });
  }
});

// "Explain This to My Parents" Generator Endpoint
app.post("/api/parent-toolkit/generate", async (req: Request, res: Response) => {
  try {
    const {
      topic = "burnout",
      customDetails = "",
      language = "en",
      parentStyle = "traditional", // traditional, open, worried
    } = req.body;

    const systemPrompt = `You are a compassionate communication assistant on MindBridge 360, helping Indian university students communicate their wellbeing, stress, and need for support or rest to their Indian parents.
Goals:
1. De-stigmatize mental health and exhaustion for Indian parents without sounding aggressive, disrespectful, or overly clinical.
2. Use respectful, loving, culturally grounded phrasing (referencing dedication to studies, wanting to perform sustainably, needing their blessing/understanding).
3. Produce:
   - A ready-to-copy WhatsApp/SMS message (with placeholders like [Mom/Papa] if applicable)
   - 3 bullet tips for how and when to initiate the conversation (e.g. over phone on Sunday morning, not during busy work hours)
   - Anticipated parent reactions and gentle reassuring replies.
Output in JSON format with keys: "message", "tips", "suggestedTiming", "translatedSummary".
Target Language for message: ${language === "ta" ? "Tamil (Tamil script + English summary)" : language === "tanglish" ? "Tanglish (Tamil in English/Latin script + English summary)" : "English (polite, culturally tuned for Indian families)"}.`;

    const ai = getGeminiClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `Topic: ${topic}
Parent Dynamic: ${parentStyle}
Student's Specific Experience: ${customDetails || "Feeling exhausted by semester exams, struggling with sleep, and thinking about speaking to a campus counsellor for guidance."}`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    }

    // High quality offline template fallback
    const fallbackMap: Record<string, any> = {
      en: {
        message:
          "Dear Mom and Papa,\n\nI wanted to share something with you honestly. Lately, with the semester coursework and upcoming exams, the pace has been quite intense, and I’ve been feeling physically and mentally drained. I am working hard and want to do well, but I also realized I need to pace myself better and get proper rest so I don't burn out.\n\nOur campus has a student wellbeing centre with guidance counsellors who help students manage study stress and focus better. I am thinking of having a quick session with them this week just to build better study routines. I wanted to keep you in the loop because your support means everything to me.\n\nLove you both, talk to you soon!",
        tips: [
          "Send this via WhatsApp or call them during a relaxed time (e.g., weekend afternoon, not a rushed weekday morning).",
          "Reassure them that you are taking proactive care of yourself, not failing your studies.",
          "Frame counselling as a routine coaching resource, similar to a sports coach or academic tutor.",
        ],
        suggestedTiming: "Weekend afternoon or after Sunday dinner when parents are relaxed.",
        translatedSummary: "Polite, loving message framing stress management as a healthy tool for academic longevity.",
      },
      tanglish: {
        message:
          "Dear Amma & Appa,\n\nUnga kitta oru vishayam open-aa share pannanum nu ninaichen. Recent-aa semester portion load and viva prep-naala konjam physically & mentally tired-aa irukku. Naan nalla padikka try panren, aana continuous stress handle panna proper rest and study balance theva-padudhu.\n\nNamma college-la student wellbeing centre irukku, anga guidance counsellors study pressure handle panna help panraanga. Naan indha week oru chinna guidance session attend panna ninaikiren. Ungalukku theriya paduthuna unga support and blessings irukkum nu thonichu.\n\nSeekiram phone panren, take care!",
        tips: [
          "Indha text WhatsApp-la anuppitu relaxed time-la phone panni pesunga.",
          "Stress handle panna guidance eduthukradhu oru positive step nu unarthunga.",
          "Ungalukku avanga blessings and support evlo mukkiyam nu sollunga.",
        ],
        suggestedTiming: "Sunday afternoon or evening relaxed-aa irukkum bodhu.",
        translatedSummary: "Respectful Tanglish message reassuring parents while communicating the need for guidance.",
      },
      ta: {
        message:
          "அன்புள்ள அம்மா, அப்பா,\n\nஉங்களிடம் ஒரு விஷயம் வெளிப்படையாகப் பேச விரும்பினேன். கடந்த சில வாரங்களாக செமஸ்டர் தேர்வுகள் மற்றும் ப்ராஜெக்ட் வேலைகளால் எனக்கு உடல் மற்றும் மனதளவில் கொஞ்சம் சோர்வாக இருக்கிறது. நான் நன்றாகப் படிக்கவே விரும்புகிறேன், ஆனால் இந்த அழுத்தத்தைக் கையாள சரியான ஓய்வும் வழிகாட்டுதலும் தேவைப்படுகிறது.\n\nநமது கல்லூரியில் உள்ள கவுன்சிலிங் மையத்தில் மாணவர்கள் படிப்பில் சிறப்பாக கவனம் செலுத்த ஆலோசனை வழங்குகிறார்கள். நான் அங்கு சென்று ஆலோசனை பெறலாம் என்று நினைக்கிறேன். உங்கள் ஆசியும் ஆதரவும் எப்போதும் எனக்கு முக்கியம்.\n\nவிரைவில் போனில் பேசுகிறேன்!",
        tips: [
          "வார இறுதியில் அமைதியான நேரத்தில் இந்த மெசேஜை அனுப்பிவிட்டு பின்னர் போனில் பேசவும்.",
          "இது கல்வி அழுத்தத்தை சமன்செய்யும் ஒரு ஆரோக்கியமான முயற்சி என்பதை அவர்களுக்கு உணர்த்தவும்.",
          "அவர்களின் ஆதரவு உங்களுக்கு எவ்வளவு தைரியம் தருகிறது என்பதைக் குறிப்பிடவும்.",
        ],
        suggestedTiming: "ஞாயிறு பிற்பகல் அல்லது மாலை நேரம்.",
        translatedSummary: "பெற்றோரின் ஆதரவை அன்புடன் நாடும் மரியாதையான செய்தி.",
      },
    };

    return res.json(fallbackMap[language] || fallbackMap.en);
  } catch (error: any) {
    console.error("Parent toolkit error:", error);
    res.status(500).json({ error: "Failed to generate parent message template." });
  }
});

// Start server and mount Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MindBridge 360 server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
