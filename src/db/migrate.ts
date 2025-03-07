import "dotenv/config";
import { migrate } from "drizzle-orm/libsql/migrator";
import { client, db } from ".";
import { createTestUsers } from "../scripts/create-test-user";

(async () => {
  await migrate(db, { migrationsFolder: "./migrations" });
  client.close();
})();

// createTestUsers().catch(console.error);
