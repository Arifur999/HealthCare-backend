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


    async generateAnswer(prompt: string, context: string[]=[], asJson: boolean = false) {
        try {
            const response = await fetch(`${this.apiUrl}/completions`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: this.llmModel,
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful assistant that provides information based on the provided context. If the answer is not present in the context, respond with 'I don't know'.",
                        },
                        {
                            role: "user",
                            content: `Answer the following question based on the provided context. If the answer is not present in the context, respond with 'I don't know'.\n\nContext: ${context.join("\n")}\n\nQuestion: ${query}`,
                        },
                    ],
                    max_tokens: 1000,
                }),
            }); 
}