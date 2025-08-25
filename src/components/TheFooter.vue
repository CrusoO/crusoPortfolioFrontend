<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-brand">
          <h2 class="footer-logo">
            <span class="logo-highlight">C</span>ruso
          </h2>
          
          <p class="footer-description">
            Passionate about creating exceptional digital experiences through clean code and thoughtful design.
          </p>
        </div>

        <div class="footer-social">
          <a 
            v-for="social in socialLinks" 
            :key="social.name"
            :href="social.url"
            :aria-label="social.name"
            class="footer-social-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <component :is="social.icon" class="h-5 w-5" />
          </a>
        </div>

        <div class="footer-bottom">
          <p class="footer-copyright">
            © {{ new Date().getFullYear() }} Cruso. Built with Vue 3, TypeScript & shadcn/ui.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
/*
  Clean footer component with branding and social links
  Uses semantic CSS classes for maintainable styling
*/

import { Github, Linkedin, Twitter, Mail } from 'lucide-vue-next'

const socialLinks = [
  { name: 'GitHub', icon: Github, url: 'https://github.com' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com' },
  { name: 'Twitter', icon: Twitter, url: 'https://twitter.com' },
  { name: 'Email', icon: Mail, url: 'mailto:contact@cruso.dev' },
]
</script>