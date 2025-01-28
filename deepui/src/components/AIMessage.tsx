// AIMessage.tsx
import { Message } from '../types';
import { TypewriterText } from './TypewriterText';

interface AIMessageProps {
  message: Message;
  isDarkMode: boolean;
}

export const AIMessage: React.FC<AIMessageProps> = ({ message, isDarkMode }) => {
  return (
    <div className={`max-w-[70%] p-4 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
      <TypewriterText text={message.text} speed={30} />
      
      {message.tokens && (
        <div className="flex justify-end mt-2 space-x-2">
          <div className="group relative">
            <div className={`hidden group-hover:block absolute right-0 bottom-6 p-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} text-sm rounded-lg shadow-lg`}>
              <p>Prompt Tokens: {message.tokens.prompt}</p>
              <p>Response Tokens: {message.tokens.response}</p>
              <p>Total Duration: {message.tokens.total} ns</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};