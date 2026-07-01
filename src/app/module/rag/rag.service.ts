import { empty, sqltag as sql } from "@prisma/client/runtime/client";
import { prisma } from "../../lib/prisma";
import { EmbeddingService } from "./embedding.service";
import { IndexingService } from "./indexing.service";

export class RAGService{
  private embeddingService: EmbeddingService;
  private llmService: LLMService;
  private indexingService: IndexingService;
     
  constructor() {
    this.embeddingService = new EmbeddingService();
    // this.llmService = new LLMService();
    this.indexingService = new IndexingService();
  }

  async ingestDoctorData(){
    return this.indexingService.indexDoctorsData();
  }

  async retieveRelevantDocuments(query: string, limit: number = 5, sourceType?: string) {
    try {
      const queryEmbedding = await this.embeddingService.generateEmbedding(query);
      const vectorLiteral = `[${queryEmbedding.join(",")}]`;
      
      const result = await prisma.$queryRaw(sql`
        SELECT
          "id",
          "chunkKey",
          "sourceType",
          "sourceId",
          "sourceLabel",
          "content",
          "metadata",
          "embedding",
          "isDeleted",
          "deletedAt",
          "createdAt",
          "updatedAt",
          1 - ("embedding" <=> CAST(${vectorLiteral} AS vector)) AS "similarity"
        FROM "document_embeddings"
        WHERE "isDeleted" = false
        ${sourceType ? sql`AND "sourceType" = ${sourceType}` : empty}
        ORDER BY embedding <=> CAST(${vectorLiteral} AS vector)
        LIMIT ${limit}
      `);
  
      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to retrieve relevant documents");
    }
  }


  async generateAnswer(query: string,limit: number = 5,sourceType?: string,asJson: boolean = false){
    try {
      const releventDocs = await this.retieveRelevantDocuments(query, limit, sourceType);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const context = releventDocs.filter((doc: any) => doc.content).map((doc: any) => doc.content);
     


      let answer = await this.llmService.generateAnswer(query, context, asJson);

    } catch (error) {
      console.log(error);
      throw new Error("Failed to generate answer");
    }

  }
     
}
