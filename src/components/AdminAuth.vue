<template>
  <div 
    v-if="showAdminPanel" 
    class="admin-overlay"
    @click.self="closeAdminPanel"
  >
    <div class="admin-panel">
      <!-- Admin Login -->
      <div v-if="!isAuthenticated" class="admin-login">
        <h2 class="admin-title">🔐 Admin Access</h2>
        <p class="admin-subtitle">Enter admin password to manage notes</p>
        
        <div class="login-form">
          <Input 
            v-model="adminPassword"
            type="password" 
            placeholder="Admin password"
            @keypress.enter="authenticateAdmin"
            class="admin-input"
          />
          <Button @click="authenticateAdmin" class="admin-login-btn">
            Login as Admin
          </Button>
        </div>
        
        <div v-if="loginError" class="login-error">
          {{ loginError }}
        </div>
      </div>
      
      <!-- Admin Dashboard -->
      <div v-else class="admin-dashboard">
        <div class="admin-header">
          <h2 class="admin-title">👨‍💼 Admin Dashboard</h2>
          <div class="admin-actions">
            <Button @click="showAddNoteForm = true" variant="default">
              <Plus class="h-4 w-4 mr-2" />
              Add Note
            </Button>
            <Button @click="logout" variant="outline">
              <LogOut class="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
        
        <AdminNotesManager 
          v-if="isAuthenticated"
          :show-add-form="showAddNoteForm"
          @close-add-form="showAddNoteForm = false"
          @notes-updated="$emit('notesUpdated')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { Plus, LogOut } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import AdminNotesManager from './AdminNotesManager.vue'

interface Props {
  showAdminPanel: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  closeAdminPanel: []
  notesUpdated: []
}>()

const adminPassword = ref('')
const isAuthenticated = ref(false)
const loginError = ref('')
const showAddNoteForm = ref(false)

// Admin authentication (simple password-based)
const ADMIN_PASSWORD = 'admin123' // In production, this should be more secure

function authenticateAdmin() {
  if (adminPassword.value === ADMIN_PASSWORD) {
    isAuthenticated.value = true
    loginError.value = ''
    localStorage.setItem('portfolioAdminAuth', 'true')
  } else {
    loginError.value = 'Invalid admin password'
    setTimeout(() => {
      loginError.value = ''
    }, 3000)
  }
  adminPassword.value = ''
}

function logout() {
  isAuthenticated.value = false
  localStorage.removeItem('portfolioAdminAuth')
  showAddNoteForm.value = false
}

function closeAdminPanel() {
  emit('closeAdminPanel')
}

// Check for existing auth on mount
if (localStorage.getItem('portfolioAdminAuth') === 'true') {
  isAuthenticated.value = true
}
</script>

<style scoped>
.admin-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.admin-panel {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 12px;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

.admin-login {
  padding: 2rem;
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}

.admin-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin-bottom: 0.5rem;
}

.admin-subtitle {
  color: hsl(var(--muted-foreground));
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-input {
  padding: 0.75rem;
  font-size: 1rem;
}

.admin-login-btn {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
}

.login-error {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 1rem;
  padding: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 6px;
}

.admin-dashboard {
  padding: 1.5rem;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid hsl(var(--border));
  padding-bottom: 1rem;
}

.admin-actions {
  display: flex;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .admin-panel {
    margin: 10px;
    max-height: calc(100vh - 20px);
  }
  
  .admin-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .admin-actions {
    justify-content: center;
  }
}
</style>
