import { Settings } from 'lucide-react';
import { AIProvider } from '../types';

interface AIProviderSelectorProps {
  currentProvider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
  onSettingsClick: () => void;
}

export function AIProviderSelector({
  currentProvider,
  onProviderChange,
  onSettingsClick,
}: AIProviderSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={currentProvider}
        onChange={(e) => onProviderChange(e.target.value as AIProvider)}
        className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="gemini">Gemini</option>
        <option value="openai">OpenAI</option>
        <option value="claude">Claude</option>
        <option value="deepseek">DeepSeek</option>
        <option value="cohere">Cohere</option>
      </select>
      <button
        onClick={onSettingsClick}
        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        title="AI Provider Settings"
      >
        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>
    </div>
  );
}