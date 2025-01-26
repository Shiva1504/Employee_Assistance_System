import { useEffect, useState } from 'react';
import { Message } from '../types';
import { User, Bot, Volume2, AlertCircle } from 'lucide-react';
import { translateText } from '../services/translation';

interface ChatMessageProps {
  message: Message;
  currentLanguage: string;
}

export function ChatMessage({ message, currentLanguage }: ChatMessageProps) {
  const [translatedText, setTranslatedText] = useState(message.text);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (message.language !== currentLanguage) {
      translateText(message.text, message.language, currentLanguage)
        .then(setTranslatedText)
        .catch(console.error);
    } else {
      setTranslatedText(message.text);
    }
  }, [message, currentLanguage]);

  const speak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = currentLanguage;
      utterance.onend = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const getMessageStyle = () => {
    if (message.isWelcome) {
      return 'bg-blue-50 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200';
    }
    if (message.error) {
      return 'bg-red-50 dark:bg-red-900/50 text-red-800 dark:text-red-200';
    }
    return message.isUser
      ? 'bg-blue-500 text-white'
      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
  };

  const sanitizeText = (text: string) => {
    // Trim spaces and remove excessive asterisks or colons
    return text.replace(/\*\*/g, '').replace(/: +/g, ': ').trim();
  };

  const renderContent = () => {
    const lines = translatedText.split(/\n|;|,/).map((line) => line.trim()).filter(Boolean);

    return (
      <div className="space-y-2">
        {lines.map((line, index) => {
          const [heading, ...rest] = line.split(':').map((part) => sanitizeText(part.trim()));
          const description = rest.join(':'); // Rejoin the remaining parts

          return (
            <div key={index} className="text-sm">
              {heading && <span className="font-bold">{heading}</span>}{' '}
              {description && <span>{description}</span>}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`flex gap-3 ${
        message.isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          message.isUser
            ? 'bg-blue-100 dark:bg-blue-900/50'
            : message.error
            ? 'bg-red-100 dark:bg-red-900/50'
            : 'bg-gray-100 dark:bg-gray-800'
        }`}
      >
        {message.error ? (
          <AlertCircle className="w-5 h-5 text-red-500" />
        ) : message.isUser ? (
          <User className="w-5 h-5 text-blue-600" />
        ) : (
          <Bot className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
      </div>
      <div className="flex flex-col gap-2 max-w-[80%]">
        <div className={`px-4 py-2 rounded-lg ${getMessageStyle()}`}>
          {renderContent()}
        </div>
        {!message.error && !message.isWelcome && (
          <button
            onClick={speak}
            disabled={isPlaying}
            className={`self-start p-1 rounded-full ${
              message.isUser
                ? 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/50'
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            title="Listen to message"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
