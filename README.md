**INFOchat**

**Overview**

This project is a minimal web-based chatbot built using Google Gemini API.
It supports text-based conversation, document upload, image upload, and basic chat context management, as required in the task specification.

access the project live: https://infochat-r8t5.onrender.com  (frontend)
                         https://chillchat-videocall-backend.onrender.com  (backend)
.

also any one can see the demo video at location: **frontend/public/demo.mp4**


The focus of this project is **API integration**, file handling, and simple in-memory state management, not advanced AI/ML techniques.


.

**Tech Stack**

**Frontend**

React,
Tailwind CSS,
Fetch API

**Backend**

Node.js,
Express,
Google Gemini API,
Multer (for file uploads),
Storage In-memory only (no database)

Project Structure

root
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
├── backend
│   ├── routes
│   ├── utils
│   ├── app.js
│   └── package.json
│
├── .gitignore
└── README.md

**Installation**

1. Clone the Repository
git clone https://github.com/akshitdimri-7/INFOchat.git
cd INFOchat

Environment Variables
Backend (backend/.env)

Create a .env file in the backend directory:

GEMINI_API_KEY=your_gemini_api_key
PORT=5000


.env is ignored by Git for security reasons.

Running the Application
Backend
cd backend
npm install
npm start


The backend will start on:

http://localhost:5000

Frontend
cd frontend
npm install
npm run dev


The frontend will start on:

http://localhost:5173

Usage Guide
Text Chat

Type a message

Click Send

View bot response

Document Q&A

Upload a PDF or TXT file

Ask questions related to the document

Image Q&A

Upload a PNG or JPG image

Ask questions about the image

New Chat

Click New Chat

Clears messages, uploaded files, and context

Error Handling

Displays “Thinking…” while waiting for response

If backend is overloaded:

Bot is currently overloaded. Please try again later.


If server is unreachable:

Unable to reach the server. Please try again later.

Deployment (Optional)

Backend: Render

Frontend: Render / Netlify / Vercel

Environment variables must be configured in the hosting platform dashboard.

Constraints Followed

No database used

No authentication

In-memory state only

No advanced RAG or embeddings

Only basic PDF/TXT parsing

PNG/JPG image uploads only

All constraints are strictly followed as per task instructions 

.

Author

Akshit Dimri
Software Developer Intern Candidate

Final Notes

This project fulfills all mandatory requirements of the task and includes optional bonus features such as multiple chats and loading indicators.
