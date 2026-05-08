import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Trash2, Bot, User } from 'lucide-react';
import useStore from '../../store/useStore';
import { getAiResponse } from '../../services/aiService';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { 
    chatMessages, addChatMessage, clearChat, 
    issPosition, speedHistory, currentLocationName, 
    totalAstronauts, astronauts, newsArticles,
    isDarkMode 
  } = useStore();
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input, timestamp: Date.now() };
    addChatMessage(userMsg);
    setInput('');
    setIsTyping(true);

    const currentSpeed = speedHistory.length > 0 
      ? speedHistory[speedHistory.length - 1].speed.toFixed(2) 
      : '0';

    const context = {
      issData: {
        latitude: issPosition.latitude,
        longitude: issPosition.longitude,
        speed: currentSpeed,
        locationName: currentLocationName,
        astronautCount: totalAstronauts,
        astronauts: astronauts.map(a => a.name)
      },
      newsData: newsArticles.slice(0, 5).map(a => ({ title: a.title }))
    };

    try {
      const response = await getAiResponse(input, context);
      addChatMessage({ role: 'bot', text: response, timestamp: Date.now() });
    } catch (error) {
      addChatMessage({ role: 'bot', text: "Error connecting to AI service.", timestamp: Date.now() });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999]">
      {/* Chat Window */}
      {isOpen && (
        <div className={`absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[500px] flex flex-col glass dark:glass-dark rounded-3xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-5`}>
          {/* Header */}
          <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold">Dashboard AI</h3>
                <p className="text-[10px] opacity-80">Online | Knowledge Restricted</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={clearChat}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Clear Chat"
              >
                <Trash2 size={18} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {chatMessages.length === 0 && (
              <div className="text-center py-10 space-y-2">
                <Bot className="mx-auto text-slate-300 dark:text-slate-600" size={40} />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Ask me about ISS position, speed, astronauts, or latest news!
                </p>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask dashboard..."
                className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white text-sm"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl disabled:opacity-50 hover:bg-indigo-700 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 transition-all duration-300 hover:scale-110 active:scale-95 relative group"
      >
        <MessageSquare size={28} />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-ping group-hover:hidden"></span>
      </button>
    </div>
  );
};

export default Chatbot;
