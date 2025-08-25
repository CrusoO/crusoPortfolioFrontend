<template>
  <div 
    v-if="isOpen"
    class="command-overlay"
    @click="close"
  >
    <div 
      class="command-dialog"
      @click.stop
    >
      <div class="command-header">
        <Search class="command-search-icon h-4 w-4" />
        <input
          ref="inputRef"
          v-model="searchQuery"
          class="command-input"
          placeholder="Type a command or search..."
          @keydown="handleKeydown"
        />
        <kbd class="command-kbd">Esc</kbd>
      </div>
      
      <div v-if="filteredCommands.length > 0" class="command-list">
        <div
          v-for="(command, index) in filteredCommands"
          :key="command.id"
          :class="cn('command-item', { 'command-item--selected': selectedIndex === index })"
          @click="executeCommand(command)"
          @mouseenter="selectedIndex = index"
        >
          <component v-if="command.icon" :is="command.icon" class="command-item-icon h-4 w-4" />
          <div class="command-item-content">
            <div class="command-item-title">{{ command.title }}</div>
            <div v-if="command.description" class="command-item-description">
              {{ command.description }}
            </div>
          </div>
          <kbd v-if="command.shortcut" class="command-item-kbd">{{ command.shortcut }}</kbd>
        </div>
      </div>
      
      <div v-else class="command-empty">
        <FileQuestion class="h-8 w-8 mb-2 text-muted-foreground" />
        <p class="text-sm text-muted-foreground">No results found.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/*
  Modern Command Palette component
  Provides quick access to portfolio navigation and actions
*/

import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { Search, FileQuestion, User, Briefcase, Code, Mail, Sun, Moon, Github, Linkedin, Twitter } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { scrollToSection } from '@/lib/utils'

interface Command {
  id: string
  title: string
  description?: string
  icon?: any
  shortcut?: string
  action: () => void
}

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  toggle: []
}>()

const inputRef = ref<HTMLInputElement>()
const searchQuery = ref('')
const selectedIndex = ref(0)

const commands: Command[] = [
  {
    id: 'about',
    title: 'About',
    description: 'Learn more about me',
    icon: User,
    shortcut: '⌘A',
    action: () => {
      scrollToSection('hero')
      close()
    }
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'View my portfolio',
    icon: Briefcase,
    shortcut: '⌘P',
    action: () => {
      scrollToSection('projects')
      close()
    }
  },
  {
    id: 'skills',
    title: 'Skills',
    description: 'See my technical skills',
    icon: Code,
    shortcut: '⌘S',
    action: () => {
      scrollToSection('skills')
      close()
    }
  },
  {
    id: 'contact',
    title: 'Contact',
    description: 'Get in touch with me',
    icon: Mail,
    shortcut: '⌘C',
    action: () => {
      scrollToSection('contact')
      close()
    }
  },
  {
    id: 'theme-light',
    title: 'Light Theme',
    description: 'Switch to light mode',
    icon: Sun,
    action: () => {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      close()
    }
  },
  {
    id: 'theme-dark',
    title: 'Dark Theme', 
    description: 'Switch to dark mode',
    icon: Moon,
    action: () => {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      close()
    }
  },
  {
    id: 'github',
    title: 'GitHub',
    description: 'View my GitHub profile',
    icon: Github,
    action: () => {
      window.open('https://github.com', '_blank')
      close()
    }
  },
  {
    id: 'linkedin',
    title: 'LinkedIn',
    description: 'Connect on LinkedIn',
    icon: Linkedin,
    action: () => {
      window.open('https://linkedin.com', '_blank')
      close()
    }
  },
  {
    id: 'twitter',
    title: 'Twitter',
    description: 'Follow me on Twitter',
    icon: Twitter,
    action: () => {
      window.open('https://twitter.com', '_blank')
      close()
    }
  }
]

const filteredCommands = computed(() => {
  if (!searchQuery.value) return commands
  
  const query = searchQuery.value.toLowerCase()
  return commands.filter(command => 
    command.title.toLowerCase().includes(query) ||
    command.description?.toLowerCase().includes(query)
  )
})

function close() {
  emit('close')
  searchQuery.value = ''
  selectedIndex.value = 0
}

function executeCommand(command: Command) {
  command.action()
}

function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'Escape':
      close()
      break
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = (selectedIndex.value + 1) % filteredCommands.value.length
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = selectedIndex.value === 0 
        ? filteredCommands.value.length - 1 
        : selectedIndex.value - 1
      break
    case 'Enter':
      event.preventDefault()
      if (filteredCommands.value[selectedIndex.value]) {
        executeCommand(filteredCommands.value[selectedIndex.value])
      }
      break
  }
}

function handleGlobalKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault()
    emit('toggle')
  }
}

onMounted(async () => {
  document.addEventListener('keydown', handleGlobalKeydown)
  
  if (props.isOpen) {
    await nextTick()
    inputRef.value?.focus()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
})

// Focus input when dialog opens
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    inputRef.value?.focus()
  }
}, { immediate: true })
</script>

<style scoped>
.command-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: hsl(var(--background) / 0.8);
  backdrop-filter: blur(4px);
  
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
}

.command-dialog {
  width: 100%;
  max-width: 640px;
  margin: 0 1rem;
  
  background: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius) + 4px);
  box-shadow: 0 25px 50px hsl(var(--foreground) / 0.15);
  
  animation: commandEnter 0.2s ease-out;
}

.command-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid hsl(var(--border));
}

.command-search-icon {
  color: hsl(var(--muted-foreground));
  flex-shrink: 0;
}

.command-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1rem;
  color: hsl(var(--foreground));
}

.command-input::placeholder {
  color: hsl(var(--muted-foreground));
}

.command-kbd {
  padding: 0.25rem 0.5rem;
  background: hsl(var(--muted));
  color: hsl(var(--muted-foreground));
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-family: ui-monospace, monospace;
}

.command-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 0.5rem;
}

.command-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
  cursor: pointer;
  transition: background-color 0.1s ease;
}

.command-item:hover,
.command-item--selected {
  background: hsl(var(--accent));
}

.command-item-icon {
  color: hsl(var(--muted-foreground));
  flex-shrink: 0;
}

.command-item-content {
  flex: 1;
  min-width: 0;
}

.command-item-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: hsl(var(--foreground));
}

.command-item-description {
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
  margin-top: 0.125rem;
}

.command-item-kbd {
  padding: 0.125rem 0.375rem;
  background: hsl(var(--muted));
  color: hsl(var(--muted-foreground));
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-family: ui-monospace, monospace;
}

.command-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
}

@keyframes commandEnter {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(-1rem);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
