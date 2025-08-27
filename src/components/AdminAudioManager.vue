<template>
  <div class="admin-audio-manager">
    <div class="audio-manager-header">
      <h2 class="manager-title">🎤 Audio Management</h2>
      <p class="manager-subtitle">
        Manage cached audio files and upload custom audio for specific notes
      </p>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card cache-stats">
        <div class="stat-icon">🗄️</div>
        <div class="stat-content">
          <div class="stat-number">{{ cacheStats.totalCached }}</div>
          <div class="stat-label">Cached Files</div>
          <div class="stat-detail">{{ formatFileSize(cacheStats.totalSize) }}</div>
        </div>
      </div>
      
      <div class="stat-card custom-stats">
        <div class="stat-icon">🎵</div>
        <div class="stat-content">
          <div class="stat-number">{{ customAudioList.length }}</div>
          <div class="stat-label">Custom Audio</div>
          <div class="stat-detail">{{ activeCustomAudio }} active</div>
        </div>
      </div>
      
      <div class="stat-card savings-stats">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <div class="stat-number">${{ apiSavings.toFixed(2) }}</div>
          <div class="stat-label">API Savings</div>
          <div class="stat-detail">ElevenLabs Credits</div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="audio-tabs">
      <button 
        :class="['tab-btn', { active: activeTab === 'custom' }]"
        @click="activeTab = 'custom'"
      >
        🎵 Custom Audio
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'bot' }]"
        @click="activeTab = 'bot'"
      >
        🤖 Bot Voices
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'cache' }]"
        @click="activeTab = 'cache'"
      >
        🗄️ Cache Management
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'upload' }]"
        @click="activeTab = 'upload'"
      >
        📤 Upload Audio
      </button>
    </div>

    <!-- Bot Voice Tab -->
    <div v-if="activeTab === 'bot'" class="tab-content">
      <div class="bot-voice-section">
        <div class="section-header">
          <h3>🤖 Bot Voice Responses</h3>
          <p>Upload custom voice responses for the chatbot. Bot will use these instead of AI generation when available.</p>
        </div>

        <!-- Bot Voice Upload Form -->
        <div class="upload-form" style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
          <div class="form-group" style="margin-bottom: 16px;">
            <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #374151;">Response Text (what bot should say)</label>
            <textarea 
              v-model="botVoiceForm.text" 
              placeholder="Enter the exact text this audio should play for (e.g. 'Hello! I'm Robinson's AI assistant...')"
              style="width: 100%; min-height: 80px; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-family: inherit;"
            ></textarea>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div class="form-group">
              <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #374151;">Audio Title</label>
              <input 
                v-model="botVoiceForm.title" 
                placeholder="e.g. 'Greeting Response'"
                style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px;"
              />
            </div>
            
            <div class="form-group">
              <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #374151;">Priority (1-10)</label>
              <input 
                v-model="botVoiceForm.priority" 
                type="number" 
                min="1" 
                max="10" 
                value="5"
                style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px;"
              />
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 20px;">
            <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #374151;">Audio File</label>
            <div style="border: 2px dashed #d1d5db; border-radius: 8px; padding: 32px; text-align: center; background: white;">
              <input
                ref="botFileInput"
                type="file"
                accept="audio/*"
                @change="handleBotFileSelect"
                style="display: none;"
              />
              <div style="color: #6b7280;">
                <div style="font-size: 2rem; margin-bottom: 8px;">🎤</div>
                <p>Drop audio file here or <button type="button" @click="triggerBotFileInput" style="color: #3b82f6; text-decoration: underline; background: none; border: none; cursor: pointer;">browse</button></p>
                <small style="color: #9ca3af;">Supports MP3, WAV, M4A up to 10MB</small>
                <div v-if="botVoiceForm.file" style="margin-top: 12px; padding: 8px; background: #ecfdf5; border-radius: 6px; color: #059669;">
                  ✅ Selected: {{ botVoiceForm.file.name }}
                </div>
              </div>
            </div>
          </div>

          <Button 
            @click="uploadBotVoice" 
            :disabled="!botVoiceForm.text || !botVoiceForm.file || isUploading"
            style="width: 100%; padding: 12px;"
          >
            {{ isUploading ? 'Uploading...' : '🤖 Upload Bot Voice' }}
          </Button>
        </div>

        <!-- Bot Voice List -->
        <div v-if="botVoiceList.length === 0" class="empty-state">
          <div class="empty-icon">🤖</div>
          <h4>No bot voices uploaded</h4>
          <p>Upload custom audio responses for your chatbot to make it more personal!</p>
        </div>

        <div v-else class="audio-list">
          <div class="list-header" style="margin-bottom: 16px;">
            <h4>Bot Voice Responses ({{ botVoiceList.length }})</h4>
          </div>
          
          <div 
            v-for="audio in botVoiceList" 
            :key="audio.id"
            :class="['audio-item', { active: audio.isActive }]"
            style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 12px;"
          >
            <div class="audio-info" style="flex: 1;">
              <div style="font-weight: 600; margin-bottom: 4px;">🤖 {{ audio.title }}</div>
              <div style="color: #6b7280; font-size: 0.9rem; margin-bottom: 4px;">{{ audio.text?.slice(0, 100) || 'No text' }}...</div>
              <div style="color: #9ca3af; font-size: 0.8rem;">
                Priority: {{ audio.priority || 5 }} • 
                {{ formatFileSize(audio.fileSize || 0) }} • 
                {{ audio.uploadedAt ? new Date(audio.uploadedAt).toLocaleDateString() : 'Unknown' }}
              </div>
            </div>
            
            <div class="audio-controls" style="display: flex; gap: 8px; align-items: center;">
              <button 
                @click="playAudio(audio.audioUrl)"
                style="width: 36px; height: 36px; border: none; background: #3b82f6; color: white; border-radius: 6px; cursor: pointer;"
                title="Play"
              >
                ▶️
              </button>
              
              <button 
                @click="toggleBotVoiceActive(audio)"
                :style="{
                  width: '36px',
                  height: '36px', 
                  border: 'none',
                  background: audio.isActive ? '#059669' : '#9ca3af',
                  color: 'white',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }"
                :title="audio.isActive ? 'Disable' : 'Enable'"
              >
                {{ audio.isActive ? '🔊' : '🔇' }}
              </button>
              
              <button 
                @click="deleteBotVoice(audio.id)"
                style="width: 36px; height: 36px; border: none; background: #dc2626; color: white; border-radius: 6px; cursor: pointer;"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Audio Tab -->
    <div v-if="activeTab === 'custom'" class="tab-content">
      <div class="custom-audio-section">
        <div class="section-header">
          <h3>Custom Audio Files</h3>
          <Button @click="loadCustomAudio" variant="outline" size="sm">
            <RefreshCw class="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div v-if="customAudioList.length === 0" class="empty-state">
          <div class="empty-icon">🎵</div>
          <h4>No custom audio files</h4>
          <p>Upload custom audio files to override generated TTS for specific notes.</p>
        </div>

        <div v-else class="audio-list">
          <div 
            v-for="audio in customAudioList" 
            :key="audio.id"
            :class="['audio-item', { active: audio.isActive }]"
          >
            <div class="audio-info">
              <div class="audio-title">{{ audio.title }}</div>
              <div class="audio-meta">
                <span class="note-id">Note: {{ audio.noteId }}</span>
                <span class="file-size">{{ formatFileSize(audio.fileSize) }}</span>
                <span v-if="audio.duration" class="duration">{{ formatDuration(audio.duration) }}</span>
              </div>
              <div v-if="audio.description" class="audio-description">
                {{ audio.description }}
              </div>
            </div>

            <div class="audio-controls">
              <Button 
                @click="playCustomAudio(audio)"
                variant="ghost" 
                size="sm"
                :disabled="isPlaying"
              >
                <Play class="h-4 w-4" />
              </Button>
              
              <Button 
                @click="toggleCustomAudio(audio)"
                :variant="audio.isActive ? 'default' : 'outline'"
                size="sm"
              >
                {{ audio.isActive ? 'Active' : 'Inactive' }}
              </Button>
              
              <Button 
                @click="deleteCustomAudio(audio)"
                variant="destructive" 
                size="sm"
              >
                <Trash class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cache Management Tab -->
    <div v-if="activeTab === 'cache'" class="tab-content">
      <div class="cache-section">
        <div class="section-header">
          <h3>Audio Cache</h3>
          <div class="cache-actions">
            <Button @click="loadCacheStats" variant="outline" size="sm">
              <RefreshCw class="h-4 w-4 mr-2" />
              Refresh Stats
            </Button>
            <Button 
              @click="cleanupCache"
              variant="destructive" 
              size="sm"
              :disabled="isCleaningCache"
            >
              <Trash class="h-4 w-4 mr-2" />
              {{ isCleaningCache ? 'Cleaning...' : 'Cleanup Old Cache' }}
            </Button>
          </div>
        </div>

        <div class="cache-info">
          <div class="info-card">
            <h4>📊 Cache Statistics</h4>
            <ul>
              <li><strong>Total Files:</strong> {{ cacheStats.totalCached }}</li>
              <li><strong>Total Size:</strong> {{ formatFileSize(cacheStats.totalSize) }}</li>
              <li><strong>Oldest Entry:</strong> {{ formatDate(cacheStats.oldestEntry) }}</li>
              <li><strong>Newest Entry:</strong> {{ formatDate(cacheStats.newestEntry) }}</li>
            </ul>
          </div>

          <div class="info-card">
            <h4>💡 Cache Benefits</h4>
            <ul>
              <li>✅ Faster audio playback</li>
              <li>✅ Reduced ElevenLabs API usage</li>
              <li>✅ Improved user experience</li>
              <li>✅ Lower costs</li>
            </ul>
          </div>
        </div>

        <div class="cleanup-options">
          <h4>🧹 Cleanup Options</h4>
          <div class="cleanup-controls">
            <label>
              Delete cache older than:
              <select v-model="cleanupDays">
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days (default)</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
              </select>
            </label>
            <Button 
              @click="cleanupCache"
              :disabled="isCleaningCache"
              variant="outline"
            >
              {{ isCleaningCache ? 'Cleaning...' : `Clean ${cleanupDays}+ day old cache` }}
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Audio Tab -->
    <div v-if="activeTab === 'upload'" class="tab-content">
      <div class="upload-section">
        <h3>📤 Upload Custom Audio</h3>
        
        <form @submit.prevent="uploadAudio" class="upload-form">
          <div class="form-group">
            <label for="noteId">Note ID</label>
            <input 
              id="noteId"
              v-model="uploadForm.noteId" 
              type="text" 
              required 
              placeholder="Enter the note ID this audio belongs to"
            />
            <small>You can find the note ID in the notes list or article URL</small>
          </div>

          <div class="form-group">
            <label for="title">Audio Title</label>
            <input 
              id="title"
              v-model="uploadForm.title" 
              type="text" 
              required 
              placeholder="Enter a descriptive title"
            />
          </div>

          <div class="form-group">
            <label for="description">Description (Optional)</label>
            <textarea 
              id="description"
              v-model="uploadForm.description" 
              placeholder="Add any notes about this audio file"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="audio">Audio File</label>
            <input 
              id="audio"
              ref="audioFileInput"
              type="file" 
              accept="audio/*"
              required 
              @change="handleFileSelect"
            />
            <small>Supported formats: MP3, WAV, M4A, OGG (Max 10MB)</small>
          </div>

          <div v-if="uploadForm.file" class="file-preview">
            <div class="preview-info">
              <strong>{{ uploadForm.file.name }}</strong>
              <span>{{ formatFileSize(uploadForm.file.size) }}</span>
            </div>
          </div>

          <div class="form-actions">
            <Button 
              type="submit" 
              :disabled="isUploading || !uploadForm.file"
              class="upload-btn"
            >
              {{ isUploading ? 'Uploading...' : '📤 Upload Audio' }}
            </Button>
            <Button 
              type="button" 
              @click="resetUploadForm"
              variant="outline"
            >
              Reset Form
            </Button>
          </div>
        </form>
      </div>
    </div>

    <!-- Audio Player (Hidden) -->
    <audio ref="audioPlayer" @ended="isPlaying = false" style="display: none;"></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Button from '@/components/ui/Button.vue'
