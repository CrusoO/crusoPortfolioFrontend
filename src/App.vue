<!--
  Main application component orchestrating the portfolio layout
  Combines all sections into a cohesive single-page application
-->

<script setup lang="ts">
import { ref } from 'vue'
import TheHeader from '@/components/TheHeader.vue'
import PaintCanvas from '@/components/PaintCanvas.vue'
import ProjectsSection from '@/components/ProjectsSection.vue'
import SkillsSection from '@/components/SkillsSection.vue'
import ContactSection from '@/components/ContactSection.vue'
import TheFooter from '@/components/TheFooter.vue'
import ChatBot from '@/components/ChatBot.vue'
import UsernamePrompt from '@/components/UsernamePrompt.vue'

const userEntered = ref(false)
const username = ref('')

function handleUsernameEntered(name: string) {
  username.value = name
  userEntered.value = true
}
</script>

<template>
  <div id="app" class="min-h-screen">
    <!-- Username Prompt (shows first) -->
    <UsernamePrompt 
      v-if="!userEntered"
      @username-entered="handleUsernameEntered"
    />
    
    <!-- Main Portfolio (shows after username entered) -->
    <template v-if="userEntered">
      <TheHeader />

      <main>
        <PaintCanvas :username="username" />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>

      <TheFooter />
      
      <!-- Interactive Chatbot -->
      <ChatBot :username="username" />
    </template>
  </div>
</template>
