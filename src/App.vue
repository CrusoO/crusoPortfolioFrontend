<!--
  Main application component orchestrating the portfolio layout
  Combines all sections into a cohesive single-page application
-->

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import TheHeader from '@/components/TheHeader.vue'
import ModernNavbar from '@/components/ModernNavbar.vue'
import ProjectsSection from '@/components/ProjectsSection.vue'
import SkillsSection from '@/components/SkillsSection.vue'
import ContactSection from '@/components/ContactSection.vue'
import TheFooter from '@/components/TheFooter.vue'

// Lazy load heavy components for better performance
const PaintCanvas = defineAsyncComponent(() => import('@/components/PaintCanvas.vue'))
const ChatBot = defineAsyncComponent(() => import('@/components/ChatBot.vue'))

</script>

<template>
  <div id="app" class="min-h-screen" role="application" aria-label="Cruso Portfolio">
    <!-- Skip to main content for accessibility -->
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50">
      Skip to main content
    </a>
    
    <!-- Header with navigation utilities -->
    <TheHeader />
    
    <!-- Primary Navigation -->
    <ModernNavbar role="navigation" aria-label="Main navigation" />

    <!-- Main Content Area -->
    <main id="main-content" role="main" tabindex="-1">
      <!-- Hero Section with Interactive Paint Canvas -->
      <section id="paint-canvas" aria-label="Interactive Paint Canvas" role="region">
        <PaintCanvas />
      </section>
      
      <!-- Featured Projects Section -->
      <ProjectsSection />
      
      <!-- Skills and Articles Section -->  
      <SkillsSection />
      
      <!-- Contact Information Section -->
      <ContactSection />
      

    </main>

    <!-- Site Footer -->
    <TheFooter />
    
    <!-- AI Assistant Chat Interface -->
    <ChatBot role="complementary" aria-label="AI Assistant" />
  </div>
</template>

<style>
/* App-level styles optimized for performance and accessibility */
#app {
  scroll-behavior: smooth;
  isolation: isolate; /* Create stacking context for better rendering */
  color: rgb(255, 252, 225); /* Global cream text color */
}

/* Skip to content link - accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only.focus:not-sr-only {
  position: static;
  width: auto;
  height: auto;
  padding: revert;
  margin: revert;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

/* Main content area optimization */
main {
  padding-top: 0;
  position: relative;
  contain: layout; /* Optimize rendering performance */
}

/* Ensure sections have proper spacing from fixed navbar */
#paint-canvas,
#projects,
#skills,
#contact {
  scroll-margin-top: 5rem;
}

/* Performance optimizations */
* {
  box-sizing: border-box;
}

/* Reduce layout shifts */
img, video, iframe {
  max-width: 100%;
  height: auto;
}

/* Optimize scrolling performance */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Focus management for better accessibility */
main:focus {
  outline: none;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  * {
    border-width: 2px;
  }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  #app {
    scroll-behavior: auto;
  }
  
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>