import { RefreshCw, Play, Trash } from 'lucide-vue-next'
import audioApi from '@/services/audio-api'

// Local interface to avoid import issues
interface CustomAudio {
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

// Reactive state
const activeTab = ref<'custom' | 'cache' | 'upload' | 'bot'>('custom')
const customAudioList = ref<CustomAudio[]>([])
const botVoiceList = ref<any[]>([])
const cacheStats = ref({
  totalCached: 0,
  totalSize: 0,
  oldestEntry: null as Date | null,
  newestEntry: null as Date | null
})

const isPlaying = ref(false)
const isUploading = ref(false)
const isCleaningCache = ref(false)
const cleanupDays = ref(30)

// Upload form
const uploadForm = ref({
  noteId: '',
  title: '',
  description: '',
  file: null as File | null
})

// Bot voice upload form
const botVoiceForm = ref({
  text: '',
  title: '',
  priority: 5,
  file: null as File | null
})

const audioFileInput = ref<HTMLInputElement>()
const botFileInput = ref<HTMLInputElement>()
const audioPlayer = ref<HTMLAudioElement>()

// Computed values
const activeCustomAudio = computed(() => 
  customAudioList.value.filter(audio => audio.isActive).length
)

const apiSavings = computed(() => {
  // Estimate savings: $0.30 per 1000 characters for ElevenLabs
  // Average article is ~500 words = 3000 characters = ~$0.90 per generation
  const avgCostPerAudio = 0.90
  const totalSaved = cacheStats.value.totalCached * avgCostPerAudio
  return totalSaved
})

// Methods
async function loadCustomAudio() {
  try {
    customAudioList.value = await audioApi.getAllCustomAudio()
  } catch (error) {
    console.error('Error loading custom audio:', error)
  }
}

async function loadCacheStats() {
  try {
    cacheStats.value = await audioApi.getCacheStats()
  } catch (error) {
    console.error('Error loading cache stats:', error)
  }
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }
    
