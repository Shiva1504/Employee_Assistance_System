import { GoogleGenerativeAI } from '@google/generative-ai';
import { CohereClient } from 'cohere-ai';
import { AIProvider, AIResponse } from '../types';

export class AIService {
  private apiKeys: Record<AIProvider, string> = {
    openai: '',
    claude: '',
    deepseek: '',
    cohere: '',
    gemini: ''
  };

  private lastWorkingProvider: AIProvider | null = null;
  private isInitialLoad = true;

  constructor() {
    // Initialize with environment variables if available
    this.apiKeys = {
      openai: import.meta.env.VITE_OPENAI_API_KEY || '',
      claude: import.meta.env.VITE_CLAUDE_API_KEY || '',
      deepseek: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
      cohere: import.meta.env.VITE_COHERE_API_KEY || '',
      gemini: import.meta.env.VITE_GEMINI_API_KEY || ''
    };
  }

  setApiKey(provider: AIProvider, key: string) {
    if (!key.trim()) {
      throw new Error(`Invalid API key for ${provider}`);
    }
    this.apiKeys[provider] = key;
    this.isInitialLoad = false;
  }

  private async handleResponse(response: Response, provider: string): Promise<any> {
    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      let errorMessage = `${provider} API error (${response.status})`;
      try {
        if (contentType?.includes('application/json')) {
          const error = await response.json();
          errorMessage += `: ${error?.error?.message || error?.message || 'Unknown error'}`;
        } else {
          const text = await response.text();
          errorMessage += `: ${text || 'Unknown error'}`;
        }
      } catch (e) {
        errorMessage += ': Failed to parse error response';
      }
      throw new Error(errorMessage);
    }

    if (!contentType?.includes('application/json')) {
      throw new Error(`${provider} API returned non-JSON response`);
    }

    return response.json();
  }

  private async openAIChat(message: string): Promise<string> {
    if (!this.apiKeys.openai) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKeys.openai}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: message }],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      const data = await this.handleResponse(response, 'OpenAI');
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from OpenAI');
      }
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI error:', error);
      throw error;
    }
  }

  private async claudeChat(message: string): Promise<string> {
    if (!this.apiKeys.claude) {
      throw new Error('Claude API key not configured');
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKeys.claude,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-opus-20240229',
          max_tokens: 1024,
          messages: [{ role: 'user', content: message }],
        }),
      });

      const data = await this.handleResponse(response, 'Claude');
      if (!data.content?.[0]?.text) {
        throw new Error('Invalid response format from Claude');
      }
      return data.content[0].text;
    } catch (error) {
      console.error('Claude error:', error);
      throw error;
    }
  }

  private async deepseekChat(message: string): Promise<string> {
    if (!this.apiKeys.deepseek) {
      throw new Error('DeepSeek API key not configured');
    }

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKeys.deepseek}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: message }],
          max_tokens: 1000,
        }),
      });

      const data = await this.handleResponse(response, 'DeepSeek');
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from DeepSeek');
      }
      return data.choices[0].message.content;
    } catch (error) {
      console.error('DeepSeek error:', error);
      throw error;
    }
  }

  private async cohereChat(message: string): Promise<string> {
    if (!this.apiKeys.cohere) {
      throw new Error('Cohere API key not configured');
    }

    try {
      const cohere = new CohereClient({ token: this.apiKeys.cohere });
      const response = await cohere.generate({
        prompt: message,
        model: 'command',
        maxTokens: 1000,
        temperature: 0.7,
        returnLikelihoods: 'NONE',
      });

      if (!response.generations?.[0]?.text) {
        throw new Error('Invalid response format from Cohere');
      }
      return response.generations[0].text.trim();
    } catch (error) {
      console.error('Cohere error:', error);
      throw error;
    }
  }

  private async geminiChat(message: string): Promise<string> {
    if (!this.apiKeys.gemini) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const genAI = new GoogleGenerativeAI(this.apiKeys.gemini);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      });

      const response = await result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('Invalid response format from Gemini');
      }
      return text.trim();
    } catch (error) {
      console.error('Gemini error:', error);
      throw error;
    }
  }

  private async tryProvider(message: string, provider: AIProvider): Promise<string> {
    if (!this.apiKeys[provider]) {
      throw new Error(`${provider} API key not configured`);
    }

    try {
      let text: string;
      switch (provider) {
        case 'openai':
          text = await this.openAIChat(message);
          break;
        case 'claude':
          text = await this.claudeChat(message);
          break;
        case 'deepseek':
          text = await this.deepseekChat(message);
          break;
        case 'cohere':
          text = await this.cohereChat(message);
          break;
        case 'gemini':
          text = await this.geminiChat(message);
          break;
        default:
          throw new Error('Invalid provider');
      }
      this.lastWorkingProvider = provider;
      return text;
    } catch (error) {
      if (error instanceof Error && error.message.includes('quota')) {
        throw new Error(`${provider} quota exceeded`);
      }
      throw error;
    }
  }

  async getResponse(message: string, preferredProvider: AIProvider): Promise<AIResponse> {
    if (!message.trim()) {
      throw new Error('Message cannot be empty');
    }

    // Check if any API keys are configured
    const configuredProviders = Object.entries(this.apiKeys)
      .filter(([_, key]) => key.trim() !== '')
      .map(([provider]) => provider) as AIProvider[];

    if (configuredProviders.length === 0) {
      throw new Error('Please configure at least one AI provider in the settings to start chatting.');
    }

    // Try preferred provider first if it's configured
    if (this.apiKeys[preferredProvider]) {
      try {
        const text = await this.tryProvider(message, preferredProvider);
        return {
          text,
          provider: preferredProvider,
          timestamp: new Date(),
        };
      } catch (error) {
        console.warn(`${preferredProvider} failed:`, error);
        
        // If quota exceeded, try other providers
        if (error instanceof Error && error.message.includes('quota')) {
          const otherProviders = configuredProviders.filter(p => p !== preferredProvider);

          for (const provider of otherProviders) {
            try {
              const text = await this.tryProvider(message, provider);
              return {
                text,
                provider,
                timestamp: new Date(),
              };
            } catch (fallbackError) {
              console.warn(`Fallback to ${provider} failed:`, fallbackError);
            }
          }
        }
        throw error;
      }
    }

    // If preferred provider is not configured or failed, try any configured provider
    for (const provider of configuredProviders) {
      try {
        const text = await this.tryProvider(message, provider);
        return {
          text,
          provider,
          timestamp: new Date(),
        };
      } catch (error) {
        console.warn(`${provider} failed:`, error);
        continue;
      }
    }
    
    throw new Error('All configured AI providers failed. Please check your API keys and try again.');
  }
}