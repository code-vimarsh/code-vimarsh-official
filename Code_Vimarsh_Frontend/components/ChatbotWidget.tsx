import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateChatResponse } from '../services/geminiService';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Hi! I'm Vimarsh AI. How can I help you navigate the coding club today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    const response = await generateChatResponse(userMsg);
    
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsTyping(false);
  };

  const handleQuickAction = (text: string) => {
    setInput(text);
    // Slight delay to simulate user typing before sending
    setTimeout(() => {
      document.getElementById('chatbot-send-btn')?.click();
    }, 100);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] bg-surface border border-surfaceLight rounded-xl shadow-2xl overflow-hidden flex flex-col"
            style={{ height: '500px' }}
          >
            {/* Header */}
            <div className="p-4 bg-surfaceLight border-b border-surfaceLight flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Cpu size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm">Vimarsh AI</h3>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-accentGreen rounded-full animate-pulse"></div>
                    <span className="text-xs text-textMuted">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-textMuted hover:text-white transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-black rounded-tr-sm' 
                        : 'bg-surfaceLight border border-surfaceLight text-textMain rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-surfaceLight border border-surfaceLight p-3 rounded-lg rounded-tl-sm flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-textMuted rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-textMuted rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-textMuted rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions (only show if few messages) */}
            {messages.length < 3 && !isTyping && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {['Suggest project idea', 'How to join?'].map((btn) => (
                  <button 
                    key={btn}
                    onClick={() => handleQuickAction(btn)}
                    className="text-xs bg-bgDark border border-surfaceLight px-2 py-1 rounded-md text-textMuted hover:text-primary hover:border-primary/50 transition-colors"
                  >
                    {btn}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-surfaceLight bg-bgDark flex items-center space-x-2">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Vimarsh AI..."
                className="flex-1 bg-surface border border-surfaceLight rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 text-white"
              />
              <button 
                id="chatbot-send-btn"
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-2 bg-primary text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-[0_0_20px_rgba(255,106,0,0.3)] transition-all duration-300 ${
          isOpen ? 'bg-surfaceLight text-textMuted' : 'bg-primary text-black hover:scale-105'
        }`}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>
    </div>
  );
};

export default ChatbotWidget;