    uploadForm.value.file = file
    
    // Auto-fill title from filename if empty
    if (!uploadForm.value.title) {
      uploadForm.value.title = file.name.replace(/\.[^/.]+$/, '')
    }
  }
}

async function uploadAudio() {
  if (!uploadForm.value.file) return
  
  isUploading.value = true
  
  try {
    const result = await audioApi.uploadCustomAudio({
      noteId: uploadForm.value.noteId,
      title: uploadForm.value.title,
      description: uploadForm.value.description,
      file: uploadForm.value.file
    })
    
    if (result) {
      alert('✅ Audio uploaded successfully!')
      resetUploadForm()
      await loadCustomAudio()
    } else {
      alert('❌ Failed to upload audio')
    }
  } catch (error) {
    console.error('Upload error:', error)
    alert('❌ Upload failed: ' + (error as Error).message)
  } finally {
    isUploading.value = false
  }
}

function resetUploadForm() {
  uploadForm.value = {
    noteId: '',
    title: '',
    description: '',
    file: null
  }
  if (audioFileInput.value) {
    audioFileInput.value.value = ''
  }
}

// Bot voice functions
function triggerBotFileInput() {
  botFileInput.value?.click()
}

function handleBotFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }
    
    // Validate file type
    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file (MP3, WAV, M4A, etc.)')
      return
    }
    
    botVoiceForm.value.file = file
    
    // Auto-fill title from filename if empty
    if (!botVoiceForm.value.title) {
      botVoiceForm.value.title = file.name.replace(/\.[^/.]+$/, '')
    }
  }
}

