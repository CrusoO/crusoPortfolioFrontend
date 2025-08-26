<template>
  <div class="admin-notes-manager" :class="{ 'fullscreen': isFullscreen }">
    <!-- Add/Edit Note Form -->
    <div v-if="showAddForm || editingNote" class="note-form-container">
      <div class="note-form">
        <div class="form-header">
          <h3 class="form-title">
            {{ editingNote ? 'Edit Note' : 'Add New Note' }}
          </h3>
          <Button @click="closeForm" variant="ghost" size="sm">
            <X class="h-4 w-4" />
          </Button>
        </div>
        
        <div class="form-content">
          <div class="form-group">
            <Label for="note-title">Title *</Label>
            <Input 
              id="note-title"
              v-model="formData.title"
              placeholder="Enter note title"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <Label for="note-category">Category *</Label>
            <select v-model="formData.category" class="form-select">
              <option value="">Select category</option>
              <option value="personal">Personal</option>
              <option value="technical">Technical</option>
              <option value="creative">Creative</option>
              <option value="research">Research</option>
            </select>
          </div>
          
          <div class="form-group">
            <Label for="note-content">Content *</Label>
            <Textarea 
              id="note-content"
              v-model="formData.content"
              placeholder="Write your note content here..."
              rows="10"
              class="form-textarea"
            />
          </div>
          
          <div class="form-group">
            <Label for="note-tags">Tags (comma separated)</Label>
            <Input 
              id="note-tags"
              v-model="formData.tagsText"
              placeholder="javascript, coding, tutorial"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <Label for="note-read-time">Read Time (minutes)</Label>
            <Input 
              id="note-read-time"
              v-model.number="formData.readTime"
              type="number"
              min="1"
              placeholder="5"
              class="form-input"
            />
          </div>
          
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="formData.isPublished"
                class="checkbox-input"
              />
              <span class="checkbox-text">Publish this note</span>
            </label>
          </div>
        </div>
        
        <div class="form-actions">
          <Button @click="closeForm" variant="outline">
            Cancel
          </Button>
          <Button 
            @click="saveNote" 
            :disabled="isSaving || !canSave"
            class="save-btn"
          >
            <Save class="h-4 w-4 mr-2" />
            {{ isSaving ? 'Saving...' : (editingNote ? 'Update' : 'Create') }}
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Notes List -->
    <div class="notes-list-container">
      <div class="list-header">
        <h3 class="list-title">Manage Notes ({{ notes.length }})</h3>
        <div class="list-actions">
          <Input 
            v-model="searchQuery"
            placeholder="Search notes..."
            class="search-input"
          />
          <Button @click="loadNotes" variant="outline" size="sm">
            <RotateCcw class="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            @click="openAudioManager" 
            variant="outline" 
            size="sm"
            title="Manage audio files and cache"
            class="audio-manager-btn"
          >
            <Volume2 class="h-4 w-4 mr-1" />
            Audio Manager
          </Button>
          <Button 
            @click="toggleFullscreen" 
            variant="outline" 
            size="sm" 
            :title="isFullscreen ? 'Exit Fullscreen (ESC)' : 'Enter Fullscreen'"
            class="fullscreen-toggle-btn"
          >
            <Minimize class="h-4 w-4 mr-1" v-if="isFullscreen" />
            <Maximize class="h-4 w-4 mr-1" v-else />
            {{ isFullscreen ? 'Exit' : 'Fullscreen' }}
          </Button>
        </div>
      </div>
      
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading notes...</p>
      </div>
      
      <div v-else-if="filteredNotes.length === 0" class="empty-state">
        <FileText class="empty-icon" />
        <h4 class="empty-title">No notes found</h4>
        <p class="empty-description">
          {{ searchQuery ? 'Try adjusting your search' : 'Click "Add Note" to create your first note' }}
        </p>
      </div>
      
      <div v-else class="notes-grid">
        <div 
          v-for="note in filteredNotes"
          :key="note.id"
          class="note-card"
        >
          <div class="note-card-content">
            <div class="note-card-header">
              <h4 class="note-card-title">{{ note.title }}</h4>
              <div class="note-card-status">
                <Badge :variant="note.is_published ? 'default' : 'secondary'">
                  {{ note.is_published ? 'Published' : 'Draft' }}
                </Badge>
              </div>
            </div>
            
            <p class="note-card-snippet">{{ getSnippet(note.content) }}</p>
            
            <div class="note-card-meta">
              <span class="note-meta-item">{{ note.category }}</span>
              <span class="note-meta-item">{{ note.read_time }}min read</span>
              <span class="note-meta-item">{{ note.created_at ? formatDate(note.created_at) : 'Unknown date' }}</span>
            </div>
            
            <div class="note-card-tags">
              <span 
                v-for="tag in note.tags?.slice(0, 3) || []" 
                :key="tag"
                class="note-tag"
              >
                {{ tag }}
              </span>
              <span 
                v-if="note.tags && note.tags.length > 3"
                class="note-tag-more"
              >
                +{{ note.tags.length - 3 }}
              </span>
            </div>
          </div>
          
          <div class="note-card-actions">
            <Button @click="editNote(note)" variant="ghost" size="sm">
              <Edit class="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              @click="note.id && deleteNote(note.id)" 
              variant="ghost" 
              size="sm"
              class="delete-btn"
            >
              <Trash2 class="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, onMounted, onUnmounted } from 'vue'
