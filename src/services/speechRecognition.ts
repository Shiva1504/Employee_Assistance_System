declare global {
  interface Window {
      webkitSpeechRecognition: typeof SpeechRecognition;
      SpeechRecognition: typeof SpeechRecognition;
  }

  class SpeechRecognition extends EventTarget {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      onresult: (event: SpeechRecognitionEvent) => void;
      start: () => void;
      stop: () => void;
  }

  interface SpeechRecognitionEvent extends Event {
      results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionResultList {
      readonly length: number; // Fixed modifier consistency
      [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
      readonly length: number; // Matches MDN's readonly spec
      readonly isFinal: boolean;
      [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
      readonly transcript: string;
      readonly confidence: number;
  }
}

export class SpeechRecognitionService {
    private recognition: SpeechRecognition | null = null;
    private isListening = false;
  
    constructor(language: string, onResult: (text: string) => void) {
      if ('webkitSpeechRecognition' in window) {
        this.recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = language;
  
        this.recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
  
          onResult(transcript);
        };
      }
    }
  
    start() {
      if (this.recognition && !this.isListening) {
        this.recognition.start();
        this.isListening = true;
      }
    }
  
    stop() {
      if (this.recognition && this.isListening) {
        this.recognition.stop();
        this.isListening = false;
      }
    }
  
    setLanguage(language: string) {
      if (this.recognition) {
        this.recognition.lang = language;
      }
    }
  }