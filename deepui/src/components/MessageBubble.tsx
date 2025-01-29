import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isDarkMode: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isDarkMode }) => {
  return (
    <div
      className={`max-w-[70%] p-4 rounded-lg relative ${
        message.sender === 'user'
          ? 'bg-blue-500 text-white'
          : `${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800 shadow-sm'}`
      }`}
    > 
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code: function Code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus as any}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {message.text}
      </ReactMarkdown>

      <div className="flex justify-end mt-2 space-x-2">
        {message.sender === 'ai' && message.tokens && (
          <div className="group relative">
            <span className="text-gray-400 cursor-pointer">ℹ️</span>
            <div className="hidden group-hover:block absolute right-0 bottom-6 p-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg">
              <p>Prompt Tokens: {message.tokens.prompt}</p>
              <p>Response Tokens: {message.tokens.response}</p>
              <p>Total Duration: {message.tokens.total} ns</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};