async function uploadBotVoice() {
  if (!botVoiceForm.value.file || !botVoiceForm.value.text) return
  
  isUploading.value = true
  
  try {
    const formData = new FormData()
    formData.append('audio', botVoiceForm.value.file)
    formData.append('text', botVoiceForm.value.text)
    formData.append('title', botVoiceForm.value.title)
    formData.append('priority', String(botVoiceForm.value.priority))
    formData.append('type', 'bot_response')
    
    // Use the same API endpoint but mark as bot voice
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/audio/bot/upload`, {
      method: 'POST',
      body: formData
    })
    
    if (response.ok) {
      alert('✅ Bot voice uploaded successfully!')
      resetBotVoiceForm()
      await loadBotVoices()
    } else {
      alert('❌ Failed to upload bot voice')
    }
  } catch (error) {
    console.error('Bot voice upload error:', error)
    alert('❌ Upload failed: ' + (error as Error).message)
  } finally {
    isUploading.value = false
  }
}

function resetBotVoiceForm() {
  botVoiceForm.value = {
    text: '',
    title: '',
    priority: 5,
    file: null
  }
  if (botFileInput.value) {
    botFileInput.value.value = ''
  }
}

async function loadBotVoices() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/audio/bot/list`)
    if (response.ok) {
      const data = await response.json()
      // Backend returns {results: [...]} format
      botVoiceList.value = data.results || data
    }
  } catch (error) {
    console.log('Failed to load bot voices:', error)
    botVoiceList.value = []
  }
}

