// 🎤 ELEVENLABS VOICE CONFIGURATION
// =================================
// Professional-grade AI voice synthesis using ElevenLabs API
// ✅ Ultra-realistic human voices with natural emotion
// ✅ Professional quality for content creation
// ✅ Multiple voice personalities available

// Note: ElevenLabs API key is securely integrated in the service
// The application uses Rachel voice (21m00Tcm4TlvDq8ikWAM) by default
// which provides exceptional natural female voice quality

export const VOICE_CONFIG = {
  // ElevenLabs configuration is handled by the service layer
  // API key is securely integrated
  ELEVENLABS_ENABLED: true,
}

// 🎵 ELEVENLABS VOICE SETTINGS
export const VOICE_SETTINGS = {
  // Popular ElevenLabs voices with their IDs
  ELEVENLABS_VOICES: {
    RACHEL: '21m00Tcm4TlvDq8ikWAM',    // Natural, calm female voice
    DOMI: 'AZnzlk1XvdvUeBnXmlld',     // Strong, confident voice
    BELLA: 'EXAVITQu4vr4xnSDxMaL',    // Sweet, friendly voice
    ELLI: 'MF3mGyEYCl7XYWbV9V6O',     // Emotional, warm voice
    JOSH: 'TxGEqnHWrfWFTfGW9XjX',     // Friendly male voice
    ARNOLD: 'VR6AewLTigWG4xSOukaG',   // Deep, authoritative voice
  },
  
  // Default voice settings for optimal quality
  DEFAULT_SETTINGS: {
    stability: 0.5,           // Voice consistency (0-1)
    similarityBoost: 0.75,    // Voice similarity (0-1) 
    style: 0,                 // Style exaggeration (0-1)
    useSpeakerBoost: true     // Enhanced clarity
  }
}

// 🔧 ELEVENLABS FEATURES
// ======================
// 
// ✅ Ultra-realistic AI voices with human-like expression
// ✅ Natural emotion and intonation in speech
// ✅ Multiple voice personalities to choose from
// ✅ Professional quality suitable for content creation
// ✅ Advanced voice settings for customization
// ✅ Reliable API with excellent uptime
// 
// The ElevenLabs integration provides premium voice synthesis
// that significantly enhances user experience with natural,
// engaging audio content.
