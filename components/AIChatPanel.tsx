
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { AIMessage } from '../types';
import { sendMessageToDoubao } from '../services/doubaoService';

interface AIChatPanelProps {
  location: string;
}

export const AIChatPanel: React.FC<AIChatPanelProps> = ({ location }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<AIMessage[]>([
    { id: '1', role: 'ai', text: `Hi! Nice to meet you. I am TuT. , your personalized travel assistant. I see you're planning a trip to ${location || 'somewhere new'}. How can I help you plan your itinerary?` }
  ]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const newMsg: AIMessage = { id: Date.now().toString(), role: 'user', text: userText };
    
    // 1. Add User Message
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // 2. Call API Service
      const aiResponseText = await sendMessageToDoubao(updatedMessages, location);
      
      // 3. Add AI Response
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: aiResponseText
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: "Sorry, something went wrong. Please check your connection."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Updated background to bg-gray-900 (solid/high opacity) to seamlessly merge with the tab header
    <div className="w-full h-full flex flex-col bg-gray-900 p-4 overflow-hidden">
      
      {/* Header text inside panel is removed/simplified since we have the tab now, or we keep a minimal greeting */}
      <div className="flex items-center gap-2 border-b border-gray-700/50 pb-2 mb-2 shrink-0 opacity-80">
        <Bot className="text-green-400" size={16} />
        <span className="font-['Caveat'] text-lg text-gray-300">TuT.</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 thin-scrollbar-dark">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'}`}>
              {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className={`rounded-2xl px-4 py-2 max-w-[85%] font-['Caveat'] text-xl leading-7 shadow-sm whitespace-pre-wrap ${
              msg.role === 'ai' ? 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700' : 'bg-blue-900/30 text-blue-100 rounded-tr-none border border-blue-800/50'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-green-900/30 text-green-400">
              <Bot size={16} />
            </div>
            <div className="bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700 rounded-2xl px-4 py-2 flex items-center gap-2">
              <Loader2 size={18} className="animate-spin text-gray-400" />
              <span className="font-['Caveat'] text-xl text-gray-400">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-4 relative shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
          placeholder={isLoading ? "Please wait..." : "Ask for suggestions..."}
          disabled={isLoading}
          className={`w-full bg-gray-800 border border-gray-700 rounded-full py-3 pl-5 pr-14 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30 font-['Caveat'] text-xl transition-opacity ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <button 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full text-white transition-all flex items-center justify-center shadow-lg active:scale-95 ${
            isLoading || !input.trim() ? 'bg-gray-700 text-gray-500' : 'bg-green-700/80 hover:bg-green-600'
          }`}
        >
          <Send size={18} className="translate-x-px translate-y-px" />
        </button>
      </div>
    </div>
  );
};
