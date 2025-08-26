<template>
  <nav class="modern-navbar">
    <div class="navbar-container">
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
    scrollOffset: -134  // Custom scroll offset for Projects section
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
  updateActiveSection()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveSection)
})
</script>

<style scoped>
.modern-navbar {
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
  pointer-events: none;
}

.navbar-container {
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

/* Responsive Design */
@media (max-width: 768px) {
  .modern-navbar {
    top: 1rem;
  }
  
  .navbar-pill {
    padding: 0.375rem;
    gap: 0.125rem;
  }
  
  .nav-item {
    padding: 0.625rem 0.75rem;
    font-size: 0.8125rem;
  }
  

}

@media (max-width: 480px) {
  .nav-item {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
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

/* Smooth scroll behavior enhancement */
html {
  scroll-behavior: smooth;
}

/* Active section indicator animation */
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
</style>
