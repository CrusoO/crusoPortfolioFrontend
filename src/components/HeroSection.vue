<template>
  <section id="hero" class="hero">
    <div class="hero-background">
      <div class="hero-gradient"></div>
      <div class="hero-orb-1"></div>
      <div class="hero-orb-2"></div>
    </div>

    <div class="hero-content">
      <div class="hero-badge">
        <span class="hero-status"></span>
        Hi, I'm Robinson
      </div>
      
      <h1 class="hero-title">
        <span class="hero-name">Full-Stack Developer</span> & Creative Problem Solver
      </h1>
      
      <p class="hero-description">
        I craft digital experiences that combine beautiful design with robust functionality. 
        Passionate about creating solutions that make a real difference in people's lives.
      </p>

      <div class="hero-actions">
        <Button @click="scrollToSection('projects')" size="lg">
          View My Work
          <ArrowRight class="h-4 w-4 ml-2" />
        </Button>
        
        <Button @click="scrollToSection('contact')" variant="outline" size="lg">
          <Mail class="h-4 w-4 mr-2" />
          Get in Touch
        </Button>
      </div>



      <div class="scroll-indicator">
        <ChevronDown class="h-6 w-6" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/*
  Hero section component showcasing personal introduction
  Features animated entrance and call-to-action buttons
*/

import { ref } from 'vue'
import { Mail, ArrowRight, ChevronDown } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import PaintCanvas from '@/components/PaintCanvas.vue'
import { scrollToSection } from '@/lib/utils'

interface Props {
  username?: string
}

const props = defineProps<Props>()
const showPaintCanvas = ref(true)


</script>
