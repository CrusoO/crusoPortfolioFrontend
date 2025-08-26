<template>
  <section 
    id="projects" 
    class="portfolio-section modern-projects-section"
    aria-labelledby="projects-heading"
    role="region"
  >
    <div class="portfolio-container">
      <header class="section-header">
        <div class="section-badge" role="img" aria-label="Code icon - Recent Work">
          <Code class="h-4 w-4" aria-hidden="true" />
          Recent Work
      </div>

        <h2 id="projects-heading" class="section-title">
          Featured <span style="color: hsl(var(--primary))">Projects</span>
        </h2>
      </header>

            <!-- GSAP ScrollTrigger Cards Animation - Exact Demo Structure -->
      <div class="spacer"></div>
      <div class="wrapper">
        <div class="cards">
          <div class="card-wrapper">
            <div class="card one">
              <!-- Card Content -->
              <div class="card-content-overlay">
                <!-- Card Header with Icon -->
                <div class="card-icon-section">
                  <component :is="projects[0].icon" class="project-icon-new" />
                </div>

                <!-- Card Content -->
                <div class="card-content-section">
                  <h3 class="project-title-new">{{ projects[0].title }}</h3>
                  <p class="project-description-new">{{ projects[0].description }}</p>
                </div>
                
                <!-- Like/Heart Section -->
                <div class="card-stats-section">
                  <div class="heart-section">
                    <Heart class="heart-icon" :class="{ 'heart-filled': projects[0].liked }" />
                    <span class="like-count">{{ projects[0].likes }}</span>
                  </div>
                </div>

                <!-- Tags Section -->
                <div class="card-tags-section">
                  <span 
                    v-for="tag in projects[0].tags"
                    :key="tag"
                    class="project-tag-new"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="card-wrapper">
            <div class="card two">
              <!-- Card Content -->
              <div class="card-content-overlay">
                <!-- Card Header with Icon -->
                <div class="card-icon-section">
                  <component :is="projects[1].icon" class="project-icon-new" />
                </div>

                <!-- Card Content -->
                <div class="card-content-section">
                  <h3 class="project-title-new">{{ projects[1].title }}</h3>
                  <p class="project-description-new">{{ projects[1].description }}</p>
                </div>
                
                <!-- Like/Heart Section -->
                <div class="card-stats-section">
                  <div class="heart-section">
                    <Heart class="heart-icon" :class="{ 'heart-filled': projects[1].liked }" />
                    <span class="like-count">{{ projects[1].likes }}</span>
                  </div>
                </div>

                <!-- Tags Section -->
                <div class="card-tags-section">
                  <span 
                    v-for="tag in projects[1].tags"
                    :key="tag"
                    class="project-tag-new"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="card-wrapper">
            <div class="card three">
              <!-- Card Content -->
              <div class="card-content-overlay">
                <!-- Card Header with Icon -->
                <div class="card-icon-section">
                  <component :is="projects[2].icon" class="project-icon-new" />
                </div>

                <!-- Card Content -->
                <div class="card-content-section">
                  <h3 class="project-title-new">{{ projects[2].title }}</h3>
                  <p class="project-description-new">{{ projects[2].description }}</p>
                </div>
                
                <!-- Like/Heart Section -->
                <div class="card-stats-section">
                  <div class="heart-section">
                    <Heart class="heart-icon" :class="{ 'heart-filled': projects[2].liked }" />
                    <span class="like-count">{{ projects[2].likes }}</span>
                  </div>
                </div>

                <!-- Tags Section -->
                <div class="card-tags-section">
                  <span 
                    v-for="tag in projects[2].tags"
                    :key="tag"
                    class="project-tag-new"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="spacer"></div>

      <div class="text-center mt-8 sm:mt-12">
        <Button variant="outline" size="lg" class="view-all-btn">
          View All Projects
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/*
  Modern projects section with GSAP ScrollTrigger card animation
  Features stacked card effect with scaling and rotation on scroll
*/

import { onMounted, onUnmounted, nextTick } from 'vue'
import type { Component } from 'vue'
import { Code, Globe, Palette, Zap, Heart } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'

// Import GSAP and ScrollTrigger with proper typing
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

// Project interface for type safety
interface Project {
  id: number
  title: string
  description: string
  icon: Component
  likes: number
  liked: boolean
  tags: string[]
}

// Projects data with proper typing
const projects: Project[] = [
  {
    id: 1,
    title: 'CodeSensei',
    description: 'Video Generator Engine that transforms applications into interactive visuals',
    icon: Zap,
    likes: 3022,
    liked: true,
    tags: ['AI-powered', 'Education', 'Video Gen']
  },
  {
    id: 2,
    title: 'AGRO Frontend',
    description: 'Modern agricultural management system with advanced analytics',
    icon: Globe,
    likes: 2849,
    liked: true,
    tags: ['Agriculture', 'Analytics', 'Vue.js']
  },
  {
    id: 3,
    title: 'Portfolio Site',
    description: 'Interactive portfolio with MS Paint canvas and AI chatbot',
    icon: Palette,
    likes: 4351,
    liked: false,
    tags: ['Portfolio', 'Interactive', 'Vue.js']
  }
] as const

