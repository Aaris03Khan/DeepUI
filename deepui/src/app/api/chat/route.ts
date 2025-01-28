import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  try {
    // Send the prompt to the Ollama API
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'deepseek-r1', // Specify the DeepSeek model
      prompt: prompt,
      stream: false, // Set to true for streaming responses
    });

    // Extract the actual message and token details from the response
    const message = response.data.response;
    const thinkContent = (message.match(/<think>([\s\S]*?)<\/think>/)?.[1] || '').trim();
    const cleanedResponse = message.replace(/<think>[\s\S]*?<\/think>/g, '');

    return NextResponse.json({
      message: cleanedResponse, // The cleaned response without <think> tags
      think: thinkContent,      // The extracted <think> content
      prompt_eval_count: response.data.prompt_eval_count,
      eval_count: response.data.eval_count,
      total_duration: response.data.total_duration,
    });
  } catch (error) {
    console.error('Error communicating with the Ollama API:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}