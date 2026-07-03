import {createClient,RedisClientType} from "redis";


class RedisService {
    private client: RedisClientType | null = null;
    private isConnected: boolean = false;

    async connect() : Promise<void> {
        try {
            const redisUrl = process.env.REDIS_URL;
            this.client = createClient({url: redisUrl});

            this.client.on("error", (err) => {
                console.error("Redis Client Error", err);
                this.isConnected = false;
            
            });
            this.client.on("connect", () => {
                console.log("Redis Client Connected");
                this.isConnected = true;
            });
            this.client.on("ready", () => {
                console.log("Redis Client Ready");
                this.isConnected = true;
            });
            this.client.on("reconnecting", () => {
                console.log("Redis Client Reconnecting");
                this.isConnected = false;
            });
            this.client.on("end", () => {
                console.log("Redis Client Disconnected");
                this.isConnected = false;
            });

            await this.client.connect();
        


        }catch (error) {
            console.error("Error connecting to Redis:", error);
            throw error;
        }
    }
        private ensureConnected(): RedisClientType {
            if (!this.client ){
                throw new Error("Redis client is not initialized. Call connect() first.");
            }


            if (!this.isConnected) {
                throw new Error("Redis client is not connected.");
            }

            return this.client;
        
    }
}


export const redisService = new RedisService();