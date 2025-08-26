<template>
  <section id="contact" class="portfolio-section modern-contact-section">
    <div class="portfolio-container">
      <div class="section-header">
        <div class="section-badge">
          <Mail class="h-4 w-4" />
          Get In Touch
        </div>
        
        <h2 class="section-title">
          Let's Build Something <span class="text-primary">Amazing</span>
        </h2>
        
        <p class="section-description">
          Currently developing AI-powered educational tools and agricultural management systems. Let's collaborate on innovative projects that make a real impact.
        </p>
      </div>

      <div class="contact-layout">
        <div class="contact-info">
          <div class="contact-intro">
            <h3 class="text-xl font-semibold mb-3">Let's Connect</h3>
            <p class="text-muted-foreground leading-relaxed mb-6">
              Whether you're looking to build a groundbreaking web application, need expert technical consultation, 
              or want to discuss innovative ideas, I'm here to help turn your concepts into reality.
            </p>
          </div>

          <!-- Modern Contact Cards with HoverCard -->
          <div class="contact-cards">
            <HoverCard
              v-for="(contact, index) in contactInfo"
              :key="contact.type"
              :style="`animation-delay: ${index * 0.1}s`"
            >
              <template #trigger>
                <div class="contact-card-modern">
                  <div class="contact-icon-wrapper">
                    <component :is="contact.icon" class="contact-icon" />
              </div>
                  <div class="contact-details">
                    <p class="contact-label">{{ contact.label }}</p>
                    <p class="contact-value">{{ contact.value }}</p>
              </div>
            </div>
              </template>
              
              <template #content>
                <div class="contact-hover-info">
                  <h4 class="font-semibold mb-2">{{ contact.label }}</h4>
                  <p class="text-sm text-muted-foreground mb-3">{{ contact.description }}</p>
                  <Button size="sm" class="w-full">
                    <component :is="contact.icon" class="h-4 w-4 mr-2" />
                    {{ contact.action }}
                  </Button>
                </div>
              </template>
            </HoverCard>
          </div>

          <!-- Social Links with Tooltips -->
          <div class="social-section">
            <h4 class="text-base font-semibold mb-3">Connect with me</h4>
            <div class="social-links">
              <Tooltip
              v-for="social in socialLinks" 
              :key="social.name"
                :content="`Follow me on ${social.name}`"
              >
                <a :href="social.url" target="_blank" rel="noopener noreferrer" class="social-link-modern">
                  <component :is="social.icon" class="h-4 w-4" />
                </a>
              </Tooltip>
            </div>
          </div>

          <!-- Availability Status -->
          <div class="availability-status">
            <div class="status-indicator">
              <div class="status-dot"></div>
              <span class="status-text">Available for new projects</span>
            </div>
            <p class="status-description text-xs text-muted-foreground">
              Usually responds within 24 hours
            </p>
          </div>
        </div>

        <!-- Modern Contact Form -->
        <div class="contact-form-wrapper">
          <div class="form-header">
            <h3 class="text-lg font-semibold mb-2">Get In Touch</h3>
            <p class="text-sm text-muted-foreground mb-6">
              {{ formData.contactType === 'work' 
                ? 'Start your project with detailed information and requirements.' 
                : 'Share your quick feedback and rating - no personal details needed!' }}
            </p>
          </div>

          <form @submit.prevent="handleSubmit" class="contact-form-modern">
            <!-- Contact Type Toggle -->
            <div class="form-group">
              <Label>What brings you here?</Label>
              <div class="contact-type-toggle">
                <button
                  type="button"
                  @click="formData.contactType = 'work'"
                  class="toggle-option"
                  :class="{ 'toggle-option--active': formData.contactType === 'work' }"
                >
                  <Briefcase class="h-4 w-4" />
                  Work Inquiry
                </button>
                <button
                  type="button"
                  @click="formData.contactType = 'review'"
                  class="toggle-option"
                  :class="{ 'toggle-option--active': formData.contactType === 'review' }"
                  data-contact-type="review"
                >
                  <Star class="h-4 w-4" />
                  Leave Review
                </button>
              </div>
            </div>

            <!-- Contact Details (only for work inquiries) -->
            <div v-if="formData.contactType === 'work'">
              <div class="form-row">
                <div class="form-group">
                  <Label for="firstName">First Name *</Label>
                  <Input 
                    id="firstName"
                    v-model="formData.firstName"
                    @input="() => clearFieldError('firstName')"
                  placeholder="John"
                  required
                    :class="validationErrors.firstName ? 'modern-input border-red-500' : 'modern-input'"
                  />
                  <div v-if="validationErrors.firstName" class="validation-error">
                    {{ validationErrors.firstName }}
                  </div>
                </div>
                <div class="form-group">
                  <Label for="lastName">Last Name *</Label>
                  <Input 
                    id="lastName"
                    v-model="formData.lastName"
                    @input="() => clearFieldError('lastName')"
                    placeholder="Doe"
                    required
                    :class="validationErrors.lastName ? 'modern-input border-red-500' : 'modern-input'"
                  />
                  <div v-if="validationErrors.lastName" class="validation-error">
                    {{ validationErrors.lastName }}
                  </div>
                </div>
              </div>

              <div class="form-group">
                <Label for="email">Email Address *</Label>
                <Input 
                  id="email"
                  v-model="formData.email"
                  @input="() => clearFieldError('email')"
                  type="email"
                  placeholder="john@example.com"
                  required
                  :class="validationErrors.email ? 'modern-input border-red-500' : 'modern-input'"
                />
                <div v-if="validationErrors.email" class="validation-error">
                  {{ validationErrors.email }}
                </div>
              </div>
            </div>





            <!-- Timeline Selection (only for work inquiries) -->
            <div v-if="formData.contactType === 'work'" class="form-group">
              <Label>Timeline</Label>
              <div class="timeline-options flex flex-wrap gap-2 mt-2">
                <button
                  v-for="timeline in timelineOptions"
                  :key="timeline"
                  type="button"
                  @click="formData.timeline = timeline"
                  class="timeline-btn"
                  :class="{ 'timeline-btn--active': formData.timeline === timeline }"
                >
                  {{ timeline }}
                </button>
              </div>
            </div>

            <div class="form-group">
              <Label for="message">
                {{ formData.contactType === 'work' ? 'Project Details *' : 'Leave a Review' }}
              </Label>
              
              <!-- Review Input with Star Vote -->
              <div v-if="formData.contactType === 'review'" class="review-input-container">
                <Textarea 
                  id="message"
                  v-model="formData.message"
                  @input="() => clearFieldError('message')"
                  placeholder="Share your thoughts about my work, projects, or any suggestions for improvement..."
                  required
                  :class="validationErrors.message ? 'review-textarea border-red-500' : 'review-textarea'"
                  rows="4"
                />
                <Button 
                  type="submit"
                  :disabled="!formData.message.trim() || isSubmitting"
                  class="star-vote-button"
                  variant="ghost"
                >
                  <Star class="star-icon" :class="{ 'star-filled': formData.message.trim() }" />
                </Button>
              </div>
              
              <!-- Work Project Textarea -->
              <div v-else>
                <Textarea 
                  id="message"
                  v-model="formData.message"
                  @input="() => clearFieldError('message')"
                  placeholder="Tell me about your project requirements, goals, and any specific details..."
                required
                  :class="validationErrors.message ? 'modern-textarea border-red-500' : 'modern-textarea'"
                  rows="6"
                />
                <div class="character-count" :class="{ 'text-red-500': characterCount > 500 }">
                  {{ characterCount }} / 500 characters
                </div>
              </div>
              
              <div v-if="validationErrors.message" class="validation-error">
                {{ validationErrors.message }}
              </div>
            </div>

            <!-- Submit Status Message -->
            <div v-if="submitStatus" class="submit-status" :class="submitStatus">
              <div class="flex items-center gap-2">
                <CheckCircle v-if="submitStatus === 'success'" class="h-5 w-5" />
                <XCircle v-if="submitStatus === 'error'" class="h-5 w-5" />
                <span>{{ submitMessage }}</span>
              </div>
            </div>

            <!-- Form Actions (only for work inquiries) -->
            <div v-if="formData.contactType === 'work'" class="form-actions">
              <Button 
                type="button"
                variant="outline"
                @click="resetForm"
                class="reset-btn"
                :disabled="isSubmitting"
              >
                <RotateCcw class="h-4 w-4 mr-2" />
                Reset
              </Button>
              
              <Button 
                type="submit" 
                :disabled="isSubmitting"
                class="submit-btn"
              >
                <Send v-if="!isSubmitting" class="h-4 w-4 mr-2" />
                <div v-else class="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
            </Button>
            </div>

            <div class="form-footer">
              <p class="form-info text-xs text-center text-muted-foreground">
                Your information is secure and will only be used to respond to your inquiry.
              </p>
              <p class="email-direct text-xs text-center mt-1">
                <span class="text-muted-foreground">Direct email: </span>
                <a href="mailto:thaparobinson1@gmail.com" class="text-primary hover:underline font-medium">
                  thaparobinson1@gmail.com
                </a>
              </p>
              <p class="form-info text-xs text-center mt-1 text-muted-foreground">
                Form submissions open your email client with pre-filled content
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/*
  Modern contact section with interactive shadcn/ui components
  Features enhanced form with tabs, hover cards, tooltips, and modern UX
*/

