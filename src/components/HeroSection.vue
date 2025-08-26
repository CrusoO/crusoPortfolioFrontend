<template>
  <section id="hero" class="hero">
    <div class="hero-background">
      <div class="hero-gradient"></div>
      <div class="hero-orb-1"></div>
      <div class="hero-orb-2"></div>
    </div>

    <div class="hero-content">
      <div class="hero-badge">
        <span class="hero-status"></span>
        Hi, I'm Robinson
      </div>
      
      <h1 class="hero-title">
        <span class="hero-name">Full-Stack Developer</span> & Creative Problem Solver
      </h1>
      
      <p class="hero-description">
        I craft digital experiences that combine beautiful design with robust functionality. 
        Passionate about creating solutions that make a real difference in people's lives.
      </p>

      <div class="hero-actions">
        <Button @click="scrollToSection('projects')" size="lg">
          View My Work
          <ArrowRight class="h-4 w-4 ml-2" />
        </Button>
        
        <Button @click="scrollToSection('contact')" variant="outline" size="lg">
          <Mail class="h-4 w-4 mr-2" />
          Get in Touch
        </Button>
      </div>



      <div class="scroll-indicator">
        <ChevronDown class="h-6 w-6" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/*
  Hero section component showcasing personal introduction
  Features animated entrance and call-to-action buttons
*/

import { ref } from 'vue'
import { Mail, ArrowRight, ChevronDown } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import PaintCanvas from '@/components/PaintCanvas.vue'
import { scrollToSection } from '@/lib/utils'

interface Props {
  username?: string
}

const props = defineProps<Props>()
const showPaintCanvas = ref(true)


</script>

<style scoped>
/* Hero Section Styles */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)/30%) 100%);
}

.hero-background {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 20%, hsl(var(--primary)/20%) 0%, transparent 70%),
              radial-gradient(circle at 80% 80%, hsl(var(--accent)/15%) 0%, transparent 70%);
}

.hero-orb-1,
.hero-orb-2 {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;
}

