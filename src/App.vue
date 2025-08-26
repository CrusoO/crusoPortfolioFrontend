<!--
  Main application component orchestrating the portfolio layout
  Combines all sections into a cohesive single-page application
-->

<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue'
import PaintCanvas from '@/components/PaintCanvas.vue'
import ProjectsSection from '@/components/ProjectsSection.vue'
import SkillsSection from '@/components/SkillsSection.vue'
import ContactSection from '@/components/ContactSection.vue'
import TheFooter from '@/components/TheFooter.vue'
import ChatBot from '@/components/ChatBot.vue'
</script>

<template>
  <div id="app" class="min-h-screen">
    <TheHeader />

    <main>
      <PaintCanvas />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />
    </main>

    <TheFooter />
    
    <!-- Interactive Chatbot -->
    <ChatBot />
  </div>
</template>
