<template>
  <nav class="modern-navbar">
    <!-- Desktop Navigation (hidden on mobile) -->
    <div class="navbar-container desktop-nav">
      <div class="navbar-pill">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="navigateTo(item.id)"
          :class="[
            'nav-item',
            { 'nav-item-active': activeSection === item.id }
          ]"
          :aria-label="`Navigate to ${item.label}`"
        >
          <span class="nav-label">{{ item.label }}</span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Button (only visible on small devices) -->
    <div class="mobile-menu-container">
      <button
        @click="toggleMobileMenu"
        class="mobile-menu-button"
        :class="{ 'menu-open': isMobileMenuOpen }"
        aria-label="Toggle navigation menu"
        :aria-expanded="isMobileMenuOpen"
      >
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>

    <!-- Mobile Drawer Navigation -->
    <div 
      class="mobile-drawer"
      :class="{ 'drawer-open': isMobileMenuOpen }"
    >
      <div class="mobile-drawer-overlay" @click="closeMobileMenu"></div>
      <div class="mobile-drawer-content">
        <div class="mobile-drawer-header">
          <h3 class="drawer-title">Navigation</h3>
          <button 
            @click="closeMobileMenu"
            class="close-drawer-button"
            aria-label="Close navigation menu"
          >
            <span class="close-icon">×</span>
          </button>
        </div>
        <nav class="mobile-nav-items">
          <button
            v-for="item in navItems"
            :key="item.id"
            @click="navigateToMobile(item.id)"
            :class="[
              'mobile-nav-item',
              { 'mobile-nav-item-active': activeSection === item.id }
            ]"
            :aria-label="`Navigate to ${item.label}`"
          >
            <span class="mobile-nav-label">{{ item.label }}</span>
            <span class="nav-arrow">→</span>
          </button>
        </nav>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
// Icons removed - using text-only navigation

interface NavItem {
  id: string
  label: string
  sectionId: string
  scrollOffset: number  // Custom scroll offset in pixels
}

const navItems: NavItem[] = [
  {
    id: 'about',
    label: 'About',
    sectionId: 'paint-canvas',
    scrollOffset: -30  // Custom scroll offset for About section
  },
  {
    id: 'projects',
    label: 'Projects',
    sectionId: 'projects',
    scrollOffset: 20  // Custom scroll offset for Projects section
  },
  {
    id: 'articles',
    label: 'Articles',
    sectionId: 'skills',
    scrollOffset: -230   // Custom scroll offset for Articles section
  },
  {
    id: 'contact',
    label: 'Contact',
    sectionId: 'contact',
    scrollOffset: -5  // Custom scroll offset for Contact section
  }
]

const activeSection = ref('about')
const isMobileMenuOpen = ref(false)

