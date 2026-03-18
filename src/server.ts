import app from "./app";
import { seedSuperAdmin } from "./app/utils/seed";
import { env } from "./config/env";



const bootstrap = async () => {
  try {
    await seedSuperAdmin();
    app.listen(env.PORT, () => {
      console.log(
        `Server is running on http://localhost:${env.PORT}`
      );
    }); 
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
}
bootstrap();