async function toggleBotVoiceActive(audio: any) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/audio/bot/${audio.id}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !audio.isActive })
    })
    
    if (response.ok) {
      audio.isActive = !audio.isActive
    } else {
      alert('Failed to toggle bot voice status')
    }
  } catch (error) {
    console.error('Error toggling bot voice:', error)
  }
}

async function deleteBotVoice(audioId: string) {
  if (!confirm('Are you sure you want to delete this bot voice?')) return
  
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/audio/bot/${audioId}`, {
      method: 'DELETE'
    })
    
    if (response.ok) {
      botVoiceList.value = botVoiceList.value.filter(a => a.id !== audioId)
    } else {
      alert('Failed to delete bot voice')
    }
  } catch (error) {
    console.error('Error deleting bot voice:', error)
  }
}

function playAudio(audioUrl: string) {
  const audio = new Audio(audioUrl)
  audio.volume = 0.8
  audio.play().catch(error => {
    console.log('Audio playback failed:', error)
  })
}

async function playCustomAudio(audio: CustomAudio) {
  if (isPlaying.value) return
  
  try {
    isPlaying.value = true
    if (audioPlayer.value) {
      audioPlayer.value.src = audio.audioUrl
      await audioPlayer.value.play()
    }
  } catch (error) {
    console.error('Error playing audio:', error)
    isPlaying.value = false
  }
}

async function toggleCustomAudio(audio: CustomAudio) {
  try {
    const success = await audioApi.toggleCustomAudio(audio.id, !audio.isActive)
    if (success) {
      audio.isActive = !audio.isActive
    } else {
      alert('Failed to toggle audio status')
    }
  } catch (error) {
    console.error('Error toggling audio:', error)
  }
}

async function deleteCustomAudio(audio: CustomAudio) {
  if (!confirm(`Are you sure you want to delete "${audio.title}"?`)) return
  
  try {
    const success = await audioApi.deleteCustomAudio(audio.id)
    if (success) {
      customAudioList.value = customAudioList.value.filter(a => a.id !== audio.id)
    } else {
      alert('Failed to delete audio')
    }
  } catch (error) {
    console.error('Error deleting audio:', error)
  }
}

async function cleanupCache() {
  if (!confirm(`Delete all cache files older than ${cleanupDays.value} days?`)) return
  
  isCleaningCache.value = true
  
  try {
    const deletedCount = await audioApi.cleanupOldCache(cleanupDays.value)
    alert(`✅ Cleaned up ${deletedCount} old cache files`)
    await loadCacheStats()
  } catch (error) {
    console.error('Error cleaning cache:', error)
    alert('❌ Cache cleanup failed')
  } finally {
    isCleaningCache.value = false
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function formatDate(date: Date | null): string {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

// Load data on mount
onMounted(async () => {
  await Promise.all([
    loadCustomAudio(),
    loadCacheStats(),
    loadBotVoices()
  ])
})
</script>

<style scoped>
.admin-audio-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.audio-manager-header {
  text-align: center;
  margin-bottom: 30px;
}

.manager-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: hsl(var(--foreground));
}

.manager-subtitle {
  color: hsl(var(--muted-foreground));
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  font-size: 2rem;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: hsl(var(--primary));
}

.stat-label {
  font-size: 0.9rem;
  color: hsl(var(--muted-foreground));
  margin-bottom: 4px;
}

.stat-detail {
  font-size: 0.8rem;
  color: hsl(var(--muted-foreground));
}

.audio-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 20px;
  border-bottom: 1px solid hsl(var(--border));
}

.tab-btn {
  padding: 12px 20px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: hsl(var(--muted-foreground));
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: hsl(var(--foreground));
  background: hsl(var(--muted) / 0.5);
}

.tab-btn.active {
  color: hsl(var(--primary));
  border-bottom-color: hsl(var(--primary));
}

.tab-content {
  min-height: 400px;
}

.section-header {
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 1.3rem;
  font-weight: 600;
}

.cache-actions,
.form-actions {
  display: flex;
  gap: 10px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: hsl(var(--muted-foreground));
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.audio-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.audio-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 8px;
  transition: all 0.2s;
}

.audio-item.active {
  border-color: hsl(var(--primary));
  background: hsl(var(--primary) / 0.05);
}

.audio-info {
  flex: 1;
}

.audio-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.audio-meta {
  display: flex;
  gap: 12px;
  font-size: 0.8rem;
  color: hsl(var(--muted-foreground));
}

.audio-description {
  margin-top: 8px;
  font-size: 0.9rem;
  color: hsl(var(--muted-foreground));
}

.audio-controls {
  display: flex;
  gap: 8px;
}

.cache-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.info-card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 8px;
  padding: 20px;
}

.info-card h4 {
  margin-bottom: 12px;
  color: hsl(var(--foreground));
}

.info-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-card li {
  padding: 4px 0;
  color: hsl(var(--muted-foreground));
}

.cleanup-options {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 8px;
  padding: 20px;
}

.cleanup-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 12px;
}

.cleanup-controls label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cleanup-controls select {
  padding: 6px 10px;
  border: 1px solid hsl(var(--border));
  border-radius: 4px;
  background: hsl(var(--background));
}

.upload-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: hsl(var(--foreground));
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid hsl(var(--border));
  border-radius: 6px;
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  box-sizing: border-box;
}

.form-group small {
  display: block;
  margin-top: 4px;
  color: hsl(var(--muted-foreground));
  font-size: 0.8rem;
}

.file-preview {
  margin-top: 12px;
  padding: 12px;
  background: hsl(var(--muted) / 0.3);
  border-radius: 6px;
  border: 1px solid hsl(var(--border));
}

.preview-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 30px;
}

.upload-btn {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}
</style>
