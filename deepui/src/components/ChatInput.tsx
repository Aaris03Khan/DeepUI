import { PauseCircle, Send } from 'lucide-react';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  isLoading,
  onInputChange,
  onSubmit,
  onCancel,
  isDarkMode,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <textarea
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here..."
        className={`flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
          isDarkMode
            ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
            : 'border-gray-300 text-gray-800 focus:ring-blue-500'
        }`}
        rows={1}
        disabled={isLoading}
      />
      <button
        type="button"
        onClick={isLoading ? onCancel : onSubmit}
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-blue-300 flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <PauseCircle size={20} /> Stop
          </>
        ) : (
          <>
            <Send size={20} /> Send
          </>
        )}
      </button>
    </form>
  );
};