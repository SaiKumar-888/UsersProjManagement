import express from "express";
import cors from "cors";
import helmet from "helmet";
import routesIndex from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

// Middlewares
app.use(cors()); // Enable cross-origin requests
app.use(helmet()); // Add common security headers
app.use(express.json()); // Parse incoming JSON payloads

// Routes
app.use("/api/v1", routesIndex);

// Global error handler
app.use(errorMiddleware);
export default app;