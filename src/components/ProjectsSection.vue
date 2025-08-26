<template>
  <section 
    id="projects" 
    class="portfolio-section modern-projects-section"
    aria-labelledby="projects-heading"
    role="region"
  >
    <div class="portfolio-container">
      <header class="section-header">
        <h2 id="projects-heading" class="section-title">
          Featured <span style="color: hsl(var(--primary))">Projects</span>
        </h2>
      </header>

      <!-- Projects Grid -->
      <div class="projects-grid">
        <div 
          v-for="project in projects" 
          :key="project.id"
          class="project-card"
        >
          <div class="card-header">
            <component :is="project.icon" class="card-icon" />
            <div class="card-stats">
              <Heart 
                class="heart-icon" 
                :class="{ 'heart-filled': project.liked }" 
                @click="toggleLike(project.id)"
              />
              <span class="like-count">{{ project.likes }}</span>
            </div>
                </div>

          <div class="card-content">
            <h3 class="card-title">{{ project.title }}</h3>
            <p class="card-description">{{ project.description }}</p>
                </div>
                
          <div class="card-tags">
                  <span 
              v-for="tag in project.tags"
                    :key="tag"
              class="tag"
                  >
                    {{ tag }}
                  </span>
                </div>
          
          <div class="card-actions">
            <Button 
              variant="outline" 
              class="w-full"
              @click="viewProject(project.id)"
            >
              View Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/*
  Modern projects section with clean shadcn-style card design
  Features responsive grid layout and interactive elements
*/

import { ref } from 'vue'
import type { Component } from 'vue'
import { Code, Globe, Palette, Zap, Heart } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'

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

// Project data with enhanced descriptions
const projects = ref<Project[]>([
  {
    id: 1,
    title: 'CodeSensei',
    description: 'AI-powered code analysis tool that transforms applications into interactive learning platforms',
    icon: Zap,
    likes: 2847,
    liked: true,
    tags: ['AI/ML', 'Education', 'React']
  },
  {
    id: 2,
    title: 'AGRO',
    description: 'Modern agricultural management system with advanced analytics and real-time monitoring',
    icon: Globe,
    likes: 1239,
    liked: false,
    tags: ['Agriculture', 'Analytics', 'React.js']
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
])

// Toggle like functionality
function toggleLike(projectId: number) {
  const project = projects.value.find(p => p.id === projectId)
  if (project) {
    project.liked = !project.liked
    project.likes += project.liked ? 1 : -1
  }
}

// View project functionality
function viewProject(projectId: number) {
  console.log(`Viewing project ${projectId}`)
  // Add your project viewing logic here
}
</script>

<style scoped>
/* Projects Section Styling */
.modern-projects-section {
  padding: 5rem 0;
  background: hsl(var(--background));
  position: relative;
}

.portfolio-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: 4rem;
}



.section-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: hsl(var(--foreground));
  margin: 0;
  line-height: 1.2;
}



/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

/* Project Cards */
.project-card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px hsl(var(--foreground)/10);
  border-color: hsl(var(--primary)/30);
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary)/60));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover::before {
  opacity: 1;
}

/* Card Header */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.card-icon {
  width: 2rem;
  height: 2rem;
  color: hsl(var(--primary));
  padding: 0.5rem;
  background: hsl(var(--primary)/10);
  border-radius: 0.5rem;
}

.card-stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.heart-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: hsl(var(--muted-foreground));
  cursor: pointer;
  transition: all 0.2s ease;
}

.heart-icon:hover {
  color: #ef4444;
  transform: scale(1.1);
}

.heart-icon.heart-filled {
  color: #ef4444;
  fill: #ef4444;
}

.like-count {
  font-size: 0.875rem;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
}

/* Card Content */
.card-content {
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.card-description {
  font-size: 0.875rem;
  line-height: 1.5;
  color: hsl(var(--muted-foreground));
  margin: 0;
}

/* Card Tags */
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  background: hsl(var(--muted));
  color: hsl(var(--muted-foreground));
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid hsl(var(--border));
  transition: all 0.2s ease;
}

.tag:hover {
  background: hsl(var(--primary)/10);
  color: hsl(var(--primary));
  border-color: hsl(var(--primary)/20);
}

/* Card Actions */
.card-actions {
  margin-top: auto;
}

/* Button Overrides */
.card-actions .w-full {
  width: 100%;
  transition: all 0.3s ease;
}

.card-actions button:hover {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  transform: translateY(-1px);
}

/* Comprehensive Responsive Design */

