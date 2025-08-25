<template>
  <header class="header" :class="{ 'header--scrolled': isScrolled }">
    <div class="header-container">
      <div class="header-logo">
        <!-- Chatbot will be positioned here -->
      </div>

      <nav class="nav-desktop">
        <Tooltip
          v-for="item in navItems"
          :key="item.href"
          :content="`Navigate to ${item.label} section`"
          placement="bottom"
        >
          <button
            @click="scrollToSection(item.href)"
            class="nav-link"
          >
            {{ item.label }}
            <span class="nav-underline"></span>
          </button>
        </Tooltip>
      </nav>

      <div class="header-actions">
        <!-- Review Display -->
        <div v-if="reviewStats.count > 0" class="review-display">
          <Tooltip :content="`${reviewStats.count} review${reviewStats.count > 1 ? 's' : ''} received`" placement="bottom">
            <div class="review-badge">
              <Star class="review-star" />
              <span class="review-count">{{ reviewStats.count }}</span>
            </div>
          </Tooltip>
        </div>

        <Tooltip content="Toggle theme (⌘+D)" placement="bottom">
          <Switch
            :checked="isDark"
            @change="toggleTheme"
            class="theme-switch"
          />
        </Tooltip>

        <Tooltip content="Open command palette (⌘+K)" placement="bottom">
          <Button 
            @click="toggleCommand" 
            variant="ghost" 
            size="icon" 
            class="command-btn"
          >
            <Command class="h-4 w-4" />
          </Button>
        </Tooltip>

        <Button 
          @click="scrollToSection('contact')" 
          size="sm" 
          class="contact-btn"
        >
          <Mail class="h-4 w-4 mr-2" />
          Contact
        </Button>

        <Button 
          @click="toggleMobileMenu" 
          variant="ghost" 
          size="icon" 
          class="mobile-toggle"
          :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
        >
          <Menu v-if="!isMobileMenuOpen" class="h-5 w-5" />
          <X v-else class="h-5 w-5" style="transform: rotate(90deg);" />
        </Button>
      </div>
    </div>

    <!-- Modern Mobile Menu -->
    <Transition
      enter-active-class="mobile-menu-enter-active"
      enter-from-class="mobile-menu-enter-from"
      enter-to-class="mobile-menu-enter-to"
      leave-active-class="mobile-menu-leave-active"
      leave-from-class="mobile-menu-leave-from"
      leave-to-class="mobile-menu-leave-to"
    >
      <div v-if="isMobileMenuOpen" class="mobile-menu">
        <nav class="mobile-nav">
          <div class="mobile-nav-header">
            <h3 class="text-sm font-semibold">Navigation</h3>
          </div>
          
          <button
            v-for="(item, index) in navItems"
            :key="item.href"
            @click="scrollToSection(item.href); toggleMobileMenu()"
            class="mobile-nav-link flex items-center gap-3"
            :style="`animation-delay: ${index * 0.1}s`"
          >
            <component :is="item.icon" class="h-4 w-4" />
            {{ item.label }}
          </button>
          
          <div class="mobile-nav-footer space-y-3">
            <Button 
              @click="scrollToSection('contact'); toggleMobileMenu()" 
              class="w-full rounded"
            >
              <Mail class="h-4 w-4 mr-2" />
              Get in Touch
            </Button>
            
            <div class="flex items-center justify-between p-3 bg-secondary rounded">
              <span class="text-sm">Theme</span>
              <Switch :checked="isDark" @change="toggleTheme" />
            </div>
          </div>
        </nav>
      </div>
    </Transition>

    <!-- Command Palette -->
    <CommandPalette :isOpen="isCommandOpen" @close="closeCommand" @toggle="toggleCommand" />
  </header>
</template>

<script setup lang="ts">
/*
  Modern Header component with interactive shadcn/ui components
  Features command palette, tooltips, and theme switching
*/

import { ref, onMounted, onUnmounted } from 'vue'
import { Sun, Moon, Menu, X, Mail, Command, User, Briefcase, Code, Star } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Switch from '@/components/ui/Switch.vue'
import Tooltip from '@/components/ui/Tooltip.vue'
import CommandPalette from '@/components/ui/Command.vue'
import { scrollToSection } from '@/lib/utils'

const isDark = ref(false)
const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)
const isCommandOpen = ref(false)
const reviewStats = ref({ count: 0 })

const navItems = [
  { label: 'About', href: 'hero', icon: User },
  { label: 'Projects', href: 'projects', icon: Briefcase },
  { label: 'Articles', href: 'skills', icon: Code },
  { label: 'Contact', href: 'contact', icon: Mail },
]

function toggleTheme(checked: boolean) {
  isDark.value = checked
  document.documentElement.classList.toggle('dark', checked)
  localStorage.setItem('theme', checked ? 'dark' : 'light')
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function toggleCommand() {
  isCommandOpen.value = !isCommandOpen.value
}

function closeCommand() {
  isCommandOpen.value = false
}

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

function handleGlobalKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault()
    toggleCommand()
  }
  if ((event.metaKey || event.ctrlKey) && event.key === 'd') {
    event.preventDefault()
    toggleTheme(!isDark.value)
  }
}

function updateReviewStats() {
  const stats = JSON.parse(localStorage.getItem('portfolioReviewStats') || '{"count": 0}')
  reviewStats.value = stats
}

function handleReviewsUpdate(event: CustomEvent) {
  reviewStats.value = event.detail
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (
    savedTheme === 'dark' ||
    (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
  
  // Load initial review stats
  updateReviewStats()
  
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('keydown', handleGlobalKeydown)
  window.addEventListener('reviewsUpdated', handleReviewsUpdate as EventListener)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('keydown', handleGlobalKeydown)
  window.removeEventListener('reviewsUpdated', handleReviewsUpdate as EventListener)
})
</script>

<style scoped>
.review-display {
  display: flex;
  align-items: center;
}

.review-badge {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 1rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: hsl(var(--foreground));
  transition: all 0.2s ease;
}

.review-badge:hover {
  background: hsl(var(--muted));
  transform: translateY(-1px);
  box-shadow: 0 2px 8px hsl(var(--foreground)/10);
}

.review-star {
  width: 1rem;
  height: 1rem;
  color: #fbbf24;
  fill: #fbbf24;
}

.review-count {
  font-weight: 600;
  color: hsl(var(--foreground));
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .review-display {
    display: none; /* Hide on mobile to save space */
  }
}
</style>