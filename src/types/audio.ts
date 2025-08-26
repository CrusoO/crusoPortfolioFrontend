/**
 * Audio Management Types
 * Types for cached TTS audio and custom admin uploads
 */

export interface AudioCache {
  id: string
  text: string
  textHash: string // MD5 hash of the text for quick lookup
  voiceId: string
  voiceSettings: {
    stability: number
    similarityBoost: number
    style: number
    useSpeakerBoost: boolean
  }
  audioUrl: string
  fileName: string
  fileSize: number
  duration?: number // in seconds
  createdAt: Date
  lastUsed: Date
  source: 'generated' | 'uploaded'
}

export interface CustomAudio {
  id: string
  noteId: string // Reference to the note/article this audio belongs to
  title: string
  description?: string
  audioUrl: string
  fileName: string
  fileSize: number
  duration?: number
  uploadedBy: string // Admin user ID
  uploadedAt: Date
  isActive: boolean // Whether this custom audio should be used instead of generated
}

export interface AudioUploadRequest {
  noteId: string
  title: string
  description?: string
  file: File
}

export interface AudioCacheRequest {
  text: string
  voiceId?: string
  voiceSettings?: {
    stability?: number
    similarityBoost?: number
    style?: number
    useSpeakerBoost?: boolean
  }
}

export interface AudioPlaybackInfo {
  id: string
  audioUrl: string
  source: 'cache' | 'custom' | 'generated'
  title?: string
  duration?: number
}