import { X, Save, Edit, Trash2, FileText, RotateCcw, Maximize, Minimize, Volume2 } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Textarea from '@/components/ui/Textarea.vue'
import Label from '@/components/ui/Label.vue'
import Badge from '@/components/ui/Badge.vue'
import { API_ENDPOINTS } from '@/config/api'

interface Props {
  showAddForm: boolean
}

interface Note {
  id?: number
  title: string
  content: string
  category: string
  tags?: string[]
  read_time: number
  is_published: boolean
  created_at?: string
  updated_at?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  closeAddForm: []
  notesUpdated: []
}>()

const notes = ref<Note[]>([])
const isLoading = ref(false)
const isSaving = ref(false)
const searchQuery = ref('')
const editingNote = ref<Note | null>(null)
const isFullscreen = ref(false)

const formData = ref({
  title: '',
  content: '',
  category: '',
  tagsText: '',
  readTime: '5',
  isPublished: true
})

const canSave = computed(() => {
  return formData.value.title.trim() && 
         formData.value.content.trim() && 
         formData.value.category
})

const filteredNotes = computed(() => {
  if (!searchQuery.value) return notes.value
  
  const query = searchQuery.value.toLowerCase()
  return notes.value.filter(note => 
    note.title.toLowerCase().includes(query) ||
    note.content.toLowerCase().includes(query) ||
    note.category.toLowerCase().includes(query) ||
    note.tags?.some(tag => tag.toLowerCase().includes(query))
  )
})

async function loadNotes() {
  isLoading.value = true
  try {
    const response = await fetch(API_ENDPOINTS.NOTES)
    if (response.ok) {
      notes.value = await response.json()
      console.log('✅ Loaded notes for admin:', notes.value.length)
    } else {
      throw new Error('Failed to load notes')
    }
  } catch (error) {
    console.error('❌ Error loading notes:', error)
  } finally {
    isLoading.value = false
  }
}

