<template>
  <div :class="cn('rounded-lg border bg-card text-card-foreground shadow-sm', props.class)">
    <slot />
  </div>
</template>

<script setup lang="ts">
/*
  Card component providing consistent container styling
  Used throughout the portfolio for project cards and content sections
*/

import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
})
</script>
