<template>
  <div class="tabs-root">
    <div class="tabs-list" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :class="cn('tabs-trigger', { 'tabs-trigger--active': activeTab === tab.value })"
        @click="setActiveTab(tab.value)"
        role="tab"
        :aria-selected="activeTab === tab.value"
        :tabindex="activeTab === tab.value ? 0 : -1"
      >
        <component v-if="tab.icon" :is="tab.icon" class="h-4 w-4 mr-2" />
        {{ tab.label }}
      </button>
    </div>
    
    <div class="tabs-content">
      <slot :activeTab="activeTab" />
    </div>
  </div>
</template>

<script setup lang="ts">
/*
  Modern Tabs component with smooth animations
  Perfect for organizing content sections
*/

import { ref, watch } from 'vue'
import { cn } from '@/lib/utils'

interface Tab {
  value: string
  label: string
  icon?: any
}

interface Props {
  tabs: Tab[]
  defaultValue?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  change: [value: string]
}>()

const activeTab = ref(props.defaultValue || props.tabs[0]?.value || '')

function setActiveTab(value: string) {
  activeTab.value = value
  emit('change', value)
}

watch(() => props.defaultValue, (newValue) => {
  if (newValue) {
    activeTab.value = newValue
  }
})
</script>

<style scoped>
.tabs-root {
  width: 100%;
}

.tabs-list {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  background: hsl(var(--muted));
  border-radius: calc(var(--radius) + 2px);
  position: relative;
  overflow: hidden;
}

.tabs-trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  
  background: transparent;
  color: hsl(var(--muted-foreground));
  border: none;
  border-radius: var(--radius);
  
  cursor: pointer;
  transition: all 0.2s ease;
  
  z-index: 2;
}

.tabs-trigger:hover {
  color: hsl(var(--foreground));
}

.tabs-trigger--active {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  box-shadow: 0 2px 8px hsl(var(--foreground) / 0.1);
}

.tabs-trigger:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

.tabs-content {
  margin-top: 1rem;
}
</style>