import { ref, computed, watch } from 'vue'
import { API_ENDPOINTS } from '@/config/api'
import { Mail, Phone, MapPin, Send, RotateCcw, Code, Globe, Smartphone, Palette, Database, Zap, CheckCircle, XCircle, Briefcase, Star } from 'lucide-vue-next'
import { Github, Linkedin, Twitter } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Textarea from '@/components/ui/Textarea.vue'
import Label from '@/components/ui/Label.vue'
import Tabs from '@/components/ui/Tabs.vue'
import HoverCard from '@/components/ui/HoverCard.vue'
import Tooltip from '@/components/ui/Tooltip.vue'

// import emailjs from '@emailjs/browser' // Uncomment when using EmailJS approach

const formData = ref({
  contactType: 'work', // 'work' or 'review'
  firstName: '',
  lastName: '',
  email: '',
  timeline: '',
  message: ''
})

// Removed debug logging for production



const timelineOptions = ['ASAP', '1-2 weeks', '1 month', '2-3 months', '3+ months', 'Flexible']

const isSubmitting = ref(false)
const submitStatus = ref('') // 'success', 'error', or ''
const submitMessage = ref('')
const validationErrors = ref<Record<string, string>>({})

// Character count - reactive to formData.message changes
const characterCount = computed(() => {
  return formData.value.message.length
})

