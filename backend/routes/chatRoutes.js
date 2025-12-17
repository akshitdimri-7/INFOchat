// import express from "express";
// import multer from "multer";
// import { createRequire } from "module";

// const require = createRequire(import.meta.url);
// const pdfParse = require("pdf-parse");

// import {
//   newChat,
//   sendMessage,
//   uploadDocument,
//   uploadImage,
// } from "../controllers/chatController.js";

// import { getGeminiResponse } from "../utils/gemini.js";

// const router = express.Router();

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// });

// // =========================
// // In-memory state (DEV ONLY)
// // =========================
// let chatHistory = [];
// let documentText = "";
// let imageBase64 = null;

// // =========================
// // Simple rate limiter
// // =========================
// let lastRequestTime = 0;

// function rateLimit(req, res, next) {
//   const now = Date.now();

//   if (now - lastRequestTime < 1000) {
//     return res.status(429).json({ error: "Too many requests" });
//   }

//   lastRequestTime = now;
//   next();
// }

// // =========================
// // New chat
// // =========================
// router.post("/new", (req, res) => {
//   chatHistory = [];
//   documentText = "";
//   imageBase64 = null;

//   res.json({ message: "New chat created" });
// });

// // =========================
// // Simple chat (text only)
// // =========================
// router.post("/chat", rateLimit, async (req, res) => {
//   try {
//     const reply = await getGeminiResponse(req.body.message);
//     res.json({ reply });
//   } catch (error) {
//     console.error("Chat error:", error);
//     res.status(503).json({ error: "Gemini unavailable" });
//   }
// });

// // =========================
// // Full chat (history + image + doc)
// // =========================
// router.post("/message", rateLimit, async (req, res) => {
//   try {
//     const { message } = req.body;

//     if (!message || message.trim() === "") {
//       return res.status(400).json({ error: "Message cannot be empty" });
//     }

//     chatHistory.push({ role: "user", content: message });

//     const reply = await getGeminiResponse(
//       chatHistory,
//       imageBase64,
//       documentText
//     );

//     chatHistory.push({ role: "model", content: reply });

//     res.json({ reply });
//   } catch (error) {
//     console.error("Message error:", error);
//     res.status(503).json({ error: "Failed to generate response" });
//   }
// });

// // =========================
// // Upload document (PDF)
// // =========================
// router.post("/upload/document", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const parsed = await pdfParse(req.file.buffer);
//     documentText = parsed.text;

//     res.json({ message: "Document uploaded successfully" });
//   } catch (error) {
//     console.error("Document upload error:", error);
//     res.status(500).json({ error: "Failed to upload document" });
//   }
// });

// // =========================
// // Upload image
// // =========================
// router.post("/upload/image", upload.single("image"), (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No image uploaded" });
//     }

//     imageBase64 = {
//       data: req.file.buffer.toString("base64"),
//       mimeType: req.file.mimetype,
//     };

//     res.json({ message: "Image uploaded successfully" });
//   } catch (error) {
//     console.error("Image upload error:", error);
//     res.status(500).json({ error: "Failed to process image" });
//   }
// });

// export default router;

import express from "express";
import multer from "multer";

import {
  newChat,
  sendMessage,
  uploadDocument,
  uploadImage,
} from "../controllers/chatController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post("/new", newChat);
router.post("/message", sendMessage);
router.post("/upload/document", upload.single("file"), uploadDocument);
router.post("/upload/image", upload.single("image"), uploadImage);

export default router;
