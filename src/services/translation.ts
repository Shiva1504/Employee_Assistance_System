type LangCode  = 'hi' | 'mr' | 'te';

type TranslationKey = 
  | 'Hello'
  | 'How can I help you?'
  | "I'm here to help! However, I'm currently in development mode.";

// Simulated translations for development
const TRANSLATIONS: Record<LangCode , Record<TranslationKey, string>> = {
  'hi': {
    'Hello': 'नमस्ते',
    'How can I help you?': 'मैं आपकी कैसे मदद कर सकता हूं?',
    "I'm here to help! However, I'm currently in development mode.": 'मैं मदद के लिए यहां हूं! हालांकि, मैं अभी विकास मोड में हूं।'
  },
  'mr': {
    'Hello': 'नमस्कार',
    'How can I help you?': 'मी तुमची कशी मदत करू शकतो?',
    "I'm here to help! However, I'm currently in development mode.": 'मी मदत करण्यासाठी येथे आहे! तथापि, मी सध्या विकास मोडमध्ये आहे.'
  },
  'te': {
    'Hello': 'హలో',
    'How can I help you?': 'నేను మీకు ఎలా సహాయం చేయగలను?',
    "I'm here to help! However, I'm currently in development mode.": 'నేను సహాయం చేయడానికి ఇక్కడ ఉన్నాను! అయితే, నేను ప్రస్తుతం డెవలప్‌మెంట్ మోడ్‌లో ఉన్నాను.'
  }
};

export async function translateText(
  text: string,
  fromLang: string,
  toLang: string
): Promise<string> {
  try {
    if (fromLang === toLang) return text;

    // Type-safe access with assertions
    const targetLang = toLang as LangCode;
    const translationKey = text as TranslationKey;
    
    if (TRANSLATIONS[targetLang]?.[translationKey]) {
      return TRANSLATIONS[targetLang][translationKey];
    }

    // Fallback remains the same
    const langName = new Intl.DisplayNames([toLang], { type: 'language' }).of(toLang);
    return `[${langName}] ${text}`;
  } catch (error) {
    console.warn('Translation not available:', error);
    return text;
  }
}