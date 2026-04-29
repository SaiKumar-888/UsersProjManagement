import fs from "node:fs";
import dotenv from "dotenv";
import app from "./app.js";

const envFileByNodeEnv: Record<string, string> = {
  local: ".env.local",
  development: ".env.local",
  staging: ".env.staging",
  production: ".env.production",
  docker: ".env.docker",
  test: ".env.test"
};

const selectedEnvFile =
  envFileByNodeEnv[process.env.NODE_ENV ?? "development"] ?? ".env.local";

const envFileToLoad = fs.existsSync(selectedEnvFile)
  ? selectedEnvFile
  : ".env";

// ✅ Only load dotenv locally (not in production like Render)
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: envFileToLoad });
}

const parsedPort = Number.parseInt(process.env.PORT ?? "", 10);
const PORT = Number.isNaN(parsedPort) ? 5000 : parsedPort;

// ✅ Required for cloud platforms
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Usage
// Run with the environment you want, for example:

// NODE_ENV=staging npm run dev
// NODE_ENV=production npm run start
// NODE_ENV=docker docker compose up --build
