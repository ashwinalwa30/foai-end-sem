# ISS Tracker + News Dashboard + AI Chatbot

A production-ready React dashboard that tracks the International Space Station in real-time, displays latest news articles, and features an AI chatbot restricted to the dashboard data.

## Features

- **Live ISS Tracking**: Real-time position polling (every 15s), trajectory mapping, and speed calculation.
- **News Dashboard**: Categorized latest news articles with 15-minute caching and filtering.
- **AI Chatbot**: Powered by Mistral-7B, strictly constrained to answer based on live dashboard context.
- **Data Visualization**: Interactive charts for ISS speed trends and news distribution.
- **Modern UI**: Dark/Light mode support, glassmorphism design, and fully responsive layout.

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Calls**: Axios
- **Maps**: Leaflet.js
- **Charts**: Chart.js
- **Icons**: Lucide React

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory and add your API keys:
   ```env
   VITE_NEWS_API_KEY=your_newsapi_key
   VITE_AI_TOKEN=your_huggingface_token
   ```

3. **Run Locally**:
   ```bash
   npm run dev
   ```

## Deployment on Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables**:
   Go to the Vercel dashboard for your project and add `VITE_NEWS_API_KEY` and `VITE_AI_TOKEN` to the Environment Variables section.

## Haversine Formula

The speed calculation uses the Haversine formula to determine the distance between consecutive coordinates:

```javascript
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  // ... formula implementation
};
```
