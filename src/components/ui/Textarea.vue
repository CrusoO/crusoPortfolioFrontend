<template>
  <textarea
    :class="cn(
      'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      props.class
    )"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
/*
  Modern textarea component with consistent styling and focus states
  Perfect for contact forms and longer text inputs
*/

import { cn } from '@/lib/utils'

interface Props {
  class?: string
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  modelValue: '',
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>


