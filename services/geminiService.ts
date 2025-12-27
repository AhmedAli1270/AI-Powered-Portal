import { GoogleGenAI } from "@google/genai";
import { SearchResult, SourceItem } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize client
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const analyzeTopic = async (topic: string): Promise<SearchResult> => {
  if (!API_KEY) {
    throw new Error("API Key is missing.");
  }

  const model = "gemini-2.5-flash";
  
  const systemInstruction = `
    You are the "PakGov Intel" engine, a specialized AI for tracking Pakistan Government initiatives, policies, and news.
    
    Your goal is to crawl for the latest information on the USER TOPIC within the context of Pakistan.
    
    Focus on:
    1. Federal and Provincial Government official announcements.
    2. New Policy frameworks or Legal updates.
    3. Major development projects (CPEC, PSDP, etc.).
    4. Statements from key ministries (Finance, IT, Planning, etc.).
    
    Format your response in CLEAN MARKDOWN. 
    Use the following structure exactly:
    
    # 🚨 Executive Brief
    (A 2-3 sentence high-level summary of the current status)

    # 🏛️ Key Government Initiatives
    (Bulleted list of specific programs, funds, or projects launched)

    # 📜 Policy & Regulation
    (Updates on laws, taxes, SROs, or compliance requirements)

    # 🗣️ Official Narrative
    (What key officials/Ministers are saying)

    # 🔮 Strategic Impact
    (Brief analysis of the long-term effect on Pakistan)
    
    If no specific government news is found, provide a general status update on the sector in Pakistan.
    Keep the tone professional, objective, and authoritative.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `Find the latest government news and policy updates in Pakistan regarding: "${topic}". Prioritize sources from the last 30 days.`,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster response on flash
      },
    });

    const markdownReport = response.text || "No report generated.";
    
    // Extract sources from grounding chunks
    const sources: SourceItem[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "Unknown Source",
            uri: chunk.web.uri || "#",
            source: new URL(chunk.web.uri).hostname.replace('www.', '')
          });
        }
      });
    }

    // De-duplicate sources based on URI
    const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());

    return {
      markdownReport,
      sources: uniqueSources
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
