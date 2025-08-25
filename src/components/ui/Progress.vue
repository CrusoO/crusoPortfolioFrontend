<template>
  <div :class="cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', props.class)">
    <div
      class="h-full w-full flex-1 bg-primary transition-all duration-1000 ease-out"
      :style="{ transform: `translateX(-${100 - (value || 0)}%)` }"
    />
  </div>
</template>

<script setup lang="ts">
/*
  Animated progress bar component for showcasing skills and project completion
  Includes smooth animation transitions for better visual appeal
*/

import { cn } from '@/lib/utils'

interface Props {
  value?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  class: '',
})
</script>




