<template>
  <div class="tooltip-root">
    <div 
      class="tooltip-trigger"
      @mouseenter="handleMouseEnter"
      @mouseleave="hide"
      @focus="handleFocus"
      @blur="hide"
    >
      <slot />
    </div>
    
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isVisible"
          ref="tooltipRef"
          class="tooltip-content"
          :style="tooltipStyle"
        >
          {{ content }}
          <div class="tooltip-arrow" :class="`tooltip-arrow--${placement}`"></div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/*
  Professional Tooltip component with smart positioning
  Provides contextual information on hover
*/

import { ref, computed, nextTick } from 'vue'

interface Props {
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'top',
  delay: 300
})

const isVisible = ref(false)
const tooltipRef = ref<HTMLElement>()
const triggerRect = ref<DOMRect>()

let timeoutId: ReturnType<typeof setTimeout> | null = null

const tooltipStyle = computed(() => {
  if (!triggerRect.value) return {}
  
  const rect = triggerRect.value
  const style: Record<string, string> = {
    position: 'fixed',
    zIndex: '100'
  }
  
  switch (props.placement) {
    case 'top':
      style.left = `${rect.left + rect.width / 2}px`
      style.bottom = `${window.innerHeight - rect.top + 8}px`
      style.transform = 'translateX(-50%)'
      break
    case 'bottom':
      style.left = `${rect.left + rect.width / 2}px`
      style.top = `${rect.bottom + 8}px`
      style.transform = 'translateX(-50%)'
      break
    case 'left':
      style.right = `${window.innerWidth - rect.left + 8}px`
      style.top = `${rect.top + rect.height / 2}px`
      style.transform = 'translateY(-50%)'
      break
    case 'right':
      style.left = `${rect.right + 8}px`
      style.top = `${rect.top + rect.height / 2}px`
      style.transform = 'translateY(-50%)'
      break
  }
  
  return style
})

function show(event: MouseEvent | FocusEvent): void {
  if (timeoutId) clearTimeout(timeoutId)
  
  const target = event.currentTarget as HTMLElement
  triggerRect.value = target.getBoundingClientRect()
  
  timeoutId = setTimeout(async () => {
    isVisible.value = true
    await nextTick()
  }, props.delay)
}

function handleMouseEnter(event: MouseEvent): void {
  show(event)
}

function handleFocus(event: FocusEvent): void {
  show(event)
}

function hide() {
  if (timeoutId) clearTimeout(timeoutId)
  isVisible.value = false
}
</script>

<style scoped>
.tooltip-root {
  position: relative;
  display: inline-block;
}

.tooltip-trigger {
  display: inline-block;
}

.tooltip-content {
  position: fixed;
  z-index: 100;
  
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  
  background: hsl(var(--foreground));
  color: hsl(var(--background));
  border-radius: calc(var(--radius) - 2px);
  box-shadow: 0 4px 20px hsl(var(--foreground) / 0.2);
  
  max-width: 200px;
  text-align: center;
  word-wrap: break-word;
}

.tooltip-arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: hsl(var(--foreground));
  transform: rotate(45deg);
}

.tooltip-arrow--top {
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
}

.tooltip-arrow--bottom {
  top: -4px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
}

.tooltip-arrow--left {
  right: -4px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
}

.tooltip-arrow--right {
  left: -4px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
}
</style>




