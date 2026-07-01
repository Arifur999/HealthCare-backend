import { env } from "../../../config/env";

export class LLMService {
    private apiKey: string;
    private apiUrl: string = "https://openrouter.ai/api/v1";
    private llmModel: string;
    constructor() {
        this.apiKey = env.RAG.OPENROUTER_API_KEY || "";
        this.llmModel = env.RAG.OPENROUTER_LLM_MODEL || "nvidia/nemotron-3-ultra-550b-a55b:free";
    
    if (!this.apiKey) {
      throw new Error("OPENROUTER_API_KEY is not set in .env"); 
    }
    
    }
}