/**
 * ElevenLabs Text-to-Speech Integration with Smart Caching
 * Professional-grade voice synthesis using ElevenLabs API
 * Features: Audio caching, custom uploads, and optimized API usage
 */

import audioApi from '@/services/audio-api'

// Local interface to avoid import issues
interface AudioPlaybackInfo {
  id: string
  audioUrl: string
  source: 'cache' | 'custom' | 'generated'
  title?: string
  duration?: number
}

export interface ElevenLabsVoice {
  voice_id: string
  name: string
  category: string
  fine_tuning?: {
    language?: string
    gender?: string
  }
}

export interface ElevenLabsTTSOptions {
  voiceId?: string
  stability?: number
  similarityBoost?: number
  style?: number
  useSpeakerBoost?: boolean
}

class ElevenLabsTTSService {
  private readonly apiKey: string = 'sk_ee4a88f7169325a3f5f8e19e643eaa0f0fd70535a74671f6'
  private readonly baseUrl: string = 'https://api.elevenlabs.io/v1'
  private currentAudio: HTMLAudioElement | null = null
  private progressCallback: ((progress: number, currentTime: number, duration: number) => void) | null = null
  private onEndCallback: (() => void) | null = null
  
  // Default high-quality female voice (Rachel)
  private readonly defaultVoiceId: string = '21m00Tcm4TlvDq8ikWAM'
  
