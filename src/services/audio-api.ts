/**
 * Audio Management API Service
 * Handles cached TTS audio and custom admin uploads
 */

// Simple type definitions to avoid import issues
interface AudioCacheItem {
  id: string
  text: string
  textHash: string
  voiceId: string
  audioUrl: string
  fileName: string
  fileSize: number
  duration?: number
  createdAt: Date
  lastUsed: Date
  source: 'generated' | 'uploaded'
}

interface CustomAudioItem {
  id: string
  noteId: string
  title: string
  description?: string
  audioUrl: string
  fileName: string
  fileSize: number
  duration?: number
  uploadedBy: string
  uploadedAt: Date
  isActive: boolean
}

interface AudioPlayback {
  id: string
  audioUrl: string
  source: 'cache' | 'custom' | 'generated'
  title?: string
  duration?: number
}

class AudioApiService {
  private readonly baseUrl: string = '/api/audio'

  /**
   * Generate hash for text content (for cache key)
   */
  private generateTextHash(text: string, voiceId: string, settings: any): string {
    const content = `${text}-${voiceId}-${JSON.stringify(settings)}`
    // Simple hash function for cache key
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16)
  }

  /**
   * Check if audio is cached for given text and settings
   */
  async checkCache(request: {
    text: string
    voiceId?: string
    voiceSettings?: any
  }): Promise<AudioCacheItem | null> {
    try {
      const textHash = this.generateTextHash(
        request.text, 
        request.voiceId || 'default',
        request.voiceSettings || {}
      )
      
      const response = await fetch(`${this.baseUrl}/cache/${textHash}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const cached = await response.json()
        // Update last used timestamp
        await this.updateCacheLastUsed(cached.id)
        return cached
      }
      
      return null
    } catch (error) {
      console.warn('Error checking audio cache:', error)
      return null
    }
  }

  /**
   * Store generated audio in cache
   */
  async storeCache(
    request: {
      text: string
      voiceId?: string
      voiceSettings?: any
    }, 
    audioBlob: Blob, 
    fileName: string
  ): Promise<AudioCacheItem | null> {
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, fileName)
      formData.append('text', request.text)
      formData.append('textHash', this.generateTextHash(
        request.text,
        request.voiceId || 'default',
        request.voiceSettings || {}
      ))
      formData.append('voiceId', request.voiceId || 'default')
      formData.append('voiceSettings', JSON.stringify(request.voiceSettings || {}))
      formData.append('source', 'generated')

      const response = await fetch(`${this.baseUrl}/cache`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        return await response.json()
      }
      
      throw new Error(`Failed to store cache: ${response.status}`)
    } catch (error) {
      console.error('Error storing audio cache:', error)
      return null
    }
  }

  /**
   * Update last used timestamp for cached audio
   */
  private async updateCacheLastUsed(cacheId: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/cache/${cacheId}/last-used`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.warn('Error updating cache last used:', error)
    }
  }

  /**
   * Get custom audio for a specific note
   */
  async getCustomAudio(noteId: string): Promise<CustomAudioItem | null> {
    try {
      const response = await fetch(`${this.baseUrl}/custom/note/${noteId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        return await response.json()
      }
      
      return null
    } catch (error) {
      console.warn('Error fetching custom audio:', error)
      return null
    }
  }

  /**
   * Upload custom audio file (admin only)
   * Supports common audio formats: MP3, WAV, M4A, OGG
   */
  async uploadCustomAudio(request: {
    noteId: string
    title: string
    description?: string
    file: File
    textContent?: string // Optional text content for this audio
  }): Promise<CustomAudioItem | null> {
    try {
      // Validate file type
      const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/ogg', 'audio/webm']
      if (!validTypes.includes(request.file.type)) {
        throw new Error(`Invalid file type. Supported formats: MP3, WAV, M4A, OGG`)
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (request.file.size > maxSize) {
        throw new Error('File size too large. Maximum allowed: 10MB')
      }

      const formData = new FormData()
      formData.append('audio', request.file)
      formData.append('noteId', request.noteId)
      formData.append('title', request.title)
      if (request.description) {
        formData.append('description', request.description)
      }
      if (request.textContent) {
        formData.append('textContent', request.textContent)
      }

      const response = await fetch(`${this.baseUrl}/custom`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      })

      if (response.ok) {
        const result = await response.json()
        console.log(`📁 Custom audio uploaded successfully: ${request.title}`)
        return result
      }
      
      throw new Error(`Failed to upload audio: ${response.status}`)
    } catch (error) {
      console.error('Error uploading custom audio:', error)
      return null
    }
  }

  /**
   * Get all custom audio files (admin only)
   */
  async getAllCustomAudio(): Promise<CustomAudioItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}/custom`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      })

      if (response.ok) {
        return await response.json()
      }
      
      return []
    } catch (error) {
      console.error('Error fetching custom audio list:', error)
      return []
    }
  }

  /**
   * Delete custom audio (admin only)
   */
  async deleteCustomAudio(audioId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/custom/${audioId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      })

      return response.ok
    } catch (error) {
      console.error('Error deleting custom audio:', error)
      return false
    }
  }

  /**
   * Toggle custom audio active status (admin only)
   */
  async toggleCustomAudio(audioId: string, isActive: boolean): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/custom/${audioId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ isActive }),
      })

      return response.ok
    } catch (error) {
      console.error('Error toggling custom audio:', error)
      return false
    }
  }

  /**
   * Get best audio for playback (checks custom first, then cache, then generates)
   */
  async getBestAudio(noteId: string, text: string, voiceSettings?: any): Promise<AudioPlayback | null> {
    try {
      // 1. Check for active custom audio first
      const customAudio = await this.getCustomAudio(noteId)
      if (customAudio && customAudio.isActive) {
        return {
          id: customAudio.id,
          audioUrl: customAudio.audioUrl,
          source: 'custom',
          title: customAudio.title,
          duration: customAudio.duration,
        }
      }

      // 2. Check cache for generated audio
      const cachedAudio = await this.checkCache({
        text,
        voiceId: 'default',
        voiceSettings,
      })
      
      if (cachedAudio) {
        return {
          id: cachedAudio.id,
          audioUrl: cachedAudio.audioUrl,
          source: 'cache',
          duration: cachedAudio.duration,
        }
      }

      // 3. No cached or custom audio found
      return null
    } catch (error) {
      console.error('Error getting best audio:', error)
      return null
    }
  }

  /**
   * Clean up old cache entries (admin utility)
   */
  async cleanupOldCache(daysOld: number = 30): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/cache/cleanup`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ daysOld }),
      })

      if (response.ok) {
        const result = await response.json()
        return result.deletedCount || 0
      }
      
      return 0
    } catch (error) {
      console.error('Error cleaning up cache:', error)
      return 0
    }
  }

  /**
   * Get cache statistics (admin)
   */
  async getCacheStats(): Promise<{
    totalCached: number
    totalSize: number
    oldestEntry: Date | null
    newestEntry: Date | null
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/cache/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      })

      if (response.ok) {
        return await response.json()
      }
      
      return {
        totalCached: 0,
        totalSize: 0,
        oldestEntry: null,
        newestEntry: null,
      }
    } catch (error) {
      console.error('Error fetching cache stats:', error)
      return {
        totalCached: 0,
        totalSize: 0,
        oldestEntry: null,
        newestEntry: null,
      }
    }
  }

  /**
   * Upload multiple custom audio files for batch processing
   */
  async uploadBatchCustomAudio(files: {
    noteId: string
    title: string
    description?: string
    file: File
    textContent?: string
  }[]): Promise<{
    successful: CustomAudioItem[]
    failed: { file: string; error: string }[]
  }> {
    const results = {
      successful: [] as CustomAudioItem[],
      failed: [] as { file: string; error: string }[]
    }

    for (const fileData of files) {
      try {
        const result = await this.uploadCustomAudio(fileData)
        if (result) {
          results.successful.push(result)
        } else {
          results.failed.push({ file: fileData.title, error: 'Upload failed' })
        }
      } catch (error) {
        results.failed.push({ 
          file: fileData.title, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        })
      }
    }

    return results
  }

  /**
   * Find custom audio by text content (fuzzy matching)
   */
  async findCustomAudioByText(text: string): Promise<CustomAudioItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}/custom/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ searchText: text.trim().toLowerCase() }),
      })

      if (response.ok) {
        return await response.json()
      }
      
      return []
    } catch (error) {
      console.error('Error searching custom audio by text:', error)
      return []
    }
  }

  /**
   * Get audio duration (client-side utility)
   */
  async getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration)
      })
      audio.addEventListener('error', reject)
      audio.src = URL.createObjectURL(file)
    })
  }

  /**
   * Convert audio file to different format if needed
   */
  async convertAudioFormat(file: File, targetFormat: 'mp3' | 'wav' = 'mp3'): Promise<File> {
    // This would typically be done on the backend, but we'll return the original file
    // In a real implementation, you'd use Web Audio API or send to backend for conversion
    console.log(`Audio format conversion requested: ${file.type} -> ${targetFormat}`)
    return file
  }

  /**
   * Get authentication token (implement based on your auth system)
   */
  private getAuthToken(): string {
    // Implement based on your authentication system
    return localStorage.getItem('auth_token') || ''
  }
}

// Export singleton instance
export const audioApi = new AudioApiService()
export default audioApi
