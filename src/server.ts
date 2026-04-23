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

// Determine which env file to use based on NODE_ENV, default to "development"
const selectedEnvFile = envFileByNodeEnv[process.env.NODE_ENV ?? "development"] ?? ".env.local";

// Check if the selected env file exists, otherwise fallback to ".env"
const envFileToLoad = fs.existsSync(selectedEnvFile) ? selectedEnvFile : ".env";

// Load environment variables from the file
dotenv.config({ path: envFileToLoad });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


// Usage
// Run with the environment you want, for example:

// NODE_ENV=staging npm run dev
// NODE_ENV=production npm run start
// NODE_ENV=docker docker compose up --build
