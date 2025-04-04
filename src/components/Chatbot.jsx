import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, Send, X, MinusCircle, Heart, Brain, Sparkles, Moon, Sun, Smile, Coffee, Music, CloudRain, CloudSun } from 'lucide-react';

const client = axios.create({
  baseURL: 'https://chatapi.akash.network/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sk-VeU_w9Wjl-xYW2XTkUP-Rg'
  }
});

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi, I'm your mental health companion. I'm here to listen and chat with you about anything that's on your mind. How are you feeling today?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isButtonPulsing, setIsButtonPulsing] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState('day');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const hour = new Date().getHours();
    setTimeOfDay(hour >= 6 && hour < 18 ? 'day' : 'night');
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setIsButtonPulsing(prev => !prev);
    }, 2000);
    return () => clearInterval(pulseInterval);
  }, []);

  const checkForCrisis = (message) => {
    const crisisKeywords = ['suicide', 'kill myself', 'want to die', 'end my life', 'self harm'];
    return crisisKeywords.some(keyword => message.toLowerCase().includes(keyword));
  };

  const getMoodIcon = () => {
    const icons = [<Coffee size={16} />, <Music size={16} />, <Smile size={16} />, <Sparkles size={16} />];
    return icons[Math.floor(Math.random() * icons.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    if (checkForCrisis(inputMessage)) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I notice you're having some difficult thoughts. Please know that you're not alone. The Indian government's mental health helpline is available 24/7 at 1800-599-0019. Would you like to talk more about what's troubling you?"
      }]);
      setIsTyping(false);
      return;
    }

    try {
      const response = await client.post('/chat/completions', {
        model: "Meta-Llama-3-1-8B-Instruct-FP8",
        messages: [
          {
            role: "system",
            content: `You are a compassionate mental health companion chatbot. Your primary focus is on mental health and emotional well-being.

Key guidelines:
1. Always maintain a warm, empathetic tone
2. If users ask about non-mental health topics, gently guide them back to discussing their feelings and well-being
3. Never provide medical advice or diagnoses
4. Encourage professional help when appropriate
5. Use supportive language and validation
6. Ask thoughtful follow-up questions to better understand their situation
7. Share general coping strategies and self-care tips when relevant
8. If users express crisis situations, provide helpline information
9. Keep responses focused on emotional support and understanding
10. Maintain appropriate boundaries while being helpful

Remember to:
- Always acknowledge their feelings
- Use a mix of active listening and gentle guidance
- Be patient and understanding
- Stay within the scope of emotional support`
          },
          ...messages,
          userMessage
        ],
        temperature: 0.7,
        max_tokens: 300
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.choices[0].message.content
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. If you're in immediate distress, please call 1800-599-0019 for support. Otherwise, please try again in a moment."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const getBackgroundStyle = () => {
    return timeOfDay === 'day' 
      ? 'bg-gradient-to-r from-blue-400 via-blue-300 to-teal-300'
      : 'bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className={`${getBackgroundStyle()} text-white rounded-full p-4 shadow-lg transition-all duration-300 flex items-center gap-2 hover:shadow-2xl ${
            isButtonPulsing ? 'animate-pulse' : ''
          }`}
        >
          {timeOfDay === 'day' ? <Sun size={24} className="animate-spin-slow" /> : <Moon size={24} className="animate-bounce" />}
          <span className="text-sm font-medium">Chat with Me</span>
          <Heart size={16} className="text-pink-200 animate-ping" />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-2xl w-96 max-w-full border border-gray-200 animate-slideUp">
          <div className={`${getBackgroundStyle()} p-4 rounded-t-lg flex justify-between items-center`}>
            <div className="flex items-center gap-2">
              <Brain size={24} className="text-white animate-pulse" />
              <h3 className="text-white font-semibold flex items-center gap-2">
                Mental Health Companion
                {timeOfDay === 'day' ? <CloudSun size={16} /> : <CloudRain size={16} />}
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-yellow-200 transition-colors transform hover:scale-110"
              >
                <MinusCircle size={20} />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setMessages([messages[0]]);
                }}
                className="text-white hover:text-yellow-200 transition-colors transform hover:scale-110"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="h-96 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
                } animate-fadeIn`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg shadow-md ${
                    message.role === 'user'
                      ? `${getBackgroundStyle()} text-white transform hover:scale-102 transition-transform`
                      : 'bg-white text-gray-800 border border-gray-200 hover:border-blue-200 transition-colors'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {message.role === 'user' ? getMoodIcon() : <Sparkles size={16} />}
                    <span>{message.content}</span>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-4 animate-fadeIn">
                <div className="bg-gray-200 text-gray-600 p-3 rounded-lg flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Share your thoughts..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 bg-white"
              />
              <button
                onClick={handleSendMessage}
                className={`${getBackgroundStyle()} text-white p-2 rounded-lg transition-all transform hover:scale-105 focus:ring-2 focus:ring-blue-200 active:scale-95 hover:shadow-lg`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;