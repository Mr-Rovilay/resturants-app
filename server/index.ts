import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";


dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Update CORS configuration to allow your Render frontend URL
const allowedOrigins = [
  "http://localhost:5173",  // Local development
  process.env.FRONTEND_URL, // Your Render frontend URL
];

// Middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Routes


// Root route
app.get("/", (req, res) => {
  res.send("API Server Running Successfully");
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: "error",
    message: "Something broke!",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

startServer();