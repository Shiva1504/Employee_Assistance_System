import React, { useState } from 'react';
import { X } from 'lucide-react';
import { AIProvider } from '../types';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveKeys: (provider: AIProvider, key: string) => void;
}

export function AISettingsModal({ isOpen, onClose, onSaveKeys }: AISettingsModalProps) {
  const [keys, setKeys] = useState<Record<AIProvider, string>>({
    gemini: '',    
    openai: '',
    claude: '',
    deepseek: '',
    cohere: '' 
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Object.entries(keys).forEach(([provider, key]) => {
      if (key) {
        onSaveKeys(provider as AIProvider, key);
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            AI Provider Settings
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries(keys).map(([provider, key]) => (
            <div key={provider}>
              <label
                htmlFor={provider}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {provider.charAt(0).toUpperCase() + provider.slice(1)} API Key
              </label>
              <input
                type="password"
                id={provider}
                value={key}
                onChange={(e) =>
                  setKeys((prev) => ({ ...prev, [provider]: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder={`Enter ${provider} API key`}
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}