/* Extra Small Devices (phones, 480px and down) */
@media (max-width: 480px) {
  .modern-projects-section {
    padding: 2rem 0.5rem;
  }

  .portfolio-container {
    padding: 0 0.5rem;
  }

  .section-header {
    margin-bottom: 2rem;
    text-align: center;
  }

  .section-header h2 {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }

  .section-header p {
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .project-card {
    padding: 1rem;
    min-height: auto;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .card-title {
    font-size: 1rem;
    line-height: 1.25;
  }

  .card-description {
    font-size: 0.8125rem;
    line-height: 1.4;
  }

  .card-stats {
    align-self: flex-start;
    font-size: 0.75rem;
  }

  .card-tags {
    margin-bottom: 1rem;
    gap: 0.375rem;
  }

  .tag {
    font-size: 0.6875rem;
    padding: 0.1875rem 0.625rem;
  }

  .card-actions {
    margin-top: 0.75rem;
  }

  .card-actions button {
    font-size: 0.875rem;
    padding: 0.625rem 1rem;
    min-height: 44px; /* Touch-friendly */
  }
}

/* Small Devices (tablets, 481px to 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .modern-projects-section {
    padding: 3rem 1rem;
  }

  .portfolio-container {
    padding: 0 1rem;
  }

  .section-header {
    margin-bottom: 2.5rem;
    text-align: center;
  }

  .section-header h2 {
    font-size: 2rem;
  }

  .section-header p {
    font-size: 0.9375rem;
  }

  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  .project-card {
    padding: 1.25rem;
    min-height: 320px;
  }

  .card-header {
    margin-bottom: 1rem;
  }

  .card-title {
    font-size: 1.125rem;
  }

  .card-description {
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .card-tags {
    margin-bottom: 1.25rem;
  }

  .tag {
    font-size: 0.75rem;
  }

  .card-actions button {
    font-size: 0.875rem;
    padding: 0.75rem 1.25rem;
  }
}

/* Medium Devices (tablets/small laptops, 769px to 1024px) */
@media (min-width: 769px) and (max-width: 1024px) {
  .modern-projects-section {
    padding: 4rem 1.5rem;
  }

  .portfolio-container {
    padding: 0 1.5rem;
    max-width: 960px;
    margin: 0 auto;
  }

  .section-header {
    margin-bottom: 3rem;
  }

  .section-header h2 {
    font-size: 2.25rem;
  }

  .section-header p {
    font-size: 1rem;
  }

  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .project-card {
    padding: 1.5rem;
    min-height: 360px;
  }

  .card-title {
    font-size: 1.25rem;
  }

  .card-description {
    font-size: 0.9375rem;
  }

  .card-actions button {
    padding: 0.875rem 1.5rem;
  }
}

/* Large Devices (desktops, 1025px to 1440px) */
@media (min-width: 1025px) and (max-width: 1440px) {
  .modern-projects-section {
    padding: 5rem 2rem;
  }

  .portfolio-container {
    padding: 0 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-header {
    margin-bottom: 4rem;
  }

  .section-header h2 {
    font-size: 2.5rem;
  }

  .section-header p {
    font-size: 1.125rem;
  }

  .projects-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  .project-card {
    padding: 2rem;
    min-height: 400px;
  }

  .card-title {
    font-size: 1.375rem;
  }

  .card-description {
    font-size: 1rem;
    line-height: 1.6;
  }

  .card-actions button {
    padding: 1rem 2rem;
  }
}

/* Extra Large Devices (large desktops, 1441px and up) */
@media (min-width: 1441px) {
  .modern-projects-section {
    padding: 6rem 2.5rem;
  }

  .portfolio-container {
    padding: 0 2.5rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .section-header {
    margin-bottom: 5rem;
  }

  .section-header h2 {
    font-size: 2.75rem;
  }

  .section-header p {
    font-size: 1.1875rem;
  }

  .projects-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
  }

  .project-card {
    padding: 2.5rem;
    min-height: 450px;
  }

  .card-title {
    font-size: 1.5rem;
  }

  .card-description {
    font-size: 1.0625rem;
    line-height: 1.65;
  }

  .card-actions button {
    padding: 1.125rem 2.25rem;
    font-size: 1rem;
  }
}

/* Touch-friendly improvements for mobile */
@media (max-width: 768px) and (pointer: coarse) {
  .project-card {
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
  }

  .heart-icon {
    min-height: 44px;
    min-width: 44px;
    padding: 0.5rem;
  }

  .card-actions button {
    min-height: 44px;
    touch-action: manipulation;
  }

  /* Increase spacing for better touch targets */
  .card-tags {
    gap: 0.5rem;
  }

  .tag {
    min-height: 32px;
    padding: 0.375rem 0.75rem;
  }
}

/* Landscape orientation adjustments for phones */
@media (max-width: 768px) and (orientation: landscape) {
  .modern-projects-section {
    padding: 1.5rem 0.5rem;
  }

  .section-header {
    margin-bottom: 1.5rem;
  }

  .section-header h2 {
    font-size: 1.5rem;
  }

  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .project-card {
    padding: 1rem;
    min-height: 280px;
  }
}

/* Dark Mode Adjustments */
@media (prefers-color-scheme: dark) {
  .project-card:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }
}

/* Animation Preferences */
@media (prefers-reduced-motion: reduce) {
  .project-card,
  .heart-icon,
  .tag,
  .card-actions button {
    animation: none !important;
    transition: none;
  }

  .project-card:hover {
    transform: none;
  }
}

/* Focus Styles for Accessibility */
.heart-icon:focus,
.card-actions button:focus {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}

</style>