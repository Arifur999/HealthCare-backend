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
            this.isConnected = false;
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


    async get(key: string): Promise<string | null> {
        try {
            const client = this.ensureConnected();
            return await client.get(key);
        } catch (error) {
            console.error("Error getting Redis key:", error);
           return null;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async set(key: string, value: any, ttlInSeconds: number): Promise<void> {
        try {
            const client = this.ensureConnected();
            const stringValue = typeof value === "string" ? value : JSON.stringify(value);
            await client.set(key, stringValue, { EX: ttlInSeconds });
        } catch (error) {
            console.error("Error setting Redis key:", error);
            
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async update(key: string, value: any, ttlInSeconds: number): Promise<void> {
        try {
            const client = this.ensureConnected();
            const stringValue = typeof value === "string" ? value : JSON.stringify(value);
            await client.set(key, stringValue, { EX: ttlInSeconds });
        } catch (error) {
            console.error("Error updating Redis key:", error);
            
        }

    }

    async delete(key: string): Promise<void> {
        try {
            const client = this.ensureConnected();
            await client.del(key);
        } catch (error) {
            console.error("Error deleting Redis key:", error);
            
        }
    }




}


export const redisService = new RedisService();