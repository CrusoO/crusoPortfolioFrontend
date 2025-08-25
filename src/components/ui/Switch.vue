<template>
  <button
    :class="cn('switch', { 'switch--checked': checked })"
    :aria-checked="checked"
    role="switch"
    @click="toggle"
    :disabled="disabled"
  >
    <span class="switch-thumb" />
  </button>
</template>

<script setup lang="ts">
/*
  Modern Switch component with smooth animations
  Perfect for toggles and settings
*/

import { cn } from '@/lib/utils'

interface Props {
  checked: boolean
  disabled?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  change: [checked: boolean]
}>()

function toggle() {
  if (!props.disabled) {
    emit('change', !props.checked)
  }
}
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  
  width: 2.75rem;
  height: 1.5rem;
  
  background: hsl(var(--input));
  border: 1px solid hsl(var(--border));
  border-radius: 9999px;
  
  cursor: pointer;
  transition: all 0.2s ease;
  
  outline: none;
}

.switch:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

.switch:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.switch--checked {
  background: hsl(var(--primary));
  border-color: hsl(var(--primary));
}

.switch-thumb {
  position: absolute;
  left: 2px;
  top: 2px;
  
  width: calc(1.5rem - 4px);
  height: calc(1.5rem - 4px);
  
  background: hsl(var(--background));
  border-radius: 9999px;
  box-shadow: 0 2px 6px hsl(var(--foreground) / 0.25);
  
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(0);
}

.switch--checked .switch-thumb {
  transform: translateX(1.19rem);
}
</style>


