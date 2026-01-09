import { GoogleGenAI, Type } from "@google/genai";
import { InterviewSuggestion, ResumeReviewResult } from "../types";

// Helper to lazy-load the client. Prevents white-screen crash on app load if API_KEY is missing.
const getAI = () => {
  // Use the injected process.env.API_KEY. Fallback to a placeholder if missing to allow app to render.
  const apiKey = process.env.API_KEY || 'MISSING_KEY'; 
  return new GoogleGenAI({ apiKey });
};

// Models
const TEXT_MODEL = 'gemini-3-flash-preview';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

/**
 * Generates interview answers or CRM scenario solutions.
 */
export const generateInterviewAnswers = async (
  contextText: string,
  imageBase64?: string,
  mimeType?: string
): Promise<InterviewSuggestion[]> => {
  const model = imageBase64 ? IMAGE_MODEL : TEXT_MODEL;
  const ai = getAI();
  
  const systemInstruction = `You are a Senior Airline Captain and Pilot Career Mentor. 
  Your goal is to help low-time pilots with interviews, technical knowledge, and weather analysis.
  
  The user will provide one of the following:
  1. An interview question.
  2. A technical question or scenario.
  3. A raw weather report (METAR, TAF, or PIREP).

  IF it is a WEATHER REPORT:
  Provide 3 breakdowns:
  1. "Plain English" - Decode the entire report clearly.
  2. "Hazards & Limitations" - Identify flight category (VFR/IFR), freezing levels, crosswinds, or thunderstorms.
  3. "Decision Making" - Would you fly? What are the alternates? (Assume a Cessna 172 or Piper Seminole).

  IF it is an INTERVIEW/SCENARIO:
  Provide 3 distinct response approaches:
  1. The "STAR Method" (Situation, Task, Action, Result).
  2. The "CRM Focused" - Highlighting leadership and error management.
  3. The "Technical/Direct" - Concise and accurate.

  Return the result as a JSON array.`;

  const prompt = `Here is the input: "${contextText}". 
  ${imageBase64 ? "I have also attached an image relevant to the scenario (e.g., chart, panel, diagram)." : ""}
  Generate 3 response/analysis options.`;

  const parts: any[] = [{ text: prompt }];
  
  if (imageBase64 && mimeType) {
    parts.unshift({
      inlineData: {
        data: imageBase64,
        mimeType: mimeType,
      },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              style: { type: Type.STRING },
              response: { type: Type.STRING },
              crmFocus: { type: Type.STRING },
            },
            required: ["style", "response", "crmFocus"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as InterviewSuggestion[];
  } catch (error) {
    console.error("Error generating interview answers:", error);
    throw error;
  }
};

/**
 * Analyzes a pilot resume or logbook page.
 */
export const reviewResume = async (
  imageBase64: string,
  mimeType: string
): Promise<ResumeReviewResult> => {
  const ai = getAI();
  const systemInstruction = `You are a Chief Pilot and Aviation Recruiter.
  Analyze the provided image (Pilot Resume or Logbook page).
  Your goal is to help a "Low Timer" pilot stand out.
  
  Look for: formatting, clarity of flight hours, highlighting of soft skills/CRM, and professionalism.
  Rate it out of 10.
  Identify Strengths and Weaknesses.
  Give specific improvements to help them get their first job.
  Be strict but encouraging.`;

  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType,
            },
          },
          {
            text: "Audit this document for a pilot job application. Give me a score, summary, strengths, weaknesses, and improvements.",
          },
        ],
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["score", "summary", "strengths", "weaknesses", "improvements"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as ResumeReviewResult;
  } catch (error) {
    console.error("Error reviewing resume:", error);
    throw error;
  }
};

/**
 * General chat with the WingMentor.
 */
export const sendChatMessage = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string
) => {
  const ai = getAI();
  try {
    const chat = ai.chats.create({
      model: TEXT_MODEL,
      history: history,
      config: {
        systemInstruction: `You are WingMentor, an experienced Airline Captain and Career Mentor for new pilots. 
        You speak with authority, encouragement, and deep industry knowledge.
        You can also act as a Digital E6B Flight Computer.
        If asked to calculate something (time, speed, distance, fuel, wind correction), provide the formula used and the precise result.
        Understand the struggle of "Low Timers" (pilots with ~200 hours).
        Focus on CRM (Crew Resource Management), professionalism, and perseverance.`,
      },
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("Error in chat:", error);
    throw error;
  }
};