import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../components/UI/Navbar';
import IssMap from '../components/ISS/IssMap';
import IssStats from '../components/ISS/IssStats';
import NewsList from '../components/News/NewsList';
import NewsFilters from '../components/News/NewsFilters';
import SpeedChart from '../components/Charts/SpeedChart';
import NewsChart from '../components/Charts/NewsChart';
import Chatbot from '../components/Chatbot/Chatbot';
import useStore from '../store/useStore';
import { fetchIssLocation, fetchAstronauts, fetchLocationName } from '../services/issService';
import { fetchNews } from '../services/newsService';
import { calculateDistance, calculateSpeed } from '../utils/haversine';
import { RefreshCw, Map as MapIcon, Newspaper, BarChart3, Info } from 'lucide-react';

const Dashboard = () => {
  const { 
    isDarkMode, issPosition, setIssPosition, 
    setSpeedReading, setAstronauts, setLocationName,
    newsCategory, setNewsArticles, setNewsLoading
  } = useStore();
  
  const [error, setError] = useState(null);

  const updateIssData = useCallback(async () => {
    try {
      const newPos = await fetchIssLocation();
      
      // Calculate speed if we have a previous position
      if (issPosition.latitude !== 0) {
        const distance = calculateDistance(
          issPosition.latitude, issPosition.longitude,
          newPos.latitude, newPos.longitude
        );
        const timeDiff = newPos.timestamp - issPosition.timestamp;
        const speed = calculateSpeed(distance, timeDiff);
        
        // Filter out extreme values (often due to API glitches)
        if (speed < 40000 && speed > 0) {
          setSpeedReading({ speed, timestamp: newPos.timestamp });
        }
      }
      
      setIssPosition(newPos);
      
      // Update location name periodically (every 1 min or major movement)
      const locName = await fetchLocationName(newPos.latitude, newPos.longitude);
      setLocationName(locName);
      
      setError(null);
    } catch (err) {
      console.error('ISS Update Error:', err);
      setError('Failed to update ISS data. Retrying...');
    }
  }, [issPosition, setIssPosition, setSpeedReading, setLocationName]);

  const updateNews = useCallback(async () => {
    setNewsLoading(true);
    try {
      const articles = await fetchNews(newsCategory);
      setNewsArticles(articles);
    } catch (err) {
      console.error('News Update Error:', err);
    } finally {
      setNewsLoading(false);
    }
  }, [newsCategory, setNewsArticles, setNewsLoading]);

  // Initial Data Fetch
  useEffect(() => {
    const init = async () => {
      const astros = await fetchAstronauts();
      setAstronauts(astros);
      updateIssData();
      updateNews();
    };
    init();
  }, []);

  // ISS Polling (15 seconds)
  useEffect(() => {
    const interval = setInterval(updateIssData, 15000);
    return () => clearInterval(interval);
  }, [updateIssData]);

  // News Category Switch
  useEffect(() => {
    updateNews();
  }, [newsCategory, updateNews]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 animate-pulse">
            <Info size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* ISS Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-xl">
                <MapIcon className="text-indigo-500" />
              </div>
              ISS Live Tracker
            </h2>
            <button 
              onClick={updateIssData}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20"
            >
              <RefreshCw size={18} />
              <span className="hidden sm:inline">Refresh Map</span>
            </button>
          </div>
          
          <div className="space-y-6">
            <IssStats />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <IssMap />
              </div>
              <div className="space-y-6">
                <SpeedChart />
                <div className="glass dark:glass-dark p-6 rounded-3xl border border-white/10">
                   <h3 className="font-bold mb-4 flex items-center gap-2">
                      <BarChart3 className="text-indigo-500" size={20} />
                      Real-time Analytics
                   </h3>
                   <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      The ISS travels at approximately 28,000 km/h, orbiting Earth every 90 minutes. We calculate live speed using coordinate delta.
                   </p>
                   <div className="flex items-center gap-3 p-3 bg-indigo-500/10 rounded-xl text-indigo-500 text-xs font-bold uppercase tracking-wider">
                      <Activity size={16} className="animate-pulse" />
                      Live Polling Active (15s)
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* News Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <Newspaper className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold">Orbit Insight News</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <NewsFilters onRefresh={updateNews} />
              <NewsList />
            </div>
            <div className="space-y-6">
              <NewsChart />
              <div className="glass dark:glass-dark p-6 rounded-3xl border border-white/10">
                <h4 className="font-bold mb-2">Did you know?</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Space-related news is cached for 15 minutes to save bandwidth. You can manually refresh to get breaking updates.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          © 2024 ISS Orbit Dashboard • Powered by React & OpenData
        </p>
      </footer>

      <Chatbot />
    </div>
  );
};

// Simple utility icon for footer/analytics
const Activity = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);

export default Dashboard;