  /**
   * Get available voices from ElevenLabs
   */
  async getVoices(): Promise<ElevenLabsVoice[]> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.status}`)
      }
      
      const data = await response.json()
      return data.voices || []
    } catch (error) {
      console.error('Error fetching ElevenLabs voices:', error)
      return []
    }
  }
  
  /**
   * Generate speech from text using ElevenLabs (without caching)
   */
  async generateSpeech(
    text: string, 
    options: ElevenLabsTTSOptions = {}
  ): Promise<string | null> {
    if (!text.trim()) {
      throw new Error('Text cannot be empty')
    }
    
    const {
      voiceId = this.defaultVoiceId,
      stability = 0.5,
      similarityBoost = 0.75,
      style = 0,
      useSpeakerBoost = true
    } = options
    
    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability,
            similarity_boost: similarityBoost,
            style,
            use_speaker_boost: useSpeakerBoost
          }
        }),
      })
      
      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`)
      }
      
      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      
      // Store in cache for future use
      try {
        await audioApi.storeCache(
          {
            text,
            voiceId,
            voiceSettings: { stability, similarityBoost, style, useSpeakerBoost }
          },
          audioBlob,
          `tts_${Date.now()}.mp3`
        )
        console.log('✅ Audio stored in cache for future use')
      } catch (cacheError) {
        console.warn('⚠️ Failed to cache audio:', cacheError)
      }
      
      return audioUrl
    } catch (error) {
      console.error('Error generating speech with ElevenLabs:', error)
      return null
    }
  }

  /**
   * Smart speech generation with caching (recommended method)
   * Checks custom audio first, then cache, then generates new
   */
  async generateSpeechSmart(
    text: string, 
    noteId?: string,
    options: ElevenLabsTTSOptions = {}
  ): Promise<AudioPlaybackInfo | null> {
    if (!text.trim()) {
      throw new Error('Text cannot be empty')
    }

    const voiceSettings = {
      stability: options.stability || 0.5,
      similarityBoost: options.similarityBoost || 0.75,
      style: options.style || 0,
      useSpeakerBoost: options.useSpeakerBoost !== false
    }

    try {
      // Normalize text for better cache matching
      const normalizedText = text.trim().toLowerCase()
      
      // 1. Check for best available audio (custom or cached)
      let audioInfo: AudioPlaybackInfo | null = null
      
      if (noteId) {
        audioInfo = await audioApi.getBestAudio(noteId, normalizedText, voiceSettings)
      } 
      
      if (!audioInfo) {
        // Check cache for exact text match
        const cached = await audioApi.checkCache({
          text: normalizedText,
          voiceId: options.voiceId || this.defaultVoiceId,
          voiceSettings
        })
        
        if (cached) {
          audioInfo = {
            id: cached.id,
            audioUrl: cached.audioUrl,
            source: 'cache',
            duration: cached.duration
          }
        }
      }

      // 2. Try fuzzy matching for common phrases to maximize cache hits
      if (!audioInfo) {
        const commonPhrases = [
          "welcome to robinson's portfolio",
          "hi there",
          "getting bored",
          "check out the",
          "scroll down to see",
          "this section shows",
          "feel free to contact"
        ]
        
        for (const phrase of commonPhrases) {
          if (normalizedText.includes(phrase) || phrase.includes(normalizedText.slice(0, 15))) {
            const similarCached = await audioApi.checkCache({
              text: phrase,
              voiceId: options.voiceId || this.defaultVoiceId,
              voiceSettings
            })
            
            if (similarCached) {
              console.log(`🎵 Similar phrase cache HIT! Using "${phrase}" audio`)
              audioInfo = {
                id: similarCached.id,
                audioUrl: similarCached.audioUrl,
                source: 'cache',
                duration: similarCached.duration
              }
              break
            }
          }
        }
      }

      // 3. Return cached/custom audio if found
      if (audioInfo) {
        console.log(`🎵 Cache HIT! Using ${audioInfo.source} audio (saved API call!)`)
        return audioInfo
      }

      // 3. Generate new audio using ElevenLabs
      console.log('🎤 Generating new audio with ElevenLabs...')
      const audioUrl = await this.generateSpeech(text, options)
      
      if (audioUrl) {
        return {
          id: `generated_${Date.now()}`,
          audioUrl,
          source: 'generated'
        }
      }

      return null
    } catch (error) {
      console.error('Error in smart speech generation:', error)
      return null
    }
  }
  
  /**
   * Play text using ElevenLabs TTS (legacy method)
   */
  async speak(text: string, options: ElevenLabsTTSOptions = {}): Promise<void> {
    return this.speakSmart(text, undefined, options)
  }

  /**
   * Smart play with aggressive caching (recommended method)
   * Checks custom audio first, then cache, then generates new
   * Stores ALL generated audio for future use
   */
  async speakSmart(
    text: string, 
    noteId?: string, 
    options: ElevenLabsTTSOptions = {}
  ): Promise<void> {
    try {
      // Stop any current playback
      this.stop()
      
      // Try to get cached or custom audio first
      const audioInfo = await this.generateSpeechSmart(text, noteId, options)
      if (!audioInfo) {
        throw new Error('Failed to generate audio')
      }
      
      console.log(`🎵 Using ${audioInfo.source} audio (cache-optimized)`);
      
      return new Promise((resolve, reject) => {
        this.currentAudio = new Audio(audioInfo.audioUrl)
        
        this.currentAudio.onloadstart = () => {
          console.log(`🎵 Loading ${audioInfo.source} audio...`)
        }
        
        this.currentAudio.oncanplay = () => {
          console.log(`🎵 ${audioInfo.source} audio ready to play`)
        }
        
        this.currentAudio.onended = () => {
          console.log(`🎵 ${audioInfo.source} audio finished`)
          // Only revoke URL if it's a generated blob URL
          if (audioInfo.source === 'generated' && audioInfo.audioUrl.startsWith('blob:')) {
            URL.revokeObjectURL(audioInfo.audioUrl)
          }
          // Call end callback if set
          if (this.onEndCallback) {
            this.onEndCallback()
            this.onEndCallback = null
          }
          this.currentAudio = null
          resolve()
        }
        
        this.currentAudio.onerror = (error) => {
          console.error(`🎵 ${audioInfo.source} audio playback error:`, error)
          // Only revoke URL if it's a generated blob URL
          if (audioInfo.source === 'generated' && audioInfo.audioUrl.startsWith('blob:')) {
            URL.revokeObjectURL(audioInfo.audioUrl)
          }
          this.currentAudio = null
          reject(error)
        }
        
        // Add progress tracking if callback is set
        if (this.progressCallback && this.currentAudio) {
          const updateProgress = () => {
            if (this.currentAudio && this.progressCallback) {
              const currentTime = this.currentAudio.currentTime
              const duration = this.currentAudio.duration || 0
              const progress = duration > 0 ? currentTime / duration : 0
              this.progressCallback(progress, currentTime, duration)
            }
          }
          
          this.currentAudio.ontimeupdate = updateProgress
        }
        
        this.currentAudio.play().catch(reject)
      })
      
    } catch (error) {
      console.error('Error in ElevenLabs smart speak:', error)
      throw error
    }
  }
  
  /**
   * Pause current playback
   */
  pause(): void {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause()
    }
  }
  
  /**
   * Resume paused playback
   */
  resume(): void {
    if (this.currentAudio && this.currentAudio.paused) {
      this.currentAudio.play()
    }
  }
  
  /**
   * Stop current playback
   */
  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio.currentTime = 0
      this.currentAudio = null
    }
  }
  
  /**
   * Check if audio is currently playing
   */
  isPlaying(): boolean {
    return this.currentAudio !== null && !this.currentAudio.paused
  }
  
  /**
   * Check if audio is paused
   */
  isPaused(): boolean {
    return this.currentAudio !== null && this.currentAudio.paused
  }
  
  /**
   * Set volume (0.0 to 1.0)
   */
  setVolume(volume: number): void {
    if (this.currentAudio) {
      this.currentAudio.volume = Math.max(0, Math.min(1, volume))
    }
  }
  
  /**
   * Set playback rate (0.5 to 2.0)
   */
  setPlaybackRate(rate: number): void {
    if (this.currentAudio) {
      this.currentAudio.playbackRate = Math.max(0.5, Math.min(2, rate))
    }
  }
  
  /**
   * Get popular female voices for natural speech
   */
  async getRecommendedVoices(): Promise<ElevenLabsVoice[]> {
    const voices = await this.getVoices()
    
    // Popular natural-sounding voices
    const recommendedVoiceIds = [
      '21m00Tcm4TlvDq8ikWAM', // Rachel - Natural, calm
      'AZnzlk1XvdvUeBnXmlld', // Domi - Strong, confident  
      'EXAVITQu4vr4xnSDxMaL', // Bella - Sweet, friendly
      'MF3mGyEYCl7XYWbV9V6O', // Elli - Emotional, warm
      'TxGEqnHWrfWFTfGW9XjX', // Josh - Friendly male
      'VR6AewLTigWG4xSOukaG', // Arnold - Deep, authoritative
    ]
    
    return voices.filter(voice => 
      recommendedVoiceIds.includes(voice.voice_id)
    )
  }

  /**
   * Estimate text timing based on character count and speaking rate
   * Text appears slightly ahead of voice for better synchronization
   */
  private estimateTextTiming(text: string, durationMs: number): number[] {
    const words = text.split(/\s+/)
    const chars = text.length
    const avgCharsPerMs = chars / durationMs
    
    let currentTime = 0
    const wordTimings: number[] = []
    
    // Text lead time - text appears 200ms ahead of audio for better sync
    const textLeadTimeMs = 200
    
    for (const word of words) {
      const wordDuration = (word.length + 1) / avgCharsPerMs // +1 for space
      // Make text appear earlier than voice for natural feel
      wordTimings.push(Math.max(0, currentTime - textLeadTimeMs))
      currentTime += wordDuration
    }
    
    return wordTimings
  }

  /**
   * Synchronized speak with real-time text display callback
   */
  async speakWithSync(
    text: string,
    onTextProgress: (text: string, wordIndex: number, isComplete: boolean) => void,
    noteId?: string,
    options: ElevenLabsTTSOptions = {}
  ): Promise<void> {
    try {
      // Stop any current playback
      this.stop()
      
      const audioInfo = await this.generateSpeechSmart(text, noteId, options)
      if (!audioInfo) {
        throw new Error('Failed to generate audio')
      }

      const words = text.split(/\s+/)
      let currentWordIndex = 0
      let wordTimings: number[] = []
      let isTimingEstimated = false

      return new Promise((resolve, reject) => {
        this.currentAudio = new Audio(audioInfo.audioUrl)
        
        this.currentAudio.onloadstart = () => {
          console.log(`🎵 Loading ${audioInfo.source} audio for sync...`)
        }
        
        this.currentAudio.oncanplay = () => {
          console.log(`🎵 ${audioInfo.source} audio ready for synchronized playback`)
        }

        this.currentAudio.onloadedmetadata = () => {
          // Now we have the actual duration, estimate word timings
          const durationMs = (this.currentAudio?.duration || 0) * 1000
          wordTimings = this.estimateTextTiming(text, durationMs)
          isTimingEstimated = true
        }
        
        this.currentAudio.ontimeupdate = () => {
          if (!this.currentAudio || !isTimingEstimated) return
          
          const currentTimeMs = this.currentAudio.currentTime * 1000
          
          // Find the current word based on timing
          let newWordIndex = 0
          for (let i = 0; i < wordTimings.length; i++) {
            if (currentTimeMs >= wordTimings[i]) {
              newWordIndex = i
            } else {
              break
            }
          }
          
          // Update text if word index changed
          if (newWordIndex !== currentWordIndex) {
            currentWordIndex = newWordIndex
            const displayText = words.slice(0, currentWordIndex + 1).join(' ')
            onTextProgress(displayText, currentWordIndex, false)
          }
        }
        
        this.currentAudio.onended = () => {
          console.log(`🎵 ${audioInfo.source} synchronized audio finished`)
          
          // Show complete text
          onTextProgress(text, words.length - 1, true)
          
          // Only revoke URL if it's a generated blob URL
          if (audioInfo.source === 'generated' && audioInfo.audioUrl.startsWith('blob:')) {
            URL.revokeObjectURL(audioInfo.audioUrl)
          }
          
          this.currentAudio = null
          resolve()
        }
        
        this.currentAudio.onerror = (error) => {
          console.error(`🎵 ${audioInfo.source} synchronized audio error:`, error)
          
          // Fallback to showing full text
          onTextProgress(text, words.length - 1, true)
          
          // Only revoke URL if it's a generated blob URL
          if (audioInfo.source === 'generated' && audioInfo.audioUrl.startsWith('blob:')) {
            URL.revokeObjectURL(audioInfo.audioUrl)
          }
          
          this.currentAudio = null
          reject(error)
        }
        
        // Start playback
        this.currentAudio.play().then(() => {
          // Show first word immediately
          if (words.length > 0) {
            onTextProgress(words[0], 0, false)
          }
        }).catch(reject)
      })
      
    } catch (error) {
      console.error('Error in synchronized speak:', error)
      // Fallback to showing full text
      onTextProgress(text, text.split(/\s+/).length - 1, true)
      throw error
    }
  }

  /**
   * Set progress callback for audio playback tracking
   */
  setProgressCallback(callback: ((progress: number, currentTime: number, duration: number) => void) | null): void {
    this.progressCallback = callback
  }

  /**
   * Set end callback for when audio playback ends
   */
  setEndCallback(callback: (() => void) | null): void {
    this.onEndCallback = callback
  }
}

// Export singleton instance
export const elevenLabsTTS = new ElevenLabsTTSService()
export default elevenLabsTTS
