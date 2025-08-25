<template>
  <section id="projects" class="portfolio-section">
    <div class="portfolio-container">
      <div class="section-header">
        <div class="section-badge">
          <Code class="h-4 w-4" />
          Recent Work
        </div>
        
        <h2 class="section-title">
          Featured <span style="color: hsl(var(--primary))">Projects</span>
        </h2>
        
        <p class="section-description">
          A showcase of my current projects and future developments. From AI-powered educational tools to agricultural management systems, each project represents innovation and technical excellence.
        </p>
      </div>

      <div class="card-grid">
        <article 
          v-for="(project, index) in projects"
          :key="project.id"
          class="project-card-modern"
          :style="`animation-delay: ${index * 0.1}s`"
        >
          <div class="project-image">
            <component :is="project.icon" class="project-icon" />
          </div>

          <div class="project-content">
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-description">{{ project.description }}</p>

            <div class="project-tech-modern">
              <span
                v-for="tech in project.technologies.slice(0, 4)"
                :key="tech"
                class="tech-tag"
              >
                {{ tech }}
              </span>
              <Tooltip 
                v-if="project.technologies.length > 4"
                :content="project.technologies.slice(4).join(', ')"
              >
                <span class="tech-tag tech-tag--more">
                  +{{ project.technologies.length - 4 }}
                </span>
              </Tooltip>
            </div>

            <div class="project-actions">
              <Button 
                variant="outline" 
                size="sm"
                class="project-btn"
                @click="() => project.githubUrl && openLink(project.githubUrl)"
                :disabled="!project.githubUrl"
              >
                <Github class="h-4 w-4 mr-1" />
                View Code
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                class="project-btn contribute-btn"
                @click="scrollToReview"
              >
                <ExternalLink class="h-4 w-4 mr-1" />
                Contribute
              </Button>
            </div>

            <div v-if="project.metrics" class="project-stats">
              <Tooltip content="GitHub Stars">
                <span class="stat">
                  <Star class="h-3 w-3" />
                  {{ project.metrics.stars }}
                </span>
              </Tooltip>
              <Tooltip content="Forks">
                <span class="stat">
                  <GitFork class="h-3 w-3" />
                  {{ project.metrics.forks }}
                </span>
              </Tooltip>
              <Tooltip content="Views">
                <span class="stat">
                  <Eye class="h-3 w-3" />
                  {{ project.metrics.views }}
                </span>
              </Tooltip>
            </div>
          </div>
        </article>
      </div>

      <div style="text-align: center; margin-top: 4rem;">
        <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem;">Interested in working together?</h3>
        <div style="display: flex; flex-direction: column; gap: 1rem; justify-content: center; align-items: center;">
          <Button variant="outline">
            <Github class="h-4 w-4 mr-2" />
            View All Projects
          </Button>
          <Button @click="scrollToSection('contact')">
            <Mail class="h-4 w-4 mr-2" />
            Start a Project
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/*
  Modern Projects section with interactive hover cards and tooltips
  Features enhanced project cards with detailed tech stack information
*/

import { Code, Database, Smartphone, Globe, Palette, Zap, Star, GitFork, Eye, Mail, ExternalLink } from 'lucide-vue-next'
import { Github } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Tooltip from '@/components/ui/Tooltip.vue'
import { scrollToSection } from '@/lib/utils'

function openLink(url: string) {
  window.open(url, '_blank')
}

function scrollToReview() {
  // First scroll to contact section
  scrollToSection('contact')
  
  // Then switch to review mode after a short delay
  setTimeout(() => {
    // Find the contact type toggle and click review
    const reviewButton = document.querySelector('[data-contact-type="review"]') as HTMLButtonElement
    if (reviewButton) {
      reviewButton.click()
    }
    
    // Focus on the review textarea
    setTimeout(() => {
      const reviewTextarea = document.querySelector('.review-textarea') as HTMLTextAreaElement
      if (reviewTextarea) {
        reviewTextarea.focus()
      }
    }, 200)
  }, 500)
}

const projects = [
  {
    id: 1,
    title: 'CodeSensei',
    description: 'AI-Powered Code Analysis & Educational Video Generator that transforms applications into interactive coding education platforms',
    icon: Zap,
    technologies: ['JavaScript', 'Python', 'React', 'FastAPI', 'Docker', 'OpenAI API', 'HTML5 Canvas', 'WebGL'],
    metrics: { stars: '0', forks: '0', views: 'New' },
    features: ['Real-time code analysis (<100ms)', 'AI video generation', 'Educational explanations', 'Universal integration'],
    githubUrl: 'https://github.com/CrusoO/CodeSensei'
  },
  {
    id: 2,
    title: 'AGRO Frontend',
    description: 'Modern agricultural management system frontend with advanced farm analytics and crop monitoring capabilities',
    icon: Globe,
    technologies: ['Vue.js', 'TypeScript', 'Tailwind CSS', 'Chart.js', 'PWA', 'Vite'],
    metrics: { stars: '0', forks: '0', views: 'New' },
    features: ['Farm management', 'Crop monitoring', 'Weather integration', 'Analytics dashboard'],
    githubUrl: 'https://github.com/CrusoO/AGRO_Frontend'
  }
]
</script>

<style scoped>
.project-btn {
  min-width: 100px;
  height: 32px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.project-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.project-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.contribute-btn {
  color: hsl(var(--primary));
  border: 1px solid hsl(var(--primary)/30);
  background: transparent;
}

.contribute-btn:hover {
  background: transparent !important;
  border-color: hsl(var(--primary));
  color: hsl(var(--primary));
  opacity: 0.8;
}

/* Text alignment fixes */
.project-content {
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.project-title {
  text-align: left;
  width: 100%;
  margin-bottom: 0.75rem;
}

.project-description {
  text-align: left;
  width: 100%;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.project-tech-modern {
  text-align: left;
  width: 100%;
  margin-bottom: 1.5rem;
}

.project-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-top: auto;
}

.project-stats {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-top: 1rem;
}
</style>