function validateForm() {
  const errors: Record<string, string> = {}
  
  // Contact details validation only for work inquiries
  if (formData.value.contactType === 'work') {
    if (!formData.value.firstName || !formData.value.firstName.trim()) {
      errors.firstName = 'First name is required'
    }
    
    if (!formData.value.lastName || !formData.value.lastName.trim()) {
      errors.lastName = 'Last name is required'
    }
    
    if (!formData.value.email || !formData.value.email.trim()) {
      errors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.value.email.trim())) {
      errors.email = 'Please enter a valid email address'
    }
  }
  
  // Message validation for both types
  if (!formData.value.message || !formData.value.message.trim()) {
    errors.message = formData.value.contactType === 'work' ? 'Project details are required' : 'Please write your review'
  } else if (formData.value.message.length > 500) {
    errors.message = 'Message must be under 500 characters'
  }
  
  validationErrors.value = errors
  return Object.keys(errors).length === 0
}

const contactInfo = [
  {
    type: 'email',
    icon: Mail,
    label: 'Email',
    value: 'thaparobinson1@gmail.com',
    description: 'Best way to reach me for project inquiries and collaborations',
    action: 'Send Email'
  },
  {
    type: 'phone',
    icon: Phone,
    label: 'Phone',
    value: 'Available on request',
    description: 'Available for urgent matters and project consultations',
    action: 'Contact via Email'
  },
  {
    type: 'location',
    icon: MapPin,
    label: 'Location',
    value: 'Bangalore, India',
    description: 'Open to remote work worldwide and local meetings in Bangalore',
    action: 'View Location'
  }
]

