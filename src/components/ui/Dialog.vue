<template>
  <Teleport to="body">
    <Transition
      enter-active-class="dialog-overlay-enter-active"
      enter-from-class="dialog-overlay-enter-from"
      enter-to-class="dialog-overlay-enter-to"
      leave-active-class="dialog-overlay-leave-active"
      leave-from-class="dialog-overlay-leave-from"
      leave-to-class="dialog-overlay-leave-to"
    >
      <div
        v-if="isOpen"
        class="dialog-overlay"
        @click="handleOverlayClick"
      >
        <Transition
          enter-active-class="dialog-content-enter-active"
          enter-from-class="dialog-content-enter-from"
          enter-to-class="dialog-content-enter-to"
          leave-active-class="dialog-content-leave-active"
          leave-from-class="dialog-content-leave-from"
          leave-to-class="dialog-content-leave-to"
        >
          <div
            v-if="isOpen"
            class="dialog-content"
            :class="cn('dialog-content', contentClass)"
            @click.stop
          >
            <div v-if="showHeader" class="dialog-header">
              <h2 v-if="title" class="dialog-title">{{ title }}</h2>
              <p v-if="description" class="dialog-description">{{ description }}</p>
              <button
                v-if="showClose"
                class="dialog-close"
                @click="close"
                aria-label="Close dialog"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
            
            <div class="dialog-body">
              <slot />
            </div>
            
            <div v-if="$slots.footer" class="dialog-footer">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/*
  Modern Dialog component with smooth animations
  Perfect for modals, confirmations, and detailed views
*/

import { onMounted, onUnmounted, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  isOpen: boolean
  title?: string
  description?: string
  showHeader?: boolean
  showClose?: boolean
  closeOnOverlay?: boolean
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  showHeader: true,
  showClose: true,
  closeOnOverlay: true
})

const emit = defineEmits<{
  close: []
  open: []
}>()

function close() {
  emit('close')
}

function handleOverlayClick() {
  if (props.closeOnOverlay) {
    close()
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.isOpen) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    emit('open')
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: hsl(var(--background) / 0.8);
  backdrop-filter: blur(4px);
  
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.dialog-content {
  position: relative;
  width: 100%;
  max-width: 32rem;
  max-height: 85vh;
  overflow-y: auto;
  
  background: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius) + 4px);
  box-shadow: 0 25px 50px hsl(var(--foreground) / 0.15);
}

.dialog-header {
  position: relative;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid hsl(var(--border));
}

.dialog-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin: 0;
}

.dialog-description {
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
  margin: 0.5rem 0 0 0;
  line-height: 1.5;
}

.dialog-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-radius: var(--radius);
  color: hsl(var(--muted-foreground));
  
  cursor: pointer;
  transition: all 0.2s ease;
}

.dialog-close:hover {
  background: hsl(var(--accent));
  color: hsl(var(--foreground));
}

.dialog-body {
  padding: 1.5rem;
}

.dialog-footer {
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid hsl(var(--border));
  
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

/* Animations */
.dialog-overlay-enter-active {
  transition: opacity 0.2s ease-out;
}

.dialog-overlay-leave-active {
  transition: opacity 0.15s ease-in;
}

.dialog-overlay-enter-from,
.dialog-overlay-leave-to {
  opacity: 0;
}

.dialog-overlay-enter-to,
.dialog-overlay-leave-from {
  opacity: 1;
}

.dialog-content-enter-active {
  transition: all 0.2s ease-out;
}

.dialog-content-leave-active {
  transition: all 0.15s ease-in;
}

.dialog-content-enter-from,
.dialog-content-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(-1rem);
}

.dialog-content-enter-to,
.dialog-content-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}
</style>







