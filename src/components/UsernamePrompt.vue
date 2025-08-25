<template>
  <div class="username-overlay">
    <div class="username-card">
      <input 
        v-model="username"
        type="text"
        placeholder="Enter your name..."
        class="username-input"
        @keyup.enter="handleSubmit"
        autofocus
      />
      <div class="username-actions">
        <button @click="handleSubmit" class="submit-btn">
          Enter
        </button>
        <button @click="goAnonymous" class="anonymous-btn">
          Go Anonymous
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'

const emit = defineEmits<{
  'username-entered': [name: string]
}>()

const username = ref('')

function handleSubmit() {
  const name = username.value.trim() || 'Anonymous'
  emit('username-entered', name)
}

function goAnonymous() {
  emit('username-entered', 'Anonymous')
}
</script>

<style scoped>
.username-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.username-card {
  background: #000000;
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 320px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
}

.username-input {
  width: 100%;
  background: #111111;
  border: 1px solid #333333;
  border-radius: 4px;
  padding: 0.75rem;
  font-size: 1rem;
  color: #ffffff;
  outline: none;
  transition: border-color 0.2s ease;
  margin-bottom: 1rem;
}

.username-input::placeholder {
  color: #666666;
}

.username-input:focus {
  border-color: #ffffff;
}

.username-actions {
  display: flex;
  gap: 0.5rem;
}

.submit-btn {
  flex: 1;
  background: #ffffff;
  color: #000000;
  border: none;
  border-radius: 4px;
  padding: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover {
  background: #f0f0f0;
  transform: translateY(-1px);
}

.anonymous-btn {
  flex: 1;
  background: transparent;
  color: #ffffff;
  border: 1px solid #333333;
  border-radius: 4px;
  padding: 0.75rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.anonymous-btn:hover {
  border-color: #ffffff;
  background: #111111;
}

@media (max-width: 480px) {
  .username-card {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .username-actions {
    flex-direction: column;
  }
}
</style>