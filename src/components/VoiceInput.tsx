import { useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { SpeechRecognitionService } from '../services/speechRecognition';
import { Language } from '../types';

interface VoiceInputProps {
  onVoiceInput: (text: string) => void;
  isListening: boolean;
  toggleListening: () => void;
  currentLanguage: Language;
}

export function VoiceInput({ 
  onVoiceInput, 
  isListening, 
  toggleListening,
  currentLanguage 
}: VoiceInputProps) {
  const speechRecognitionRef = useRef<SpeechRecognitionService | null>(null);

  useEffect(() => {
    speechRecognitionRef.current = new SpeechRecognitionService(
      currentLanguage,
      (text) => onVoiceInput(text)
    );

    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    };
  }, [currentLanguage, onVoiceInput]);

  useEffect(() => {
    if (isListening) {
      speechRecognitionRef.current?.start();
    } else {
      speechRecognitionRef.current?.stop();
    }
  }, [isListening]);

  return (
    <button
      onClick={toggleListening}
      className={`p-2 rounded-full transition-colors ${
        isListening 
          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      title={isListening ? 'Stop recording' : 'Start recording'}
    >
      {isListening ? (
        <MicOff className="w-5 h-5" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  );
}