<template>
  <div class="star-rating">
    <div class="stars">
      <button
        v-for="star in 5"
        :key="star"
        type="button"
        @click="setRating(star)"
        @mouseover="hoverRating = star"
        @mouseleave="hoverRating = 0"
        class="star-button"
        :class="{ 
          'star-filled': star <= (hoverRating || rating),
          'star-hover': star <= hoverRating
        }"
        :aria-label="`Rate ${star} star${star > 1 ? 's' : ''}`"
      >
        <Star 
          class="star-icon" 
          :class="{ 
            'filled': star <= (hoverRating || rating),
            'hover': star <= hoverRating
          }"
        />
      </button>
    </div>
    <span v-if="showLabel" class="rating-label">
      {{ ratingLabels[rating] || 'Select rating' }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { Star } from 'lucide-vue-next'

interface Props {
  modelValue?: number
  showLabel?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  showLabel: true,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const rating = ref(props.modelValue)
const hoverRating = ref(0)

const ratingLabels: Record<number, string> = {
  1: 'Poor',
  2: 'Fair', 
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
}

function setRating(newRating: number) {
  if (props.disabled) return
  
  rating.value = newRating
  emit('update:modelValue', newRating)
}
</script>

<style scoped>
.star-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  display: flex;
  gap: 0.25rem;
}

.star-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.star-button:hover {
  background: hsl(var(--muted));
}

.star-button:disabled {
  cursor: not-allowed;
}

.star-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: hsl(var(--muted-foreground));
  transition: all 0.2s ease;
}

.star-icon.filled {
  color: #fbbf24;
  fill: #fbbf24;
}

.star-icon.hover {
  transform: scale(1.1);
}

.rating-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: hsl(var(--foreground));
  min-height: 1.25rem;
}
</style>





