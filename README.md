🚀 Connect2Cure

AI-Powered Telemedicine Platform (MERN + WebRTC + AI)

Connect2Cure is a full-stack telemedicine platform that enables patients to consult doctors remotely through real-time chat and video calls, enhanced with AI-powered medical assistance and multilingual support.

🌐 Features
💬 Real-time Chat (Doctor ↔ Patient)
📹 Video Consultation (WebRTC-based)
🤖 AI Symptom Assistant (Gemini integration)
🌍 Regional Language Support (i18n)
📂 Secure File Uploads (AWS S3 for reports/images)
📄 OCR Processing (Extract text from medical documents)
💳 Online Appointment Booking (Stripe integration)
🔐 Authentication & Authorization (JWT-based)
📊 Downloadable Reports (PDF generation)

🏗️ Tech Stack
Frontend
React (Vite)
Tailwind CSS
Axios
i18next (Localization)
Socket.io Client
Backend
Node.js + Express
MongoDB (Mongoose)
Socket.io
JWT Authentication
Integrations
OpenAI API – AI chatbot
Amazon S3 – File storage
Stripe – Payments
Tesseract.js – OCR
Upstash Redis – Caching

⚙️ System Architecture
Client (React)
   ↓
API Server (Node.js + Express)
   ↓
MongoDB Database
   ↓
External Services:
   - OpenAI (AI responses)
   - AWS S3 (file storage)
   - Stripe (payments)
   - Redis (caching)
   - WebRTC (video calls)

🔄 Workflow
User registers / logs in
Patient interacts with AI chatbot for initial guidance
Patient books appointment via Stripe
Connects with doctor via chat or video call
Doctor updates medical records
Reports stored in AWS S3
User can download reports anytime

📁 Project Structure
connect2cure/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   └── utils/
│
└── README.md

▶️ Installation & Setup
1. Clone the repository
git clone https://github.com/your-username/connect2cure.git
cd connect2cure
2. Backend Setup
cd backend
npm install
npm run dev
3. Frontend Setup
cd frontend
npm install
npm run dev