const socialLinks = [
  { name: 'GitHub', icon: Github, url: 'https://github.com/username' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/robinson-cruso6b3ba254/' },
  { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/username' }
]



function resetForm() {
  // Reset all form fields
  formData.value = {
    contactType: 'work',
    firstName: '',
    lastName: '',
    email: '',
    timeline: '',
    message: ''
  }
  
  // Clear any status messages
  submitStatus.value = ''
  submitMessage.value = ''
  
  // Clear validation errors
  clearAllErrors()
  
  // Reset form validation state completed
}

// Clear validation errors when user starts typing
function clearFieldError(fieldName: string) {
  if (validationErrors.value[fieldName]) {
    const newErrors = { ...validationErrors.value }
    delete newErrors[fieldName]
    validationErrors.value = newErrors
  }
}

// Clear all validation errors
function clearAllErrors() {
  validationErrors.value = {}
}

async function handleSubmit() {
  // Clear any previous status messages
  submitStatus.value = ''
  submitMessage.value = ''
  
  // Validate form and show errors if invalid
  if (!validateForm()) {
    submitStatus.value = 'error'
    submitMessage.value = 'Please fill in all required fields correctly'
    return
  }
  
  // Clear validation errors on successful validation
  clearAllErrors()
  
  isSubmitting.value = true
  
  try {
    if (formData.value.contactType === 'review') {
      // Handle review submission - send to backend
      try {
        const reviewData = {
          username: 'Anonymous', // Could be enhanced to capture username
          message: formData.value.message,
          rating: 5 // Default rating - could add rating input to form
        }
        
        const response = await fetch(API_ENDPOINTS.REVIEWS, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(reviewData)
        })
        
        if (response.ok) {
          await response.json()
          // Also update local storage as fallback
          const review = {
            id: Date.now(),
            message: formData.value.message,
            date: new Date().toISOString(),
            timestamp: new Date().toLocaleString()
          }
          const existingReviews = JSON.parse(localStorage.getItem('portfolioReviews') || '[]')
          existingReviews.push(review)
          localStorage.setItem('portfolioReviews', JSON.stringify(existingReviews))
          updateReviewStats()
          
          submitStatus.value = 'success'
          submitMessage.value = '✅ Thanks for your feedback! Your review has been saved to the backend.'
        } else {
          throw new Error('Failed to submit review')
        }
      } catch (error) {
        console.log('Backend not available, saving locally')
        // Fallback to local storage
        const review = {
          id: Date.now(),
          message: formData.value.message,
          date: new Date().toISOString(),
          timestamp: new Date().toLocaleString()
        }
        const existingReviews = JSON.parse(localStorage.getItem('portfolioReviews') || '[]')
        existingReviews.push(review)
        localStorage.setItem('portfolioReviews', JSON.stringify(existingReviews))
        updateReviewStats()
        
        submitStatus.value = 'success'
        submitMessage.value = 'Thanks for your feedback! Your review has been saved locally.'
      }
    } else {
      // Handle work inquiry - send to backend and open email
      try {
        const contactData = {
          contact_type: 'work',
          first_name: formData.value.firstName,
          last_name: formData.value.lastName,
          email: formData.value.email,
          timeline: formData.value.timeline,
          message: formData.value.message
        }
        
        const response = await fetch(API_ENDPOINTS.CONTACT_SUBMIT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(contactData)
        })
        
        if (response.ok) {
          await response.json()
          console.log('✅ Work inquiry saved to backend')
        } else {
          console.log('⚠️ Backend save failed, proceeding with email')
        }
      } catch (error) {
        console.log('❌ Backend not available, proceeding with email only')
      }
      
      // Always open email client regardless of backend status
      const emailSubject = encodeURIComponent(`Portfolio Contact: Work Inquiry`)
      const emailBody = encodeURIComponent(`
Hello Robinson,

New work inquiry:

Name: ${formData.value.firstName} ${formData.value.lastName}
Email: ${formData.value.email}
Timeline: ${formData.value.timeline || 'Not specified'}

Project Details:
${formData.value.message}

---
Sent from your portfolio contact form
      `)
      
      const mailtoLink = `mailto:thaparobinson1@gmail.com?subject=${emailSubject}&body=${emailBody}`
      window.open(mailtoLink, '_blank')
      
      submitStatus.value = 'success'
      submitMessage.value = '📧 Email client opened with your message! Your inquiry has also been saved to our backend.'
    }
    
    // Reset form after successful submission
    setTimeout(() => {
      resetForm()
    }, 2000)
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      submitStatus.value = ''
      submitMessage.value = ''
    }, 5000)
    
  } catch (error) {
    console.error('Error sending email:', error)
    
    submitStatus.value = 'error'
    submitMessage.value = 'Unable to open email client. Please copy the details above and email me directly at thaparobinson1@gmail.com'
    
    // Clear error message after 8 seconds
    setTimeout(() => {
      submitStatus.value = ''
      submitMessage.value = ''
    }, 8000)
  } finally {
    isSubmitting.value = false
  }
}

