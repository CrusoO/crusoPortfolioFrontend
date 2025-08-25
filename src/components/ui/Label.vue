<template>
  <label
    :class="cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      props.class
    )"
    v-bind="$attrs"
  >
    <slot />
  </label>
</template>

<script setup lang="ts">
/*
  Accessible label component for form inputs
  Provides consistent typography and styling across forms
*/

import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
})
</script>




