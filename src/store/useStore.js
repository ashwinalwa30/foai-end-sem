import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // Theme State
      isDarkMode: true,
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      // ISS State
      issPosition: { latitude: 0, longitude: 0, timestamp: 0 },
      issHistory: [], // Last 15 positions
      speedHistory: [], // Last 30 readings
      astronauts: [],
      totalAstronauts: 0,
      currentLocationName: 'Ocean/Unknown',
      
      setIssPosition: (pos) => {
        const history = [...get().issHistory, pos].slice(-15);
        set({ issPosition: pos, issHistory: history });
      },
      
      setSpeedReading: (reading) => {
        const history = [...get().speedHistory, reading].slice(-30);
        set({ speedHistory: history });
      },
      
      setAstronauts: (data) => set({ 
        astronauts: data.people, 
        totalAstronauts: data.number 
      }),
      
      setLocationName: (name) => set({ currentLocationName: name }),

      // News State
      newsArticles: [],
      newsLoading: false,
      newsCategory: 'technology',
      newsSearch: '',
      
      setNewsArticles: (articles) => set({ newsArticles: articles }),
      setNewsLoading: (loading) => set({ newsLoading: loading }),
      setNewsCategory: (category) => set({ newsCategory: category }),
      setNewsSearch: (search) => set({ newsSearch: search }),

      // Chat State
      chatMessages: [],
      addChatMessage: (msg) => {
        const messages = [...get().chatMessages, msg].slice(-30);
        set({ chatMessages: messages });
      },
      clearChat: () => set({ chatMessages: [] }),
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({ 
        isDarkMode: state.isDarkMode,
        chatMessages: state.chatMessages,
      }),
    }
  )
);

export default useStore;