function navigateTo(sectionId: string) {
  const navItem = navItems.find(item => item.id === sectionId)
  if (navItem) {
    const element = document.getElementById(navItem.sectionId)
    if (element) {
      // Use individual scroll offset for each nav item
      const elementPosition = element.offsetTop - navItem.scrollOffset
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }
}

function navigateToMobile(sectionId: string) {
  navigateTo(sectionId)
  closeMobileMenu()
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  
  // Prevent body scrolling when menu is open
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

// Close menu on escape key
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

function updateActiveSection() {
  const sections = navItems.map(item => ({
    id: item.id,
    element: document.getElementById(item.sectionId)
  })).filter(section => section.element)

  const scrollPosition = window.scrollY + 150 // Adjusted offset for better section detection

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i]
    if (section.element && section.element.offsetTop <= scrollPosition) {
      activeSection.value = section.id
      break
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateActiveSection)
  document.addEventListener('keydown', handleKeyDown)
  updateActiveSection()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveSection)
  document.removeEventListener('keydown', handleKeyDown)
  // Clean up any overflow style
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Base Navigation Container */
.modern-navbar {
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
  pointer-events: none;
}

/* Desktop Navigation */
.desktop-nav {
  pointer-events: auto;
}

.navbar-pill {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(24px) saturate(1.2);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50px;
  padding: 0.375rem;
  gap: 0.125rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar-pill:hover {
  background: rgba(0, 0, 0, 0.85);
  border-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(28px) saturate(1.3);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.125rem;
  border: none;
  background: transparent;
  color: #6d6b5e;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  white-space: nowrap;
  min-width: fit-content;
}

.nav-item:hover {
  color: #67655a;
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-1px);
}

.nav-item-active {
  color: #efdfb7;
  background: transparent;
  border: none;
  box-shadow: none;
  text-shadow: 0 0 8px rgba(239, 223, 183, 0.6);
}

.nav-item-active:hover {
  background: transparent;
  color: #efdfb7;
  text-shadow: 0 0 12px rgba(239, 223, 183, 0.9);
  transform: translateY(-1px);
}

.nav-label {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: 0.01em;
  transition: all 0.2s ease;
}

/* Mobile Menu Container */
.mobile-menu-container {
  display: none;
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1002;
  pointer-events: auto;
}



/* Ensure mobile drawer is hidden on larger screens */
@media (min-width: 481px) {
  .mobile-menu-container,
  .mobile-drawer {
    display: none !important;
    visibility: hidden !important;
  }
}

/* Mobile Menu Button (Hamburger) */
.mobile-menu-button {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 36px;
  height: 36px;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Extra small screens - make even smaller */
@media (max-width: 480px) {
  .mobile-menu-button {
    width: 32px;
    height: 32px;
    padding: 7px;
    border-radius: 6px;
  }
}

.mobile-menu-button:hover {
  background: rgba(0, 0, 0, 0.95);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
}

.mobile-menu-button:active {
  transform: translateY(0) scale(0.95);
}

/* Hamburger Lines */
.hamburger-line {
  width: 100%;
  height: 2px;
  background: #efdfb7;
  border-radius: 1px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

/* Hamburger Animation to X */
.menu-open .hamburger-line:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.menu-open .hamburger-line:nth-child(2) {
  opacity: 0;
  transform: scale(0);
}

.menu-open .hamburger-line:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

/* Adjust animation for smaller mobile buttons */
@media (max-width: 480px) {
  .menu-open .hamburger-line:nth-child(1) {
    transform: translateY(5px) rotate(45deg);
  }
  
  .menu-open .hamburger-line:nth-child(3) {
    transform: translateY(-5px) rotate(-45deg);
  }
}

/* Mobile Drawer */
.mobile-drawer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999; /* Lower than Notes fullscreen to avoid conflicts */
  pointer-events: none;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-drawer.drawer-open {
  pointer-events: auto;
  opacity: 1;
}

/* Drawer Overlay */
.mobile-drawer-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000; /* Behind the drawer content */
}

.drawer-open .mobile-drawer-overlay {
  opacity: 1;
}

/* Drawer Content */
.mobile-drawer-content {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 300px;
  max-width: 80vw;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(15px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
  transform: translateX(100%);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  z-index: 1001; /* Ensure content is above the blur effect */
}

.drawer-open .mobile-drawer-content {
  transform: translateX(0);
}

/* Drawer Header */
.mobile-drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.25rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.drawer-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #efdfb7;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.close-drawer-button {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  touch-action: manipulation;
}

.close-drawer-button:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

.close-icon {
  font-size: 1.25rem;
  color: #efdfb7;
  line-height: 1;
}

/* Mobile responsive adjustments */
@media (max-width: 480px) {
  .close-drawer-button {
    width: 26px;
    height: 26px;
    border-radius: 4px;
  }
  
  .close-icon {
    font-size: 1.125rem;
  }
  
  .drawer-title {
    font-size: 1.125rem;
  }
  
  .mobile-drawer-content {
    width: 280px;
    max-width: 90vw;
  }
}

/* Mobile Navigation Items */
.mobile-nav-items {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
  position: relative;
  z-index: 1002; /* Ensure nav items are above backdrop blur */
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 1.25rem;
  border: none;
  background: transparent;
  color: #a0a0a0;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  touch-action: manipulation;
  min-height: 60px;
}

.mobile-nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #e0e0e0;
  padding-left: 1.5rem;
}

.mobile-nav-item:active {
  background: rgba(255, 255, 255, 0.12);
  transform: scale(0.98);
}

.mobile-nav-item-active {
  color: #efdfb7;
  background: rgba(239, 223, 183, 0.1);
}

.mobile-nav-item-active:hover {
  color: #efdfb7;
  background: rgba(239, 223, 183, 0.15);
}

.mobile-nav-label {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 500;
}

.nav-arrow {
  font-size: 1.2rem;
  opacity: 0.6;
  transition: all 0.2s ease;
}

.mobile-nav-item:hover .nav-arrow {
  opacity: 1;
  transform: translateX(4px);
}

/* Responsive Breakpoints */

/* Hide mobile menu on larger screens */
@media (min-width: 481px) {
  .mobile-menu-container {
    display: none !important;
  }
  
  .mobile-drawer {
    display: none !important;
  }
}

/* Show mobile menu and hide desktop nav on small screens */
@media (max-width: 480px) {
  .desktop-nav {
    display: none !important;
  }
  
  .mobile-menu-container {
    display: block;
  }
  
  .modern-navbar {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
  }
}

/* Tablet Navigation (481px to 768px) - Keep desktop style */
@media (min-width: 481px) and (max-width: 768px) {
  .modern-navbar {
    top: 0.75rem;
    left: 1rem;
    right: 1rem;
    transform: none;
    width: auto;
    max-width: none;
  }
  
  .navbar-pill {
    padding: 0.5rem;
    gap: 0.375rem;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(24px);
  }
  
  .nav-item {
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
    min-width: 48px;
    min-height: 48px;
    flex: 1;
    text-align: center;
    border-radius: 8px;
    touch-action: manipulation;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

/* Desktop Breakpoints */
@media (min-width: 769px) and (max-width: 1024px) {
  .modern-navbar {
    top: 1rem;
    width: auto;
    max-width: 600px;
  }
  
  .navbar-pill {
    padding: 0.5rem;
    gap: 0.25rem;
  }
  
  .nav-item {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }
}

@media (min-width: 1025px) and (max-width: 1440px) {
  .modern-navbar {
    top: 1.25rem;
    max-width: 700px;
  }
  
  .navbar-pill {
    padding: 0.625rem;
    gap: 0.375rem;
  }
  
  .nav-item {
    padding: 0.875rem 1.25rem;
    font-size: 0.9375rem;
  }
}

@media (min-width: 1441px) {
  .modern-navbar {
    top: 1.5rem;
    max-width: 800px;
  }
  
  .navbar-pill {
    padding: 0.75rem;
    gap: 0.5rem;
  }
  
  .nav-item {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }
}

/* Animation for navbar appearance */
.modern-navbar {
  animation: slideDown 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* Mobile animation override */
@media (max-width: 480px) {
  .modern-navbar {
    animation: none;
  }
  
  .mobile-menu-button {
    animation: fadeIn 0.6s ease-out;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Active section glow animation */
.nav-item-active {
  animation: activeGlow 0.3s ease-out;
}

@keyframes activeGlow {
  0% {
    text-shadow: 0 0 4px rgba(239, 223, 183, 0.4);
  }
  50% {
    text-shadow: 0 0 16px rgba(239, 223, 183, 0.9);
  }
  100% {
    text-shadow: 0 0 8px rgba(239, 223, 183, 0.6);
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .mobile-drawer-content,
  .mobile-drawer-overlay,
  .hamburger-line,
  .mobile-nav-item,
  .nav-arrow {
    transition: none !important;
    animation: none !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .mobile-menu-button,
  .mobile-drawer-content,
  .mobile-nav-item {
    border-width: 2px;
  }
  
  .mobile-nav-item-active {
    outline: 2px solid #efdfb7;
    outline-offset: -2px;
  }
}
</style>

