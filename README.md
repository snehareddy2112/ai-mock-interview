# 🚀 AI Mock Interview Assistant

An AI-powered full-stack mock interview platform that simulates real
technical interviews, evaluates responses using AI, provides performance
analytics, and supports voice-to-text input.

🌐 **Live Demo:** https://ai-mock-interview-fawn-five.vercel.app\
🛠 **Backend API:** https://ai-mock-interview-ytpa.onrender.com

------------------------------------------------------------------------

## 🎯 Features

### 🔐 Authentication

-   Secure JWT-based login & registration
-   Protected dashboard routes
-   Demo account access for recruiters

### 🤖 AI-Powered Interview System

-   Dynamic question generation using OpenRouter API
-   AI-based answer evaluation
-   Score calculation per question
-   Smart follow-up question generation

### 📊 Performance Analytics

-   Score per question
-   Overall performance score
-   Visual progress chart
-   AI-generated strengths & improvement areas
-   Intelligent performance categorization:
    -   🎉 Excellent
    -   👍 Good
    -   ⚠ Needs Improvement
    -   ❌ Poor Performance

### 🎤 Voice-to-Text

-   Browser-based speech recognition
-   Real-time answer transcription
-   Hands-free interview simulation

### 📁 Session Management

-   Resume ongoing interviews
-   Interview history tracking
-   Session completion state
-   Persistent MongoDB storage

### 🧪 Demo Access

-   Instant demo login
-   No signup required for evaluation

------------------------------------------------------------------------

## 🏗 Tech Stack

### Frontend

-   Next.js (App Router)
-   React.js
-   Tailwind CSS
-   Recharts (Analytics Visualization)
-   Axios

### Backend

-   Node.js
-   Express.js
-   MongoDB Atlas
-   Mongoose
-   JWT Authentication
-   OpenRouter API (LLM Integration)

### Deployment

-   Frontend: Vercel
-   Backend: Render
-   Database: MongoDB Atlas

------------------------------------------------------------------------

## 🧠 System Architecture

Frontend (Next.js)\
⬇\
REST API (Express.js)\
⬇\
MongoDB Atlas\
⬇\
OpenRouter AI API

------------------------------------------------------------------------

## 📂 Project Structure

ai-mock-interview/ │ ├── client/ \# Next.js Frontend │ ├── src/app │ ├──
src/lib │ └── ... │ ├── server/ \# Express Backend │ ├── models/ │ ├──
routes/ │ ├── middleware/ │ └── server.js │ └── README.md

------------------------------------------------------------------------

## ⚙️ Local Setup Instructions

### 1️⃣ Clone Repository

git clone `<your-repo-url>`{=html} cd ai-mock-interview

------------------------------------------------------------------------

### 2️⃣ Backend Setup

cd server npm install

Create `.env` file:

MONGO_URI=your_mongodb_connection JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=your_api_key

Run backend:

npm run dev

------------------------------------------------------------------------

### 3️⃣ Frontend Setup

cd client npm install

Create `.env.local`:

NEXT_PUBLIC_API_URL=http://localhost:5000/api

Run frontend:

npm run dev

Open:

http://localhost:3000

------------------------------------------------------------------------

## 🌍 Production Environment Variables

### Backend (Render)

MONGO_URI=... JWT_SECRET=... OPENROUTER_API_KEY=...

### Frontend (Vercel)

NEXT_PUBLIC_API_URL=https://your-render-url.onrender.com/api

------------------------------------------------------------------------

## 🔐 Demo Credentials

Email: demo@aimock.com\
Password: Demo@123

------------------------------------------------------------------------

## 📈 Future Improvements

-   Resume-based personalized question generation
-   PDF interview report export
-   Difficulty level selection
-   Admin analytics dashboard
-   Full video interview mode
-   Multi-role simulation

------------------------------------------------------------------------

## 🎬 Demo Flow

1.  Open homepage\
2.  Click **Try Demo Now**\
3.  Start interview\
4.  Answer via typing or voice\
5.  Get AI feedback\
6.  View analytics & final score

