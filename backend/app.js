import "dotenv/config";
import express from "express";

import cors from "cors";



const app = express();


// Middlewares 
app.use(cors());
app.use(express.json()); 

// Routes
import chatRoutes from "./routes/chatRoutes.js";
app.use("/api/chat", chatRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
