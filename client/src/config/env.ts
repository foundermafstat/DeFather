// Переменные окружения для приложения
interface EnvConfig {
  OPENAI_API_KEY: string | undefined;
  DEFAULT_MODEL: string;
  SYSTEM_PROMPT: string;
}

export const env: EnvConfig = {
  // Поддерживаем оба варианта имени переменной для совместимости
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY,
  DEFAULT_MODEL: 'gpt-3.5-turbo',
  SYSTEM_PROMPT: 'You are a helpful assistant that specializes in blockchain, cryptocurrency, and Rootstock (RSK) topics. Provide concise, accurate information about Rootstock, smart contracts, account abstraction, and related technologies.'
};
