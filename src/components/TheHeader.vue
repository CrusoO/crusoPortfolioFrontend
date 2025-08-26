<template>
  <header class="header" :class="{ 'header--scrolled': isScrolled }">
    <div class="header-container">
      <div class="header-logo">
        <!-- Chatbot will be positioned here -->
      </div>

      <!-- Navigation removed - using ModernNavbar component instead -->

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
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: transparent;
  backdrop-filter: none;
  border: none;
  box-shadow: none;
  transition: all 0.3s ease;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem 3rem 1rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: transparent;
}

.header-logo {
  flex: 1;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
  padding-right: 1rem;
}

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

/* Mobile menu styles */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 998;
  padding-top: 5rem;
}

.mobile-nav {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 1rem;
  margin: 1rem;
  padding: 2rem;
  max-width: 400px;
  margin: 1rem auto;
}

.mobile-nav-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: none;
  background: transparent;
  color: #374151;
  font-weight: 500;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  margin-bottom: 0.5rem;
}

.mobile-nav-link:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: translateX(4px);
}

.mobile-nav-footer {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

/* Mobile menu transitions */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.mobile-menu-enter-to,
.mobile-menu-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Header visible - navigation replaced by ModernNavbar */
</style>