async function saveNote() {
  if (!canSave.value) return
  
  isSaving.value = true
  try {
    const tags = formData.value.tagsText
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
    
    const noteData = {
      title: formData.value.title.trim(),
      content: formData.value.content.trim(),
      category: formData.value.category,
      tags: tags,
      read_time: parseInt(formData.value.readTime) || 1,
      is_published: formData.value.isPublished
    }
    
    let response: Response
    
    if (editingNote.value) {
      // Update existing note
      response = await fetch(`${API_ENDPOINTS.NOTES}/${editingNote.value.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData)
      })
    } else {
      // Create new note
      response = await fetch(API_ENDPOINTS.NOTES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData)
      })
    }
    
    if (response.ok) {
      console.log(`✅ Note ${editingNote.value ? 'updated' : 'created'} successfully`)
      await loadNotes() // Refresh the list
      emit('notesUpdated') // Notify parent to refresh public view
      closeForm()
    } else {
      throw new Error(`Failed to ${editingNote.value ? 'update' : 'create'} note`)
    }
  } catch (error) {
    console.error('❌ Error saving note:', error)
    alert(`Failed to ${editingNote.value ? 'update' : 'create'} note. Please try again.`)
  } finally {
    isSaving.value = false
  }
}

async function deleteNote(id: number) {
  if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
    return
  }
  
  try {
    const response = await fetch(`${API_ENDPOINTS.NOTES}/${id}`, {
      method: 'DELETE'
    })
    
    if (response.ok) {
      console.log('✅ Note deleted successfully')
      await loadNotes() // Refresh the list
      emit('notesUpdated') // Notify parent to refresh public view
    } else {
      throw new Error('Failed to delete note')
    }
  } catch (error) {
    console.error('❌ Error deleting note:', error)
    alert('Failed to delete note. Please try again.')
  }
}

function editNote(note: Note) {
  editingNote.value = note
  formData.value = {
    title: note.title,
    content: note.content,
    category: note.category,
    tagsText: note.tags?.join(', ') || '',
    readTime: note.read_time.toString(),
    isPublished: note.is_published
  }
}

function closeForm() {
  editingNote.value = null
  formData.value = {
    title: '',
    content: '',
    category: '',
    tagsText: '',
    readTime: '5',
    isPublished: true
  }
  emit('closeAddForm')
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
  
  // Add/remove fullscreen classes to body to handle scroll and other global styles
  if (isFullscreen.value) {
    document.body.style.overflow = 'hidden'
    document.body.classList.add('notes-fullscreen')
    // Add escape key listener for fullscreen mode
    document.addEventListener('keydown', handleEscapeKey)
  } else {
    document.body.style.overflow = ''
    document.body.classList.remove('notes-fullscreen')
    // Remove escape key listener
    document.removeEventListener('keydown', handleEscapeKey)
  }
}

function handleEscapeKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && isFullscreen.value) {
    toggleFullscreen()
  }
}

function openAudioManager() {
  // Open audio manager in a new window/tab or modal
  // This could be implemented as a modal overlay or a new route
  const audioManagerUrl = '/admin/audio-manager'
  window.open(audioManagerUrl, '_blank', 'width=1200,height=800,scrollbars=yes')
  
  // Alternative: Emit event to parent component to show audio manager modal
  // emit('openAudioManager')
}

function getSnippet(content: string, length: number = 100): string {
  // Remove HTML tags and get plain text snippet
  const plainText = content.replace(/<[^>]*>/g, '')
  return plainText.length > length 
    ? plainText.substring(0, length) + '...'
    : plainText
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  loadNotes()
})

onUnmounted(() => {
  // Cleanup fullscreen state when component is destroyed
  if (isFullscreen.value) {
    document.body.style.overflow = ''
    document.body.classList.remove('notes-fullscreen')
    document.removeEventListener('keydown', handleEscapeKey)
  }
})
</script>

<style scoped>
.admin-notes-manager {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  transition: all 0.3s ease;
}

/* Fullscreen Mode */
.admin-notes-manager.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: hsl(var(--background));
  z-index: 9999;
  padding: 1rem;
  overflow: hidden;
}

.admin-notes-manager.fullscreen .notes-list-container {
  height: calc(100vh - 2rem);
  max-height: none;
}

.admin-notes-manager.fullscreen .notes-grid {
  height: calc(100vh - 140px);
  overflow-y: auto;
  padding-right: 0.5rem;
}

.admin-notes-manager.fullscreen .list-header {
  position: sticky;
  top: 0;
  background: hsl(var(--background));
  z-index: 10;
  padding-bottom: 1rem;
  border-bottom: 1px solid hsl(var(--border));
  margin-bottom: 1rem;
}

.admin-notes-manager.fullscreen .note-form-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 11;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

/* Note Form */
.note-form-container {
  background: hsl(var(--muted) / 0.3);
  border-radius: 12px;
  padding: 1.5rem;
}

.note-form {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 8px;
  overflow: hidden;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid hsl(var(--border));
  background: hsl(var(--muted) / 0.5);
}

.form-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin: 0;
}

.form-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-input, .form-textarea, .form-select {
  padding: 0.75rem;
  border: 1px solid hsl(var(--border));
  border-radius: 6px;
  font-size: 0.875rem;
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  transition: border-color 0.2s ease;
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  outline: none;
  border-color: hsl(var(--primary));
  box-shadow: 0 0 0 2px hsl(var(--primary) / 0.2);
}

.form-textarea {
  resize: vertical;
  min-height: 200px;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.checkbox-text {
  font-size: 0.875rem;
  color: hsl(var(--foreground));
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid hsl(var(--border));
  background: hsl(var(--muted) / 0.3);
}

.save-btn {
  min-width: 100px;
}

/* Notes List */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.list-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin: 0;
}

.list-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.search-input {
  width: 250px;
}

.fullscreen-toggle-btn {
  min-width: 100px;
  position: relative;
  background: hsl(var(--primary)/10) !important;
  border-color: hsl(var(--primary)) !important;
  color: hsl(var(--primary)) !important;
  font-weight: 600;
  font-size: 0.875rem;
}

.fullscreen-toggle-btn:hover {
  background: hsl(var(--primary)) !important;
  color: hsl(var(--primary-foreground)) !important;
  transform: scale(1.02);
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: hsl(var(--muted-foreground));
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid hsl(var(--muted));
  border-top: 3px solid hsl(var(--primary));
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  color: hsl(var(--muted-foreground));
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: hsl(var(--foreground));
}

.empty-description {
  color: hsl(var(--muted-foreground));
}

/* Notes Grid */
.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.note-card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.note-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px hsl(var(--foreground) / 0.1);
}

.note-card-content {
  padding: 1.25rem;
}

.note-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 1rem;
}

.note-card-title {
  font-size: 1rem;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin: 0;
  line-height: 1.4;
}

.note-card-snippet {
  color: hsl(var(--muted-foreground));
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.note-card-meta {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.note-meta-item {
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
  background: hsl(var(--muted) / 0.5);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.note-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.note-tag {
  font-size: 0.75rem;
  background: hsl(var(--primary) / 0.1);
  color: hsl(var(--primary));
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  border: 1px solid hsl(var(--primary) / 0.2);
}

.note-tag-more {
  font-size: 0.75rem;
  background: hsl(var(--muted));
  color: hsl(var(--muted-foreground));
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
}

.note-card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-top: 1px solid hsl(var(--border));
  background: hsl(var(--muted) / 0.3);
}

.delete-btn:hover {
  color: #ef4444;
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .list-actions {
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .search-input {
    width: 150px;
    min-width: 120px;
  }
  
  .fullscreen-toggle-btn {
    flex-shrink: 0;
    order: 999;
  }
  
  .notes-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
}
</style>

<style>
/* Global styles for fullscreen mode */
body.notes-fullscreen {
  overflow: hidden !important;
}

/* Enhanced scrollbar for fullscreen mode */
.admin-notes-manager.fullscreen .notes-grid::-webkit-scrollbar {
  width: 8px;
}

.admin-notes-manager.fullscreen .notes-grid::-webkit-scrollbar-track {
  background: hsl(var(--muted));
  border-radius: 4px;
}

.admin-notes-manager.fullscreen .notes-grid::-webkit-scrollbar-thumb {
  background: hsl(var(--primary));
  border-radius: 4px;
}

.admin-notes-manager.fullscreen .notes-grid::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--primary)/80);
}
</style>
