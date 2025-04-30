import OpenAI from 'openai';

// Обертка для работы с OpenAI API
class OpenAIService {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Необходимо для работы в браузере
    });
  }

  // Метод для отправки запроса на чат-комплишн
  async chatCompletion(messages: { role: 'user' | 'assistant' | 'system'; content: string }[]) {
    try {
      const completion = await this.client.chat.completions.create({
        messages,
        model: 'gpt-3.5-turbo',
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error during OpenAI chat completion:', error);
      throw new Error('Failed to get response from AI assistant');
    }
  }
}

// Обертка с функцией инициализации для работы без ключа при запуске
let openAIServiceInstance: OpenAIService | null = null;

export const initOpenAIService = (apiKey: string): void => {
  openAIServiceInstance = new OpenAIService(apiKey);
};

export const getOpenAIService = (): OpenAIService => {
  if (!openAIServiceInstance) {
    throw new Error('OpenAI service not initialized. Call initOpenAIService first');
  }
  return openAIServiceInstance;
};
