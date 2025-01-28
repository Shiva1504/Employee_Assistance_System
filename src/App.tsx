import { useState, useCallback, useRef, useEffect } from 'react';
import { Send, FileText, AlertCircle, Search, Sun, Moon } from 'lucide-react';
import { LanguageSelector } from './components/LanguageSelector';
import { VoiceInput } from './components/VoiceInput';
import { ChatMessage } from './components/ChatMessage';
import QuickActions from '././components/QuickActions'; 
import { Announcements } from './components/Announcements';
import { AIProviderSelector } from './components/AIProviderSelector';
import { AISettingsModal } from './components/AISettingsModal';
import { AIService } from './services/aiProviders';
import { useTheme } from './context/ThemeContext';
import { Language, Message, AIProvider } from './types';
import { Task } from './types/task';
// import TasksModal from './components/TasksModal';  
import { TASKS_STORAGE_KEY } from './components/TasksModal';

function App() {
  const { isDark, toggleTheme } = useTheme();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('chatMessages');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  });
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'Announcement' | 'documents' | 'complaints'>('chat');
  const [currentContext, setCurrentContext] = useState<string>('');
  const [currentProvider, setCurrentProvider] = useState<AIProvider>('gemini');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const aiService = useRef(new AIService());
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(TASKS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  });


  useEffect(() => {
    try {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        text: "👋 Welcome to the Employee Assistance System! \n You can start chatting!",
        language: 'en',
        isUser: false,
        timestamp: new Date(),
        isWelcome: true
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim() || isSending) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      language: currentLanguage,
      isUser: true,
      timestamp: new Date(),
      context: currentContext,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setIsSending(true);

    try {
      const aiResponse = await aiService.current.getResponse(inputText, currentProvider);
      
      // Skip adding error message during initial load
      if (aiResponse.skipError) {
        setIsSending(false);
        return;
      }

      // If the response came from a different provider than selected, update the UI
      if (aiResponse.provider !== currentProvider) {
        setCurrentProvider(aiResponse.provider);
      }

      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        language: currentLanguage,
        isUser: false,
        timestamp: aiResponse.timestamp,
        context: currentContext,
        provider: aiResponse.provider,
      };

      setMessages((prev) => [...prev, responseMessage]);
      setCurrentContext(inputText);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('AI Provider Error:', errorMessage);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        language: currentLanguage,
        isUser: false,
        timestamp: new Date(),
        context: currentContext,
        error: true,
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsSending(false);
    }
  }, [inputText, currentLanguage, currentContext, currentProvider, isSending]);

  
  const clearChatHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  }, []);

  const toggleListening = useCallback(() => {
    setIsListening((prev) => !prev);
  }, []);

  const handleVoiceInput = useCallback((text: string) => {
    setInputText(text);
  }, []);


  const handleSaveKeys = useCallback((provider: AIProvider, key: string) => {
    aiService.current.setApiKey(provider, key);
    setIsSettingsOpen(false);
  }, []);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white text-center sm:text-left">
            Employee Assistance System
          </h1>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
            <AIProviderSelector
              currentProvider={currentProvider}
              onProviderChange={setCurrentProvider}
              onSettingsClick={() => setIsSettingsOpen(true)}
            />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
            />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex overflow-x-auto pb-2 sm:pb-0 space-x-2 sm:space-x-4">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-2 text-xs sm:text-sm font-medium border-b-2 ${
                activeTab === 'chat'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Chat Assistant
            </button>

            <button
              onClick={() => setActiveTab('Announcement')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'Announcement'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Announcements
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 inline-block mr-2" />
              Documents
            </button>
            <button
              onClick={() => setActiveTab('complaints')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'complaints'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <AlertCircle className="w-4 h-4 inline-block mr-2" />
              Complaints
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4">
        {activeTab === 'chat' && (
          <>
             <div className="mb-6">
                  <QuickActions 
                  setActiveTab={setActiveTab}
                  tasks={tasks}
                  setTasks={setTasks}
                />

            </div>
            <div className="flex justify-end">
                <button 
                  onClick={clearChatHistory}
                  className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  Clear History
                </button>
            </div>

            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  currentLanguage={currentLanguage}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === 'Announcement' && (
                                  <div className="mb-6">
                                  <Announcements />
                                </div>
                  )}

        {activeTab === 'documents' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Document search functionality will be implemented here
            </p>
          </div>
        )}

{activeTab === 'complaints' && (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
      Submit a Complaint
    </h2>
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();

        // Typecast e.target to HTMLFormElement
        const form = e.target as HTMLFormElement;

        const name = (form.elements.namedItem('name') as HTMLInputElement)?.value;
        const subject = (form.elements.namedItem('subject') as HTMLInputElement)?.value;
        const description = (form.elements.namedItem('description') as HTMLTextAreaElement)?.value;
        const file = (form.elements.namedItem('file') as HTMLInputElement)?.files?.[0];
        const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

        if (!accessKey || !name || !subject || !description) {
          alert("Please fill out all required fields.");
          return;
        }

        const formData = new FormData();
        formData.append("access_key", accessKey);
        formData.append("name", name);
        formData.append("subject", subject);
        formData.append("description", description);

        if (file) {
          formData.append("file", file, file.name);
        }

        try {
          const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData,
          });

          const result = await response.json();
          if (result.success) {
            alert("Complaint submitted successfully!");
            form.reset(); // Reset the form after successful submission
          } else {
            alert("Failed to submit complaint. Please try again.");
          }
        } catch (error) {
          console.error("Error submitting complaint:", error);
          alert("An error occurred while submitting your complaint.");
        }
      }}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Name
        </label>
        <input
          type="text"
          name="name"
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Subject
        </label>
        <input
          type="text"
          name="subject"
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          rows={4}
          name="description"
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Upload Image
        </label>
        <input
          type="file"
          name="file"
          className="w-full max-w-xs px-4 py-2 rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Submit Complaint
      </button>
    </form>
  </div>
)}

      </main>

      {/* Input Area */}
      {activeTab === 'chat' && (
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 flex-wrap">
              <VoiceInput
                onVoiceInput={handleVoiceInput}
                isListening={isListening}
                toggleListening={toggleListening}
                currentLanguage={currentLanguage}
              />
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 min-w-[50%] text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={handleSendMessage}
                disabled={isSending}
                className={`${
                  isSending ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
                } text-white p-2 rounded-lg transition-colors`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <AISettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaveKeys={handleSaveKeys}
      />
    </div>
  );
}

export default App;