// import { createChat, getChat } from "../store/chatStore.js";
// import { getGeminiResponse } from "../utils/gemini.js";
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// const pdfParse = require("pdf-parse");

// export const newChat = (req, res) => {
//   const chatId = Date.now().toString();
//   createChat(chatId);
//   res.json({ chatId });
// };

// export const sendMessage = async (req, res) => {
//   try {
//     const { chatId, message } = req.body;

//     if (!chatId || !message?.trim()) {
//       return res.status(400).json({ error: "Invalid request" });
//     }

//     const chat = getChat(chatId);
//     if (!chat) {
//       return res.status(400).json({ error: "Invalid chatId" });
//     }

//     chat.messages.push({ role: "user", content: message });

//     const reply = await getGeminiResponse(
//       chat.messages,
//       chat.image,
//       chat.documentText
//     );

//     chat.messages.push({ role: "model", content: reply });

//     res.json({ reply });
//   } catch (error) {
//     console.error("Message error:", error);
//     res.status(503).json({ error: "Failed to generate response" });
//   }
// };

// export const uploadDocument = async (req, res) => {
//   try {
//     const { chatId } = req.body;
//     const chat = getChat(chatId);

//     if (!chat || !req.file) {
//       return res.status(400).json({ error: "Invalid request" });
//     }

//     const parsed = await pdfParse(req.file.buffer);
//     chat.documentText += `\n${parsed.text}`;

//     res.json({ message: "Document uploaded successfully" });
//   } catch (error) {
//     console.error("Document upload error:", error);
//     res.status(500).json({ error: "Failed to upload document" });
//   }
// };

// export const uploadImage = (req, res) => {
//   try {
//     const { chatId } = req.body;
//     const chat = getChat(chatId);

//     if (!chat || !req.file) {
//       return res.status(400).json({ error: "Invalid request" });
//     }

//     chat.image = {
//       data: req.file.buffer.toString("base64"),
//       mimeType: req.file.mimetype,
//     };

//     res.json({ message: "Image uploaded successfully" });
//   } catch (error) {
//     console.error("Image upload error:", error);
//     res.status(500).json({ error: "Failed to process image" });
//   }
// };

import { createRequire } from "module";
import { createChat, getChat } from "../store/chatStore.js";
import { getGeminiResponse } from "../utils/gemini.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const newChat = (req, res) => {
  const chatId = Date.now().toString();
  createChat(chatId);
  res.json({ chatId });
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;

    if (!chatId || !message?.trim()) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const chat = getChat(chatId);
    if (!chat) {
      return res.status(400).json({ error: "Invalid chatId" });
    }

    chat.messages.push({ role: "user", content: message });

    const reply = await getGeminiResponse(
      chat.messages,
      chat.image,
      chat.documentText
    );

    chat.messages.push({ role: "model", content: reply });

    res.json({ reply });
  } catch (error) {
    console.error("Message error:", error);
    res.status(503).json({ error: "Failed to generate response" });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    const { chatId } = req.body;
    const chat = getChat(chatId);

    if (!chat || !req.file) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const parsed = await pdfParse(req.file.buffer);
    chat.documentText += `\n${parsed.text}`;

    res.json({ message: "Document uploaded successfully" });
  } catch (error) {
    console.error("Document upload error:", error);
    res.status(500).json({ error: "Failed to upload document" });
  }
};

export const uploadImage = (req, res) => {
  try {
    const { chatId } = req.body;
    const chat = getChat(chatId);

    if (!chat || !req.file) {
      return res.status(400).json({ error: "Invalid request" });
    }

    chat.image = {
      data: req.file.buffer.toString("base64"),
      mimeType: req.file.mimetype,
    };

    res.json({ message: "Image uploaded successfully" });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ error: "Failed to process image" });
  }
};