.hero-orb-1 {
  width: 200px;
  height: 200px;
  background: hsl(var(--primary)/30%);
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.hero-orb-2 {
  width: 150px;
  height: 150px;
  background: hsl(var(--accent)/25%);
  bottom: 30%;
  right: 15%;
  animation-delay: 3s;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 900px;
  padding: 0 2rem;
  animation: fadeInUp 1s ease-out;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: hsl(var(--muted)/80%);
  backdrop-filter: blur(12px);
  border: 1px solid hsl(var(--border));
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  margin-bottom: 2rem;
  animation: fadeIn 1s ease-out 0.5s both;
}

.hero-status {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  color: hsl(var(--foreground));
  margin-bottom: 1.5rem;
  animation: fadeIn 1s ease-out 0.7s both;
}

.hero-name {
  background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.hero-description {
  font-size: 1.125rem;
  line-height: 1.6;
  color: hsl(var(--muted-foreground));
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeIn 1s ease-out 0.9s both;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 4rem;
  animation: fadeIn 1s ease-out 1.1s both;
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: hsl(var(--muted-foreground));
  animation: bounce 2s infinite;
  cursor: pointer;
  transition: color 0.2s ease;
}

.scroll-indicator:hover {
  color: hsl(var(--primary));
}

/* Animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

/* Comprehensive Responsive Design */

/* Extra Small Devices (phones, 480px and down) */
@media (max-width: 480px) {
  .hero {
    min-height: 100svh; /* Better viewport handling on mobile */
    padding: 1rem 0;
  }

  .hero-content {
    padding: 0 1rem;
    max-width: 100%;
  }

  .hero-badge {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .hero-status {
    width: 6px;
    height: 6px;
  }

  .hero-title {
    font-size: 2rem;
    line-height: 1.15;
    margin-bottom: 1rem;
  }

  .hero-description {
    font-size: 0.875rem;
    line-height: 1.5;
    margin-bottom: 2rem;
    padding: 0 0.5rem;
  }

  .hero-actions {
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .hero-actions button {
    width: 100%;
    min-height: 48px; /* Touch-friendly */
  }

  .hero-orb-1 {
    width: 120px;
    height: 120px;
    filter: blur(40px);
  }

  .hero-orb-2 {
    width: 100px;
    height: 100px;
    filter: blur(35px);
  }

  .scroll-indicator {
    bottom: 1rem;
  }
}

/* Small Devices (tablets, 481px to 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .hero {
    min-height: 100vh;
    padding: 1.5rem 0;
  }

  .hero-content {
    padding: 0 1.5rem;
    max-width: 700px;
  }

  .hero-badge {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
    margin-bottom: 1.75rem;
  }

  .hero-title {
    font-size: 2.5rem;
    line-height: 1.1;
    margin-bottom: 1.25rem;
  }

  .hero-description {
    font-size: 1rem;
    line-height: 1.55;
    margin-bottom: 2.5rem;
  }

  .hero-actions {
    gap: 1rem;
    margin-bottom: 3rem;
  }

  .hero-actions button {
    min-width: 160px;
    min-height: 44px;
  }

  .hero-orb-1 {
    width: 160px;
    height: 160px;
    filter: blur(50px);
  }

  .hero-orb-2 {
    width: 130px;
    height: 130px;
    filter: blur(45px);
  }
}

/* Medium Devices (tablets/small laptops, 769px to 1024px) */
@media (min-width: 769px) and (max-width: 1024px) {
  .hero {
    min-height: 100vh;
    padding: 2rem 0;
  }

  .hero-content {
    padding: 0 2rem;
    max-width: 800px;
  }

  .hero-badge {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
    margin-bottom: 2rem;
  }

  .hero-title {
    font-size: 3rem;
    line-height: 1.1;
    margin-bottom: 1.5rem;
  }

  .hero-description {
    font-size: 1.0625rem;
    line-height: 1.6;
    margin-bottom: 3rem;
  }

  .hero-actions {
    gap: 1.25rem;
    margin-bottom: 3.5rem;
  }

  .hero-orb-1 {
    width: 180px;
    height: 180px;
    filter: blur(55px);
  }

  .hero-orb-2 {
    width: 140px;
    height: 140px;
    filter: blur(50px);
  }
}

/* Large Devices (desktops, 1025px to 1440px) */
@media (min-width: 1025px) and (max-width: 1440px) {
  .hero {
    min-height: 100vh;
    padding: 2.5rem 0;
  }

  .hero-content {
    padding: 0 2.5rem;
    max-width: 900px;
  }

  .hero-badge {
    padding: 0.75rem 1.5rem;
    margin-bottom: 2.5rem;
  }

  .hero-title {
    font-size: 3.5rem;
    margin-bottom: 1.5rem;
  }

  .hero-description {
    font-size: 1.125rem;
    line-height: 1.6;
    margin-bottom: 3rem;
  }

  .hero-actions {
    gap: 1.5rem;
    margin-bottom: 4rem;
  }

  .hero-orb-1 {
    width: 200px;
    height: 200px;
    filter: blur(60px);
  }

  .hero-orb-2 {
    width: 150px;
    height: 150px;
    filter: blur(55px);
  }
}

/* Extra Large Devices (large desktops, 1441px and up) */
@media (min-width: 1441px) {
  .hero {
    min-height: 100vh;
    padding: 3rem 0;
  }

  .hero-content {
    padding: 0 3rem;
    max-width: 1000px;
  }

  .hero-badge {
    padding: 0.875rem 1.75rem;
    font-size: 0.9375rem;
    margin-bottom: 3rem;
  }

  .hero-title {
    font-size: 4rem;
    margin-bottom: 2rem;
  }

  .hero-description {
    font-size: 1.1875rem;
    line-height: 1.65;
    margin-bottom: 3.5rem;
    max-width: 700px;
  }

  .hero-actions {
    gap: 2rem;
    margin-bottom: 5rem;
  }

  .hero-orb-1 {
    width: 250px;
    height: 250px;
    filter: blur(70px);
  }

  .hero-orb-2 {
    width: 180px;
    height: 180px;
    filter: blur(65px);
  }
}

/* Touch-friendly improvements for mobile */
@media (max-width: 768px) and (pointer: coarse) {
  .hero-actions button {
    min-height: 48px;
    padding: 0.875rem 1.5rem;
    font-size: 0.9375rem;
    touch-action: manipulation;
  }

  .scroll-indicator {
    min-height: 44px;
    min-width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
  }
}

/* Landscape orientation adjustments for phones */
@media (max-width: 768px) and (orientation: landscape) {
  .hero {
    min-height: 100svh;
    padding: 1rem 0;
  }

  .hero-content {
    padding: 0 1rem;
  }

  .hero-badge {
    margin-bottom: 1rem;
  }

  .hero-title {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
  }

  .hero-description {
    font-size: 0.8125rem;
    margin-bottom: 1.5rem;
  }

  .hero-actions {
    flex-direction: row;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .hero-actions button {
    min-width: 140px;
    padding: 0.625rem 1rem;
    font-size: 0.8125rem;
  }

  .scroll-indicator {
    display: none; /* Hide in landscape to save space */
  }

  .hero-orb-1,
  .hero-orb-2 {
    filter: blur(30px);
    opacity: 0.4;
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .hero-orb-1,
  .hero-orb-2,
  .scroll-indicator {
    animation: none;
  }

  .hero-content,
  .hero-badge,
  .hero-title,
  .hero-description,
  .hero-actions {
    animation: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .hero-badge {
    border: 2px solid hsl(var(--border));
    background: hsl(var(--background));
  }

  .hero-orb-1,
  .hero-orb-2 {
    display: none; /* Hide decorative elements in high contrast */
  }
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .hero-orb-1 {
    background: hsl(var(--primary)/20%);
  }

  .hero-orb-2 {
    background: hsl(var(--accent)/15%);
  }

  .hero-status {
    box-shadow: 0 0 8px #22c55e40;
  }
}
</style>