// Exact original demo implementation from GSAP community
onMounted(async () => {
  await nextTick()
  
  console.clear()
  
  const cardsWrappers = gsap.utils.toArray(".card-wrapper")
  const cards = gsap.utils.toArray(".card")

  cardsWrappers.forEach((wrapper, i) => {
    const card = cards[i] as HTMLElement
    const wrapperElement = wrapper as HTMLElement
    let scale = 1, rotation = 0
    
    if (i !== cards.length - 1) {
      scale = 0.9 + 0.025 * i
      rotation = -10
    }
    
    gsap.to(card, {
      scale: scale,
      rotationX: rotation,
      transformOrigin: "top center",
      ease: "none",
      scrollTrigger: {
        trigger: wrapperElement,
        start: "top " + (60 + 10 * i),
        end: "bottom 550",
        endTrigger: ".wrapper",
        scrub: true,
        pin: wrapperElement,
        pinSpacing: false,
        // markers: {
        //   indent: 100 * i,
        //   startColor: "#0ae448",
        //   endColor: "#fec5fb",
        //   fontSize: "14px"
        // },
        id: (i + 1).toString()
      }
    })
  })
})

onUnmounted(() => {
  // Clean up ScrollTrigger instances
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped>
/* Modern Projects Section with Global Cream Text Color */
.modern-projects-section {
  background: #000000;
  min-height: 100vh;
  padding: 2rem 2rem; /* Reduced top/bottom padding */
  color: rgb(255, 252, 225); /* Global cream text color */
}

.modern-projects-section .section-title,
.modern-projects-section .section-description {
  color: rgb(255, 252, 225); /* Cream color for headings */
}

.modern-projects-section .section-badge {
  background: rgba(255, 252, 225, 0.1); /* Cream tint background */
  color: rgb(255, 252, 225); /* Cream text */
  border: 1px solid rgba(255, 252, 225, 0.2); /* Cream border */
}

/* Exact original demo styles - from GSAP community forums */
* {
  box-sizing: border-box;
}

.spacer {
  width: 100%;
  min-height: 2rem; /* Reduced from 100vh to 2rem */
}

.wrapper {
  width: 100%;
  min-height: 100vh;
  padding-top: 20px; /* Reduced from 100px */
  padding-bottom: 20px; /* Reduced from 50px */
}

.card-wrapper {
  width: 100%;
  perspective: 500px;
  margin-bottom: 50px;
}

.card-wrapper:last-child {
  margin-bottom: 0;
}

.cards {
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
  padding: 0 20px;
}

.card {
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  position: relative;
  /* Original demo background style */
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top center;
}

/* Card-specific styles matching demo structure */
.card.one {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d30 50%, #000000 100%);
  border: 3px solid #404040;
}

.card.two {
  background: linear-gradient(135deg, #0f0f0f 0%, #1c1c1c 50%, #090909 100%);
  border: 3px solid #333333;
}

.card.three {
  background: linear-gradient(135deg, #161616 0%, #252525 50%, #0a0a0a 100%);
  border: 3px solid #3a3a3a;
}

/* Card Content Overlay */
.card-content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 17px;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  border-radius: 17px;
  pointer-events: none;
}

/* Icon Section */
.card-icon-section {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.project-icon-new {
  width: 3rem;
  height: 3rem;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.75rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

/* Content Section */
.card-content-section {
  flex: 1;
  margin-bottom: 1.5rem;
}

.project-title-new {
  color: rgb(255, 252, 225); /* Cream color for titles */
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  line-height: 1.2;
}

.project-description-new {
  color: rgba(255, 252, 225, 0.9); /* Cream with opacity for descriptions */
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 1rem;
}

/* Heart/Stats Section */
.card-stats-section {
  margin-bottom: 1rem;
}

.heart-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.heart-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #ffffff;
  transition: all 0.2s ease;
  cursor: pointer;
}

.heart-icon:hover {
  transform: scale(1.2);
}

.heart-icon.heart-filled {
  color: #ef4444;
  fill: #ef4444;
}

.like-count {
  color: rgb(255, 252, 225); /* Cream color for like count */
  font-weight: 600;
  font-size: 1rem;
}

/* Tags Section */
.card-tags-section {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.project-tag-new {
  background: rgba(255, 252, 225, 0.2); /* Cream tint background */
  color: rgb(255, 252, 225); /* Cream text for tags */
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 252, 225, 0.2); /* Cream border */
}

.project-tag-new:hover {
  background: rgba(255, 252, 225, 0.3); /* Cream hover background */
  transform: translateY(-2px);
}

/* View All Button with Cream Color */
.view-all-btn {
  background: rgb(255, 252, 225); /* Cream background */
  color: #000000; /* Dark text for contrast */
  border: 2px solid rgb(255, 252, 225); /* Cream border */
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.view-all-btn:hover {
  background: transparent;
  color: rgb(255, 252, 225); /* Cream text on hover */
  border-color: rgb(255, 252, 225); /* Cream border on hover */
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 252, 225, 0.3); /* Cream shadow */
}

/* Responsive Design for ScrollTrigger Cards */
/* Responsive styles matching original demo */
@media (min-width: 768px) {
  .cards {
    width: 80%;
    padding: 0 30px;
  }
}

@media (min-width: 1024px) {
  .cards {
    width: 70%;
    padding: 0 50px;
  }
}

@media (max-width: 768px) {
  .modern-projects-section {
    padding: 2rem 0;
  }
  
  .wrapper {
    padding-top: 50px;
    padding-bottom: 25px;
  }
  
  .card {
    height: 350px;
  }
  
  .card-content-overlay {
    padding: 1.25rem;
  }
  
  .project-icon-new {
    width: 2.5rem;
    height: 2.5rem;
    padding: 0.5rem;
  }
  
  .project-title-new {
    font-size: 1.125rem;
  }
  
  .project-description-new {
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  .card {
    height: 320px;
  }
  
  .card-content-overlay {
    padding: 1rem;
  }
  
  .project-title-new {
    font-size: 1rem;
  }
  
  .project-description-new {
    font-size: 0.75rem;
  }
  
  .project-tag-new {
    font-size: 0.675rem;
    padding: 0.25rem 0.5rem;
  }
}

/* GSAP ScrollTrigger handles all animations */
</style>