function updateReviewStats() {
  const reviews = JSON.parse(localStorage.getItem('portfolioReviews') || '[]')
  
  const stats = {
    count: reviews.length,
    updated: Date.now()
  }
  
  localStorage.setItem('portfolioReviewStats', JSON.stringify(stats))
  
  // Trigger a custom event to update the header
  window.dispatchEvent(new CustomEvent('reviewsUpdated', { detail: stats }))
}
</script>

<style scoped>
.contact-type-toggle {
  display: flex;
  gap: 0.5rem;
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  padding: 0.25rem;
  background: hsl(var(--muted));
}

.toggle-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.25rem;
  background: transparent;
  color: hsl(var(--muted-foreground));
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-option:hover {
  background: hsl(var(--card));
  color: hsl(var(--foreground));
}

.toggle-option--active {
  background: hsl(var(--card));
  color: hsl(var(--foreground));
  box-shadow: 0 1px 3px hsl(var(--foreground)/10);
}

.review-input-container {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}



.star-vote-button {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: hsl(var(--muted));
  border: 2px solid hsl(var(--border));
  transition: all 0.2s ease;
  margin-top: 0;
}

.star-vote-button:hover:not(:disabled) {
  background: hsl(var(--primary)/10);
  border-color: hsl(var(--primary));
  transform: scale(1.05);
}

.star-vote-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.star-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: hsl(var(--muted-foreground));
  transition: all 0.2s ease;
}

.star-icon.star-filled {
  color: #fbbf24;
  fill: #fbbf24;
}

.star-vote-button:hover:not(:disabled) .star-icon {
  color: #fbbf24;
  fill: #fbbf24;
}

/* Modern Black Background Inputs */
.modern-input {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: #ffffff;
  transition: all 0.2s ease;
}

.modern-input:focus {
  outline: none;
  border-color: hsl(var(--primary));
  box-shadow: 0 0 0 2px hsl(var(--primary)/20);
  background: #222222;
}

.modern-input::placeholder {
  color: #888888;
}

.modern-textarea {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: #ffffff;
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s ease;
}

.modern-textarea:focus {
  outline: none;
  border-color: hsl(var(--primary));
  box-shadow: 0 0 0 2px hsl(var(--primary)/20);
  background: #222222;
}

.modern-textarea::placeholder {
  color: #888888;
}

/* Update review textarea to also be black */
.review-textarea {
  flex: 1;
  min-height: 100px;
  resize: vertical;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  background: #1a1a1a;
  color: #ffffff;
  transition: all 0.2s ease;
}

.review-textarea:focus {
  outline: none;
  border-color: hsl(var(--primary));
  box-shadow: 0 0 0 2px hsl(var(--primary)/20);
  background: #222222;
}

.review-textarea::placeholder {
  color: #888888;
}
</style>