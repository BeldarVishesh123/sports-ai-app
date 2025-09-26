🏆 SIH Hackathon Project – AI-Powered Sports Assessment Platform
📌 Overview

This project is developed for the Smart India Hackathon (SIH).
Our solution is an AI-powered assessment platform that leverages modern technologies to assist in analyzing user performance, monitoring daily activities, and providing intelligent insights.

The platform includes:

A React + Vite + TypeScript frontend with TailwindCSS for fast and responsive UI.

A FastAPI backend that runs ML/AI models to generate predictions.

Supabase integration for authentication and secure storage.

✨ Features

🔐 Authentication System – Face Capture for user login.

📊 Dashboard – Fetches AI-powered predictions from the backend.

📝 Assessment Screen – Users can input answers, tasks, or responses and submit them.

📅 Daily Activity Screen – Tracks and visualizes daily routines or activity logs.

⚡ Fast and Scalable – Built using Vite and FastAPI for optimal performance.

☁️ Supabase Integration – Secure authentication & storage.

🛠️ Tech Stack

Frontend: React, TypeScript, Vite, TailwindCSS

Backend: FastAPI (Python)

Database & Auth: Supabase

Machine Learning: Custom prediction model (FastAPI endpoint)
🚀 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
2️⃣ Setup Frontend (React + Vite)
cd frontend   # if your frontend folder is named "frontend"
npm install
npm run dev
3️⃣ Setup Backend (FastAPI)
cd backend   # if backend code is in "backend" folder
pip install -r requirements.txt
uvicorn main:app --reload
