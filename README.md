# Antara

**Generative AI-powered Mental Wellness Solution for Students**

## Overview
Antara is a simple, engaging tool that leverages Generative AI (DeepSeek) to help students monitor and improve their mental well-being during high-stakes board exams and competitive entrance tests (e.g., NEET, JEE, CUET). 

## Challenge Vertical
**Student Mental Wellness & Companionship**

## Features
- **Daily Journaling:** Open-ended journal logging.
- **AI Mood Analysis:** Analyzes hidden stress triggers and emotional patterns that standard trackers miss.
- **AI Companion:** A highly-contextual conversational AI that provides real-time tailored coping strategies and motivational encouragement.

## Approach & Logic
- **Frontend Framework:** Built with React and Vite for optimal performance and a clean, responsive UI.
- **Styling:** Vanilla CSS with modern aesthetics (glassmorphism, gradient text, CSS animations) keeping bundle size tiny.
- **AI Integration:** Connects seamlessly to the DeepSeek Chat API. The user's journal entries provide context to the AI, allowing it to act as an empathetic, always-available digital companion tailored specifically for academic stress.

## How it works
1. Students log their thoughts in the "Daily Check-In".
2. The dashboard updates visualizing stress, focus, and positivity.
3. If high stress is detected, actionable UI alerts are shown.
4. Students can chat in real-time with the Antara Companion sidebar to receive tailored wellness advice.

## Assumptions
- A valid DeepSeek API key is provided via `.env`.
- Students have internet access to interact with the LLM API.

## Running Locally
```bash
npm install
npm run dev
```
