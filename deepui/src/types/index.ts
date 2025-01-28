// types.ts
export interface Message {
  text: string;
  sender: 'user' | 'ai' | 'think';
  tokens?: {
    prompt: number;
    response: number;
    total: number;
  };
}