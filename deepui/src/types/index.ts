// types.ts
export interface Message {
  text: string;
  think: string;
  sender: 'user' | 'ai';
  tokens?: {
    prompt: number;
    response: number;
    total: number;
  };
}