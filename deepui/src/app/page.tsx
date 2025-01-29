// page.tsx
"use client";
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Message } from '../types';
import { MessageBubble } from '../components/MessageBubble';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ChatInput } from '../components/ChatInput';
import { TypewriterText } from '../components/TypewriterText';
import { Navbar } from '../components/Navbar';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await axios.get('/api/ip');
        setIpAddress(response.data.ip);
      } catch (error) {
        console.error('Error fetching IP address:', error);
      }
    };
    fetchIpAddress();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { text: input, sender: 'user', think: '' }]);
    setInput('');

    abortControllerRef.current = new AbortController();

    try {
      const response = await axios.post('/api/chat', 
        { prompt: input },
        { signal: abortControllerRef.current.signal }
      );

      const cleanedResponse = response.data.message;
      const thinkContent = (response.data.think || '').trim();

      setMessages(prev => [...prev, {
        think: thinkContent,
        text: cleanedResponse,
        sender: 'ai',
        tokens: {
          prompt: response.data.prompt_eval_count,
          response: response.data.eval_count,
          total: response.data.total_duration,
        }
      }]);

    } catch (error) {
      if (axios.isCancel(error)) {
        setMessages(prev => [...prev, { text: 'Request cancelled.', sender: 'ai', think: '' }]);
      } else {
        console.error('Error:', error);
        setMessages(prev => [...prev, { text: 'Failed to generate response.', sender: 'ai', think: '' }]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <Navbar 
        isDarkMode={isDarkMode} 
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
        ipAddress={ipAddress}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => {
          if (message.sender === 'user') {
            return (
              <div key={index} className="flex justify-end">
                <MessageBubble message={message} isDarkMode={isDarkMode} />
              </div>
            );
          }

          return (
            <div key={index} className="flex justify-start">
                <div className="`max-w-[70%] p-4 prose ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`">
                <TypewriterText text={message.text} think={message.think} isDarkMode={isDarkMode}/>
                {message.tokens && (
                  <div className="mt-2 text-xs text-gray-500">
                    <span className="mr-3">Prompt tokens: {message.tokens.prompt}</span>
                    <span className="mr-3">Response tokens: {message.tokens.response}</span>
                    <span>Duration: {(message.tokens.total / 1e9).toFixed(2)}s</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {isLoading && (
          <div className="flex justify-start">
            <LoadingSpinner />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <footer className={`p-4 border-t ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <ChatInput
          input={input}
          isLoading={isLoading}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          onCancel={() => abortControllerRef.current?.abort()}
          isDarkMode={isDarkMode}
        />
      </footer>
    </div>
  );
}