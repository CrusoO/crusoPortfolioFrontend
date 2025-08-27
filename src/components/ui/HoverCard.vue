<template>
  <div class="hover-card-root">
    <div 
      class="hover-card-trigger"
      @mouseenter="showCard"
      @mouseleave="hideCard"
      @focus="showCard"
      @blur="hideCard"
    >
      <slot name="trigger" />
    </div>
    
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-2"
    >
      <div
        v-if="isVisible"
        class="hover-card-content"
        :class="cn('hover-card-content', contentClass)"
      >
        <slot name="content" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
/*
  Modern HoverCard component with smooth animations
  Perfect for showing additional information on hover
*/

import { ref } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  contentClass?: string
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  delay: 200
})

const isVisible = ref(false)
let timeoutId: number | null = null

function showCard() {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  timeoutId = setTimeout(() => {
    isVisible.value = true
  }, props.delay)
}

function hideCard() {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  timeoutId = setTimeout(() => {
    isVisible.value = false
  }, 150)
}
</script>

<style scoped>
.hover-card-root {
  position: relative;
  display: inline-block;
}

.hover-card-trigger {
  cursor: pointer;
}

.hover-card-content {
  position: absolute;
  z-index: 50;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 0.5rem;
  
  min-width: 200px;
  max-width: 320px;
  padding: 1rem;
  
  background: hsl(var(--popover));
  color: hsl(var(--popover-foreground));
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius) + 2px);
  box-shadow: 0 10px 30px hsl(var(--foreground) / 0.1);
  backdrop-filter: blur(8px);
}
</style>






