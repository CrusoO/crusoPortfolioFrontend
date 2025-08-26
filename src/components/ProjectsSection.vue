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

.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: hsl(var(--primary)/10);
  border: 1px solid hsl(var(--primary)/20);
  color: hsl(var(--primary));
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
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

/* Responsive Design */
@media (max-width: 768px) {
  .portfolio-container {
    padding: 0 1rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .project-card {
    padding: 1.25rem;
  }
  
  .section-header {
    margin-bottom: 3rem;
  }
}

@media (max-width: 480px) {
  .modern-projects-section {
    padding: 3rem 0;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .card-stats {
    align-self: flex-end;
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