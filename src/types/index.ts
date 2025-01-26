export * from './task';

export type Language = 'en' | 'hi' | 'mr' | 'te';

export type AIProvider = 'openai' | 'claude' | 'deepseek' | 'cohere' | 'gemini';

export interface AIResponse {
  text: string;
  provider: AIProvider;
  timestamp: Date;
  skipError?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  proof: Array<{
    name: string;
    size: number;
    type: string;
  }>;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface Message {
  id: string;
  text: string;
  language: Language;
  isUser: boolean;
  timestamp: Date;
  context?: string;
  provider?: AIProvider;
  error?: boolean;
  isWelcome?: boolean;
}

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: Date;
  priority: 'low' | 'medium' | 'high';
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  action: () => void;
}

export interface ThemeContext {
  isDark: boolean;
  toggleTheme: () => void;
}