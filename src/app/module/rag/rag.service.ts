import { EmbeddingService } from "./embedding.service";
import { IndexingService } from "./indexing.service";

export class RAGService{
  private embeddingService: EmbeddingService;
  // private llmService: LLMService;
  private indexingService: IndexingService;
     
  constructor() {
    this.embeddingService = new EmbeddingService();
    // this.llmService = new LLMService();
    this.indexingService = new IndexingService();
  }

  async ingestDoctorData(){
    return this.indexingService.indexDoctorsData();
  }

  async generateAnswer(query: string,limit: number = 5,sourceType?: string,asJson: boolean = false){
    try {
      const result = await this.indexingService.queryDocuments(query, limit, sourceType, asJson);
      return {
        answer: result.answer,
        sources: result.sources,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to generate answer");
    }

  }
     
}