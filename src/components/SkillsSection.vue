<template>
  <section id="skills" class="portfolio-section" style="background: linear-gradient(to bottom, hsl(var(--muted) / 0.3), hsl(var(--background)));">
    <div class="portfolio-container">
      <div class="section-header">
        <div class="section-badge">
          <Zap class="h-4 w-4" />
          Expertise & Content
        </div>
        
        <h2 class="section-title">
          Important <span style="color: hsl(var(--primary))">Notes</span>
        </h2>
      </div>

      <!-- Modern Tabs for Skills & Content -->
      <Tabs :tabs="skillTabs" :defaultValue="activeTab" @change="setActiveTab">
        <template #default="{ activeTab }">
          <div class="skills-content">
            <!-- Articles Tab Content - Apple Notes Style -->
            <div v-show="activeTab === 'articles'" class="apple-notes-container" :class="{ 'fullscreen': isNotesFullscreen }">
              
              <!-- Mobile Notes Header (only visible on mobile) -->
              <div class="mobile-notes-header">
                <button 
                  @click="toggleMobileDrawer"
                  class="mobile-menu-button"
                  :class="{ 'active': isMobileDrawerOpen }"
                >
                  <span class="hamburger-line"></span>
                  <span class="hamburger-line"></span>
                  <span class="hamburger-line"></span>
                </button>
                
                <div class="mobile-header-content">
                  <h1 class="mobile-article-title">{{ selectedArticle?.title || 'My Notes' }}</h1>
                  <div class="mobile-article-info" v-if="selectedArticle">
                    <span class="mobile-read-time">{{ selectedArticle.readTime }} min read</span>
                    <span class="mobile-category" :class="selectedArticle.category">{{ selectedArticle.category }}</span>
                  </div>
                </div>
                
                <button 
                  @click="toggleNotesFullscreen" 
                  class="mobile-fullscreen-btn"
                  :title="isNotesFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'"
                >
                  <Minimize class="h-3 w-3" v-if="isNotesFullscreen" />
                  <Maximize class="h-3 w-3" v-else />
                </button>
              </div>

              <!-- Mobile Drawer Overlay -->
              <div 
                class="mobile-drawer-overlay" 
                :class="{ 'show': isMobileDrawerOpen }"
                @click="closeMobileDrawer"
              ></div>

              <!-- Mobile Notes Drawer -->
              <div class="mobile-notes-drawer" :class="{ 'open': isMobileDrawerOpen }">
                <div class="drawer-header">
                  <div class="drawer-header-left">
                    <h2 class="drawer-title">My Notes</h2>
                    <span class="drawer-count">{{ filteredArticles.length }}</span>
                  </div>
                  <button @click="closeMobileDrawer" class="drawer-close-btn">
                    <span>×</span>
                  </button>
                </div>

                <div class="drawer-search">
                  <Search class="search-icon" />
                  <input 
                    v-model="searchQuery" 
                    type="text" 
                    placeholder="Search notes..." 
                    class="drawer-search-input"
                  />
                </div>

                <div class="drawer-notes-list">
                  <!-- Loading state -->
                  <div v-if="isLoadingNotes" class="drawer-loading">
                    <div class="loading-spinner"></div>
                    <p>Loading notes...</p>
                  </div>
                  
                  <!-- Notes list -->
                  <div 
                    v-else-if="filteredArticles.length > 0"
                    v-for="article in filteredArticles" 
                    :key="article.id"
                    class="drawer-note-item"
                    :class="{ active: selectedArticle?.id === article.id }"
                    @click="selectMobileArticle(article)"
                  >
                    <div class="drawer-note-preview">
                      <h4 class="drawer-note-title">{{ article.title }}</h4>
                      <p class="drawer-note-snippet">{{ article.snippet }}</p>
                      <div class="drawer-note-meta">
                        <span class="drawer-note-date">{{ formatDate(article.createdAt) }}</span>
                        <span class="drawer-note-tag">{{ article.category }}</span>
                      </div>
                    </div>
                    <div class="drawer-note-arrow">→</div>
                  </div>
                  
                  <!-- Empty state -->
                  <div v-else class="drawer-empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>No notes found</h3>
                    <p>Try adjusting your search or check back later.</p>
                  </div>
                </div>
              </div>
              
              <!-- Desktop Notes Sidebar (hidden on mobile) -->
              <div class="notes-sidebar desktop-sidebar">
                <div class="notes-header">
                  <div class="notes-header-left">
                    <h3 class="notes-title">My Notes</h3>
                    <span class="notes-count">{{ filteredArticles.length }}</span>
                  </div>
                  <Button 
                    @click="toggleNotesFullscreen" 
                    variant="ghost" 
                    size="sm" 
                    :title="isNotesFullscreen ? 'Exit Fullscreen (ESC)' : 'Enter Fullscreen'"
                    class="fullscreen-btn"
                  >
                    <Minimize class="h-3.5 w-3.5" v-if="isNotesFullscreen" />
                    <Maximize class="h-3.5 w-3.5" v-else />
                  </Button>
                  <Button 
                    @click="openAdminPanel"
                    variant="ghost"
                    size="sm"
                    class="admin-btn"
                    title="Admin Panel"
                  >
                    <Settings class="h-4 w-4" />
                  </Button>
                </div>
                
                <div class="search-container">
                  <Search class="search-icon" />
                  <input 
                    v-model="searchQuery" 
                    type="text" 
                    placeholder="Search notes..." 
                    class="search-input"
                  />
                </div>

                <div class="notes-list">
                  <div 
                    v-for="article in filteredArticles" 
                    :key="article.id"
                    class="note-item"
                    :class="{ active: selectedArticle?.id === article.id }"
                    @click="selectArticle(article)"
                  >
                    <div class="note-preview">
                      <h4 class="note-title">{{ article.title }}</h4>
                      <p class="note-snippet">{{ article.snippet }}</p>
                      <div class="note-meta">
                        <span class="note-date">{{ formatDate(article.createdAt) }}</span>
                        <span class="note-tag">{{ article.category }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Main Content Area -->
              <div class="notes-content">
                <div v-if="selectedArticle" class="article-view">
                  <div class="article-header">
                    <h1 class="article-title">{{ selectedArticle.title }}</h1>
                    <div class="article-meta">
                      <span class="article-date">{{ formatDate(selectedArticle.createdAt) }}</span>
                      <span class="article-category" :class="selectedArticle.category">{{ selectedArticle.category }}</span>
                      <span class="article-read-time">{{ selectedArticle.readTime }} min read</span>
                    </div>
                    
                    <!-- Audio Player Controls -->
                    <div class="audio-player">
                      <div class="audio-controls">
                        <Button 
                          @click="playSelectedArticle"
                          v-if="!isSpeaking && !isLoadingAudio"
                          variant="ghost" 
                          size="sm"
                          class="audio-btn play-btn"
                          title="Listen to this content"
                        >
                          <Play class="h-4 w-4 mr-2" />
                          Listen
                          <span class="audio-badge" :class="useAIVoice ? 'ai-voice' : 'browser-voice'">
                            {{ useAIVoice ? 'AI Voice' : 'Browser' }}
                          </span>
                        </Button>
                        
                        <!-- Loading State -->
                        <Button 
                          v-if="isLoadingAudio"
                          variant="ghost" 
                          size="sm"
                          class="audio-btn loading-btn"
                          disabled
                          title="Generating AI voice..."
                        >
                          <div class="loading-spinner"></div>
                          Loading Audio...
                        </Button>
                        
                        <!-- Pause/Resume Button -->
                        <Button 
                          @click="isPaused ? resumeSpeech() : pauseSpeech()"
                          v-if="isSpeaking"
                          variant="ghost" 
                          size="sm"
                          class="audio-btn pause-btn"
                          :title="isPaused ? 'Resume audio' : 'Pause audio'"
                        >
                          <Play class="h-4 w-4 mr-2" v-if="isPaused" />
                          <Pause class="h-4 w-4 mr-2" v-else />
                          {{ isPaused ? 'Resume' : 'Pause' }}
                        </Button>
                        
                        <!-- Stop Button -->
                        <Button 
                          @click="stopSpeech"
                          v-if="isSpeaking"
                          variant="ghost" 
                          size="sm"
                          class="audio-btn stop-btn"
                          title="Stop audio"
                        >
                          <Square class="h-4 w-4 mr-2" />
                          Stop
                        </Button>
                        
                        <Button 
                          @click="toggleMute"
                          v-if="isSpeaking"
                          variant="ghost" 
                          size="sm"
                          class="audio-btn"
                          :title="isMuted ? 'Unmute' : 'Mute'"
                        >
                          <VolumeX class="h-4 w-4" v-if="isMuted" />
                          <Volume2 class="h-4 w-4" v-else />
                        </Button>
                        
                        <!-- Voice Mode Toggle -->
                        <Button 
                          @click="toggleVoiceMode"
                          v-if="!isSpeaking && !isLoadingAudio"
                          variant="outline" 
                          size="sm"
                          class="voice-toggle-btn"
                          :title="useAIVoice ? 'Switch to Basic Browser Voice' : 'Switch to AI Voice (Human-like)'"
                        >
                          {{ useAIVoice ? '🔄 Basic' : '🧠 AI Voice' }}
                        </Button>
                        
                        <!-- Speed Control -->
                        <div v-if="isSpeaking" class="speed-control">
                          <span class="speed-label">Speed:</span>
                          <input 
                            type="range" 
                            v-model="speechRate"
                            min="0.5" 
                            max="1.5" 
                            step="0.1"
                            class="speed-slider"
                            @input="updateSpeechRate"
                            title="Adjust playback speed"
                          />
                          <span class="speed-value">{{ speechRate }}x</span>
                        </div>
                      </div>
                      
                      <div v-if="isSpeaking" class="audio-status">
                        <div class="audio-indicator">
                          <div class="audio-waves">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                          <span class="status-text">
                            Playing
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="article-content" v-html="selectedArticle.content"></div>
                  
                  <div class="article-tags">
                    <span 
                      v-for="tag in selectedArticle.tags" 
                      :key="tag" 
                      class="tag"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
                
                <div v-else class="empty-state">
                  <FileText class="empty-icon" />
                  <h3 class="empty-title">Select a note to read</h3>
                  <p class="empty-description">Choose from {{ articles.length }} personal notes and creative writings</p>
                </div>
              </div>
            </div>

            <!-- Research Journal Tab Content -->
            <div v-show="activeTab === 'research'" class="content-section">
              <div class="content-hero">
                <div class="content-icon-large">
                  <BookOpen class="h-12 w-12" />
                </div>
                <div>
                  <h3 class="text-2xl font-semibold">Research Journal</h3>
                  <p class="text-muted-foreground leading-relaxed">Academic contributions, research papers, and innovative technology explorations</p>
                </div>
              </div>
              
              <div class="content-card">
                <div class="content-status">
                  <span class="status-badge development">In Development</span>
                </div>
                <div class="content-features">
                  <div class="content-feature">
                    <ChevronRight class="feature-icon" />
                    <span>AI & Machine Learning research</span>
                  </div>
                  <div class="content-feature">
                    <ChevronRight class="feature-icon" />
                    <span>Agricultural technology studies</span>
                  </div>
                  <div class="content-feature">
                    <ChevronRight class="feature-icon" />
                    <span>Software engineering papers</span>
                  </div>
                  <div class="content-feature">
                    <ChevronRight class="feature-icon" />
                    <span>Innovation documentation</span>
                  </div>
                  <div class="content-feature">
                    <ChevronRight class="feature-icon" />
                    <span>Academic collaborations</span>
                  </div>
                </div>
                <Button variant="outline" disabled class="content-button">
                  In Development
                </Button>
              </div>
            </div>
          </div>
        </template>
      </Tabs>

      <div class="experience-section">
        <div class="timeline">
          <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem;">Experience Journey</h3>
          <div 
            v-for="(exp, index) in experienceHighlights"
            :key="index"
            class="timeline-item"
            :style="`animation-delay: ${0.5 + index * 0.1}s`"
          >
            <div class="timeline-marker">
              <div class="timeline-dot"></div>
              <div v-if="index < experienceHighlights.length - 1" class="timeline-line"></div>
            </div>
            <div class="timeline-content">
              <div class="timeline-header">
                <h4 class="timeline-title">{{ exp.title }}</h4>
                <span class="timeline-period">{{ exp.years }}</span>
              </div>
              <p class="timeline-description">{{ exp.description }}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem;">Quick Stats</h3>
          <div class="stats-grid">
            <div 
              v-for="(stat, index) in quickStats"
              :key="index"
              class="stat-card"
              :style="`animation-delay: ${0.7 + index * 0.1}s`"
            >
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Discord Community Section -->
      <div class="community-section">
        <div class="discord-card">
          <div class="discord-header">
            <div class="discord-icon-wrapper">
              <MessageCircle class="discord-icon" />
            </div>
            <div class="discord-title-section">
              <h3 class="discord-title">Join Our Developer Community</h3>
              <p class="discord-subtitle">Connect, Collaborate, Create</p>
            </div>
          </div>
          
          <div class="discord-content">
            <p class="discord-description">
              Be part of our growing community where developers share knowledge, collaborate on projects, 
              and stay updated with the latest in technology. Get help, offer support, and build lasting connections!
            </p>
            
            <Button 
              class="discord-button"
              @click="openDiscord"
            >
              <MessageCircle class="h-4 w-4 mr-2" />
              Join Discord Server
            </Button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Admin Panel -->
    <AdminAuth 
      :show-admin-panel="showAdminPanel"
      @close-admin-panel="closeAdminPanel"
      @notes-updated="handleNotesUpdated"
    />
  </section>
</template>

<script setup lang="ts">
/*
  Skills section displaying technical competencies and knowledge sharing
  Organized by categories with visual icons and badges
*/

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { API_ENDPOINTS } from '@/config/api'
import elevenLabsTTS from '@/services/elevenlabs-tts'
import { FileText, BookOpen, ChevronRight, MessageCircle, Search, Settings, Maximize, Minimize, Play, Pause, Square, Volume2, VolumeX } from 'lucide-vue-next'
import Progress from '@/components/ui/Progress.vue'
import Tabs from '@/components/ui/Tabs.vue'
import Button from '@/components/ui/Button.vue'
import AdminAuth from '@/components/AdminAuth.vue'

interface Article {
  id: number
  title: string
  snippet: string
  content: string
  category: string
  tags: string[]
  createdAt: Date
  readTime: number
}

const activeTab = ref('articles')
const searchQuery = ref('')
const selectedArticle = ref<Article | null>(null)
const isLoadingNotes = ref(false)
const showAdminPanel = ref(false)
const isNotesFullscreen = ref(false)

// Mobile drawer state
const isMobileDrawerOpen = ref(false)

// Speech Synthesis state
const isSpeaking = ref(false)
const isPaused = ref(false)
const isMuted = ref(false)
const speechRate = ref(0.85) // Slower rate for better comprehension
const speechVolume = ref(0.9)
const speechPitch = ref(0.95) // Slightly lower pitch for warmth
const currentSpeech = ref<SpeechSynthesisUtterance | null>(null)
const currentAudio = ref<HTMLAudioElement | null>(null)
const useAIVoice = ref(false) // Toggle between AI voice and browser voice - Defaulting to browser to avoid CORS issues
const isLoadingAudio = ref(false)

// Load notes from backend
async function loadNotesFromBackend() {
  try {
    const response = await fetch(API_ENDPOINTS.NOTES)
    if (response.ok) {
      const backendNotes = await response.json()
      
      // Map backend notes to frontend format
      const mappedNotes = backendNotes.map((note: any) => ({
        id: note.id,
        title: note.title,
        snippet: note.snippet,
        content: note.content || `<h2>${note.title}</h2><p>Content loading...</p>`,
        category: note.category,
        tags: note.tags || [],
        createdAt: new Date(note.created_at || Date.now()),
        readTime: note.read_time || 5
      }))
      
      // Update articles with backend data
      articles.value = mappedNotes.length > 0 ? mappedNotes : articles.value
      
      console.log('✅ Loaded notes from backend:', mappedNotes.length)
    } else {
      throw new Error('Failed to load notes')
    }
  } catch (error) {
    console.log('❌ Backend not available, using static notes')
    // Keep existing static articles as fallback
  } finally {
    isLoadingNotes.value = false
  }
}

// Personal notes and creative writings (fallback data)
const articles = ref([
  {
    id: 1,
    title: 'Square Peg, Round World',
    snippet: 'On being the odd one out in a world designed for everyone else...',
    content: `
      <h2>Square Peg, Round World</h2>
      <p><em>Written after another day of not fitting in</em></p>
      
      <p>I've always been the square trying to fit into the circle.</p>
      
      <p>While everyone else seemed to know the unwritten rules of existence, I was still reading the manual. While they moved in synchronized herds, I wandered off the trail, getting lost in questions they never seemed to ask.</p>
      
      <h3>The Trail Followers</h3>
      
      <p>Watch them sometimes. How effortlessly they follow the path carved by those before them. College, job, marriage, house, kids, retirement. Each milestone checked off like items on a grocery list. They seem so certain, so content with the predetermined route.</p>
      
      <p>And here I am, standing at every crossroads, paralyzed by possibilities. Is this the right way? Who decided it was right? What if there's another path just beyond those trees? What if I'm meant to create my own trail entirely?</p>
      
      <h3>The Weight of Questions</h3>
      
      <p>They call it overthinking, but I call it thorough thinking. While they accept things as they are, I'm constantly asking why. Why do we work jobs that drain our souls? Why do we pretend to be happy when we're drowning? Why do we follow rules we never agreed to?</p>
      
      <p>The questions follow me everywhere. In crowded restaurants, I wonder why we pay so much to eat food we could make better at home. At parties, I watch people perform versions of themselves and wonder who they are when no one's looking. During job interviews, I question why we've agreed to this strange ritual of pretending our greatest weakness is "caring too much."</p>
      
      <h3>The Loneliness of Being Different</h3>
      
      <p>Being a square peg isn't noble or romantic. Most days it's just lonely. You learn to smile and nod when people talk about things that seem meaningless to you. You learn to suppress the questions that make others uncomfortable. You learn to pretend the round holes fit just fine.</p>
      
      <p>But sometimes, in quiet moments, you meet another square. Someone else who stopped following the trail to build something new. Someone else who carries the weight of wondering if they're crazy or if everyone else is just asleep.</p>
      
      <h3>The Gift and the Curse</h3>
      
      <p>Being different is both a gift and a curse. The same mind that refuses to accept "that's just how things are" is also the mind that creates solutions no one thought possible. The same person who can't follow the crowd is also the one who might lead it somewhere better.</p>
      
      <p>I've stopped trying to be round. The world has enough circles. Maybe what it needs is a few more squares, a few more people willing to question the trail everyone else is following blindly.</p>
      
      <p>Maybe being lost isn't a flaw - maybe it's a feature.</p>
      
      <p><em>In a world of copy and paste, be an original thought.</em></p>
    `,
    category: 'Identity',
    tags: ['Being Different', 'Society', 'Questions', 'Loneliness'],
    createdAt: new Date('2024-01-08'),
    readTime: 6
  },
  {
    id: 2,
    title: 'The Man Who Collected Shadows',
    snippet: 'A story I wrote about a peculiar man I met at the train station who changed how I see the world...',
    content: `
      <h2>The Man Who Collected Shadows</h2>
      <p><em>A true story from Bangalore City Railway Station - or at least, I think it was true</em></p>
      
      <p>I was waiting for the 7:15 train to Mysore when I noticed him.</p>
      
      <p>He sat on the opposite bench, perfectly still, watching the shadows cast by people walking under the platform lights. But he wasn't people-watching - he was shadow-watching. His eyes followed the dark shapes on the ground with an intensity that made me forget about my delayed train.</p>
      
      <h3>The Conversation</h3>
      
      <p>Curiosity won over social anxiety. I walked over and asked what he was doing.</p>
      
      <p>"Collecting shadows," he said simply, as if it was the most normal thing in the world. "Each one tells a different story than the person casting it."</p>
      
      <p>He pointed to a businessman hurrying past. "See how his shadow drags behind him? He's running from something, not toward it. But the man himself - he'll tell you he's ambitious, driven, successful."</p>
      
      <p>Then he gestured toward a young couple walking slowly. "Their shadows intertwine before they do. They'll be together for a long time, but they don't know it yet. They're still pretending this is casual."</p>
      
      <h3>The Revelation</h3>
      
      <p>"Shadows don't lie," he continued. "They can't pretend, can't perform, can't put on masks. A shadow is just the truth of your shape in the world, nothing more, nothing less."</p>
      
      <p>He had been collecting these shadow-stories for three years, he told me. Not writing them down, just watching, remembering. Building a library of human truths that only existed in the spaces between light and ground.</p>
      
      <p>"Why?" I asked.</p>
      
      <p>"Because everyone's so busy being the person they think they should be, they forget who they actually are. But their shadow remembers."</p>
      
      <h3>My Shadow</h3>
      
      <p>Then he looked at me, really looked at me. "Your shadow is interesting," he said. "It's sharp, defined, but it keeps changing size. Sometimes bigger than you, sometimes smaller. You're still figuring out how much space you're allowed to take up in the world."</p>
      
      <p>I looked down at my shadow stretched across the platform tiles. He was right. I had been making myself smaller lately, trying to fit into spaces that weren't meant for me.</p>
      
      <h3>The Train</h3>
      
      <p>My train finally arrived. As I got up to leave, he said, "Pay attention to your shadow for the next week. See what it teaches you about yourself."</p>
      
      <p>I never saw him again. Sometimes I wonder if I imagined the whole thing.</p>
      
      <h3>What I Learned</h3>
      
      <p>I did what he suggested. For a week, I watched my shadow. I noticed how it shrank when I was nervous, how it seemed to reach forward when I was excited about something, how it fell behind me when I was trying to escape.</p>
      
      <p>Now I look at shadows differently. Not just as absence of light, but as presence of truth. In a world full of filters and performances, shadows remain honest.</p>
      
      <p>Maybe we all need shadow collectors - people who see past the person we're trying to be to the person we actually are.</p>
      
      <p><em>Sometimes the most profound conversations happen with strangers you'll never see again.</em></p>
    `,
    category: 'Story',
    tags: ['Stranger', 'Truth', 'Shadows', 'Human Nature'],
    createdAt: new Date('2024-01-18'),
    readTime: 7
  },
  {
    id: 3,
    title: 'The Thing About Belonging... [Draft]',
    snippet: 'Still figuring this out. Some thoughts on finding your place in the tech world when you feel like...',
    content: `
      <h2>The Thing About Belonging... [Draft]</h2>
      <p><em>Started writing this 3 days ago. Still not sure where it's going.</em></p>
      
      <p>I've been thinking a lot about belonging lately. Not the Instagram version where everyone looks confident and has their life figured out, but the real, messy kind where you're constantly wondering if you're in the right place.</p>
      
      <h3>The Conference That Changed Nothing (And Everything)</h3>
      
      <p>Went to this tech meetup last month. You know the type - everyone talking about their latest project, dropping terms like "microservices architecture" and "machine learning pipelines" like they're ordering coffee. I stood there with my drink, feeling like I was watching a movie where I knew the language but not the culture.</p>
      
      <p>But then this girl next to me whispered, "I have no idea what half these people are talking about." And suddenly I felt... less alone?</p>
      
      <p>Maybe that's what belonging is. Not having all the answers, but finding other people who are also comfortable with questions.</p>
      
      <h3>The Bangalore Tech Scene (Work in Progress)</h3>
      
      <p>This city is weird for someone like me. On one hand, it's supposed to be the Silicon Valley of India, right? Everyone's building the next big thing, funding is flowing, opportunities everywhere.</p>
      
      <p>But sometimes I walk through Koramangala or Indiranagar and feel like I'm watching someone else's life. All these confident people in branded hoodies talking about their startups over expensive coffee, while I'm still figuring out if I prefer Vue over React.</p>
      
      <p><em>[Note: Need to finish this thought. Something about how the city makes space for different kinds of belonging? The chai wallah who knows more about the neighborhood than the CEO living in the penthouse? IDK, still thinking...]</em></p>
      
      <h3>Code Communities vs. Real Communities</h3>
      
      <p>Online, I feel like I belong. Stack Overflow, GitHub, Discord servers - there's something about the anonymity that makes it easier to just... be yourself. Ask dumb questions. Share half-baked ideas. Admit when you don't know something.</p>
      
      <p>But in person? It's harder. Imposter syndrome hits different when you're looking someone in the eye.</p>
      
      <p>Although, funny thing - my neighbor (the one who codes with his window open like me) waved yesterday. First time in 8 months. Small victories, right?</p>
      
      <h3>[This Section Needs Work]</h3>
      
      <p>Something about how belonging isn't a destination but a practice? How you have to keep showing up even when you feel fake?</p>
      
      <p>Also want to write about that moment when you help a junior dev and suddenly realize you DO belong, you DO know things, you just can't see it because you're too close to your own experience.</p>
      
      <p><em>Ugh, this is getting too philosophical. Maybe delete this part?</em></p>
      
      <h3>Random Thoughts (To Organize Later)</h3>
      
      <p>- Belonging might be less about finding your tribe and more about creating spaces where others feel like they belong too<br/>
      - The developers I admire most are the ones who make others feel smart, not stupid<br/>
      - Maybe the real belonging was the bugs we fixed along the way<br/>
      - Need to stop ending every paragraph with a question mark?</p>
      
      <p><strong>[TO DO: Figure out what this note is actually about. Also buy milk.]</strong></p>
      
      <p><em>Last edited: 15 minutes ago. Previous saves: 27 times. I really need to finish my thoughts before starting new ones...</em></p>
    `,
    category: 'Draft',
    tags: ['Belonging', 'Tech Culture', 'Work in Progress', 'Bangalore'],
    createdAt: new Date('2024-02-07'),
    readTime: 4
  }
])

const filteredArticles = computed(() => {
  if (!searchQuery.value) return articles.value.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  
  const query = searchQuery.value.toLowerCase()
  return articles.value.filter(article =>
    article.title.toLowerCase().includes(query) ||
    article.snippet.toLowerCase().includes(query) ||
    article.tags.some(tag => tag.toLowerCase().includes(query)) ||
    article.category.toLowerCase().includes(query)
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
})

// Set most recent article as default selected (the unfinished draft)
const sortedArticles = articles.value.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
if (sortedArticles.length > 0) {
  selectedArticle.value = sortedArticles[0] // This will be the "Draft" note - most recent
}

// Load notes from backend on component mount
loadNotesFromBackend()

function selectArticle(article: Article) {
  selectedArticle.value = article
}

// Mobile drawer functions
function toggleMobileDrawer() {
  isMobileDrawerOpen.value = !isMobileDrawerOpen.value
  // Allow scrolling even when drawer is open for better UX
}

function closeMobileDrawer() {
  isMobileDrawerOpen.value = false
  // No need to restore overflow since we don't prevent it anymore
}

function selectMobileArticle(article: Article) {
  selectedArticle.value = article
  closeMobileDrawer() // Close drawer after selection
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const experienceHighlights = [
  {
    title: 'Full-Stack Developer',
    years: '2023-Present',
    description: 'Building modern web applications with focus on user experience and performance'
  },
  {
    title: 'Learning Journey',
    years: '2022-2023',
    description: 'Mastered JavaScript frameworks and backend technologies through projects'
  },
  {
    title: 'Getting Started',
    years: '2021-2022',
    description: 'Discovered passion for web development and started building first applications'
  }
]

const skillTabs = [
  { value: 'articles', label: 'Articles', icon: FileText },
  { value: 'research', label: 'Research', icon: BookOpen },
]

const quickStats = [
  { value: '12', label: 'Goals Achieved' },
  { value: '150+', label: 'Users Visited' }
]

const discordLink = 'https://discord.gg/FkSkanuMsQ'

function setActiveTab(value: string) {
  activeTab.value = value
  // No special mobile behavior - use same layout for all devices
}

function openDiscord() {
  window.open(discordLink, '_blank')
}

// Admin functions
function openAdminPanel() {
  showAdminPanel.value = true
}

function closeAdminPanel() {
  showAdminPanel.value = false
}

function handleNotesUpdated() {
  // Reload notes when admin makes changes
  loadNotesFromBackend()
}

function toggleNotesFullscreen() {
  // Ensure we're on the articles tab when entering fullscreen
  if (!isNotesFullscreen.value) {
    activeTab.value = 'articles'
  }
  
  isNotesFullscreen.value = !isNotesFullscreen.value
  
  // Add/remove fullscreen classes to body to handle scroll and other global styles
  if (isNotesFullscreen.value) {
    document.body.style.overflow = 'hidden'
    document.body.classList.add('notes-fullscreen')
    // Add escape key listener for fullscreen mode
    document.addEventListener('keydown', handleNotesEscapeKey)
  } else {
    document.body.style.overflow = ''
    document.body.classList.remove('notes-fullscreen')
    // Remove escape key listener
    document.removeEventListener('keydown', handleNotesEscapeKey)
  }
}

function handleNotesEscapeKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && isNotesFullscreen.value) {
    toggleNotesFullscreen()
  }
}

// Speech Synthesis Functions
// Helper function to set preferred voice (moved outside to avoid strict mode issues)
function setPreferredVoice(voices: SpeechSynthesisVoice[], utterance: SpeechSynthesisUtterance) {
      // Priority list of high-quality, natural-sounding voices
      const voicePriority = [
        // Premium quality voices (if available)
        'Microsoft Zira - English (United States)',
        'Microsoft Hazel - English (Great Britain)',
        'Google UK English Female',
        'Google US English Female',
        'Alex', // macOS
        'Samantha', // macOS
        'Victoria', // macOS
        'Karen', // older systems
        'Moira', // macOS Scottish
        'Fiona', // macOS Scottish
        // Fallback patterns
        'en-GB', 'en-US', 'en-AU'
      ]
      
      let selectedVoice = null
      
      // Try to find voices by exact name match first
      for (const voiceName of voicePriority) {
        selectedVoice = voices.find(voice => 
          voice.name.includes(voiceName) || voice.lang === voiceName
        )
        if (selectedVoice) break
      }
      
      // If no priority voice found, find any English female voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang.startsWith('en') && 
          (voice.name.toLowerCase().includes('female') || 
           voice.name.toLowerCase().includes('woman') ||
           !voice.name.toLowerCase().includes('male'))
        )
      }
      
      // Final fallback: any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith('en'))
      }
      
  if (selectedVoice) {
    utterance.voice = selectedVoice
        console.log('Selected voice:', selectedVoice.name, selectedVoice.lang)
      }
    }
    
function startSpeech(text: string) {
  if ('speechSynthesis' in window) {
    // Stop any current speech
    stopSpeech()
    
    const utterance = new SpeechSynthesisUtterance(text)
    currentSpeech.value = utterance
    
    // Configure speech settings for natural, soothing voice
    utterance.rate = speechRate.value
    utterance.volume = isMuted.value ? 0 : speechVolume.value
    utterance.pitch = speechPitch.value
    
    // Find a pleasant voice (prefer female voices for storytelling)
    let voices = speechSynthesis.getVoices()
    
    // If voices aren't loaded yet, wait for them
    if (voices.length === 0) {
      speechSynthesis.addEventListener('voiceschanged', () => {
        voices = speechSynthesis.getVoices()
        setPreferredVoice(voices, utterance)
      })
    } else {
      setPreferredVoice(voices, utterance)
    }
    
    // Configure utterance events
    utterance.onstart = () => {
      isSpeaking.value = true
      isPaused.value = false
    }
    
    utterance.onend = () => {
      isSpeaking.value = false
      isPaused.value = false
      currentSpeech.value = null
    }
    
    utterance.onerror = () => {
      isSpeaking.value = false
      isPaused.value = false
      currentSpeech.value = null
    }
    
    // Start speaking
    speechSynthesis.speak(utterance)
  }
}

function pauseSpeech() {
  if (useAIVoice.value) {
    pauseAIVoice()
  } else if (speechSynthesis.speaking && !speechSynthesis.paused) {
    speechSynthesis.pause()
    isPaused.value = true
  }
}

function resumeSpeech() {
  if (useAIVoice.value) {
    resumeAIVoice()
  } else if (speechSynthesis.paused) {
    speechSynthesis.resume()
    isPaused.value = false
  }
}

function stopSpeech() {
  if (useAIVoice.value) {
    stopAIVoice()
  } else {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel()
    }
    isSpeaking.value = false
    isPaused.value = false
    currentSpeech.value = null
  }
}

function toggleVoiceMode() {
  useAIVoice.value = !useAIVoice.value
  stopSpeech() // Stop current playback when switching
}

function toggleMute() {
  isMuted.value = !isMuted.value
  if (useAIVoice.value) {
    elevenLabsTTS.setVolume(isMuted.value ? 0 : speechVolume.value)
  } else if (currentSpeech.value) {
    currentSpeech.value.volume = isMuted.value ? 0 : speechVolume.value
  }
}

function updateSpeechRate() {
  if (useAIVoice.value) {
    elevenLabsTTS.setPlaybackRate(speechRate.value)
  } else if (currentSpeech.value) {
    currentSpeech.value.rate = speechRate.value
  }
}

// 🎤 AI VOICE SYSTEM
// ==================
// Professional-grade AI voice synthesis
// ✅ Ultra-realistic human voices
// ✅ Natural expression and emotion
// ✅ Premium voice quality

async function startAIVoice(text: string, noteId?: string) {
  stopSpeech() // Stop any current playback
  
  if (text.length > 5000) {
    // If text is too long, break it into chunks
    await playTextInChunks(text, noteId)
    return
  }
  
  isLoadingAudio.value = true
  isSpeaking.value = true
  
  try {
    await elevenLabsTTS.speakSmart(text, noteId, {
      voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel - natural female voice
      stability: 0.5,
      similarityBoost: 0.75,
      style: 0,
      useSpeakerBoost: true
    })
  } catch (error) {
    console.warn('AI voice failed due to CORS or API issues, falling back to browser TTS:', error)
    // Automatically disable AI voice to prevent future CORS errors
    useAIVoice.value = false
    startSpeech(text)
  } finally {
    isLoadingAudio.value = false
    isSpeaking.value = false
  }
}

async function generateSpeech(text: string): Promise<string | null> {
  // Use AI voice for speech generation
  try {
    return await elevenLabsTTS.generateSpeech(text, {
      voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel - natural female voice
      stability: 0.5,
      similarityBoost: 0.75,
      style: 0,
      useSpeakerBoost: true
    })
  } catch (error) {
    console.warn('AI speech generation failed:', error)
  return null
}
}

// AI voice functions are handled by the service

// AI voice service handles all voice generation internally

async function playAudioFromUrl(audioUrl: string) {
  return new Promise<void>((resolve, reject) => {
    const audio = new Audio(audioUrl)
    currentAudio.value = audio
    
    audio.volume = isMuted.value ? 0 : speechVolume.value
    audio.playbackRate = speechRate.value
    
    audio.onloadstart = () => {
      isSpeaking.value = true
      isPaused.value = false
    }
    
    audio.onended = () => {
      isSpeaking.value = false
      isPaused.value = false
      currentAudio.value = null
      URL.revokeObjectURL(audioUrl) // Clean up
      resolve()
    }
    
    audio.onerror = (error) => {
      isSpeaking.value = false
      isPaused.value = false
      currentAudio.value = null
      URL.revokeObjectURL(audioUrl)
      reject(error)
    }
    
    audio.play()
  })
}

async function playTextInChunks(text: string, noteId?: string) {
  // Break long text into sentences for better performance
  const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text]
  
  for (const sentence of sentences) {
    if (!isSpeaking.value) break // Stop if user stopped playback
    
    try {
      await elevenLabsTTS.speakSmart(sentence.trim(), noteId, {
        voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel - natural female voice
        stability: 0.5,
        similarityBoost: 0.75,
        style: 0,
        useSpeakerBoost: true
      })
    } catch (error) {
      console.warn('Chunk playback failed:', error)
    }
  }
}

function pauseAIVoice() {
  elevenLabsTTS.pause()
    isPaused.value = true
  isSpeaking.value = true
}

function resumeAIVoice() {
  elevenLabsTTS.resume()
    isPaused.value = false
  isSpeaking.value = true
}

function stopAIVoice() {
  elevenLabsTTS.stop()
  isSpeaking.value = false
  isPaused.value = false
  isLoadingAudio.value = false
}

async function playSelectedArticle() {
  if (!selectedArticle.value) return
  
  // Use article ID for smart caching
  const noteId = selectedArticle.value.id?.toString()
  
  // Create comprehensive text for storytelling
  let textToSpeak = `${selectedArticle.value.title}.`
  
  // Add content if available, otherwise use snippet
  if (selectedArticle.value.content) {
    // Remove HTML tags and clean up the content
    const cleanContent = selectedArticle.value.content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\n\s*\n/g, '\n\n') // Normalize line breaks
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&[a-zA-Z]+;/g, '') // Remove other HTML entities
      .trim()
    textToSpeak += ` ${cleanContent}`
  } else if (selectedArticle.value.snippet) {
    textToSpeak += ` ${selectedArticle.value.snippet}`
  }
  
  // Enhanced text processing for natural storytelling
  textToSpeak = processTextForSpeech(textToSpeak)
  
  // Try AI voice first with smart caching, fallback to browser voice
  if (useAIVoice.value) {
    try {
      await startAIVoice(textToSpeak, noteId)
    } catch (error) {
      console.warn('AI voice failed due to CORS or API issues, falling back to browser voice:', error)
      // Automatically switch to browser voice and try again
      useAIVoice.value = false
      startSpeech(textToSpeak)
    }
  } else {
    startSpeech(textToSpeak)
  }
}

function processTextForSpeech(text: string): string {
  return text
    // Add natural pauses after sentences
    .replace(/\. /g, '.   ')
    .replace(/\? /g, '?   ')
    .replace(/! /g, '!   ')
    
    // Add breathing pauses after paragraphs
    .replace(/\n\n/g, '.     ')
    
    // Handle common abbreviations to sound more natural
    .replace(/\bDr\./g, 'Doctor')
    .replace(/\bMr\./g, 'Mister')
    .replace(/\bMs\./g, 'Mizz')
    .replace(/\bMrs\./g, 'Missus')
    .replace(/\bprof\./gi, 'Professor')
    .replace(/\betc\./gi, 'etcetera')
    .replace(/\bi\.e\./gi, 'that is')
    .replace(/\be\.g\./gi, 'for example')
    
    // Handle numbers and dates more naturally
    .replace(/(\d{4})/g, (match) => {
      const year = parseInt(match)
      if (year > 1900 && year < 2100) {
        return match // Keep years as is for natural pronunciation
      }
      return match
    })
    
    // Add emphasis pauses before important words
    .replace(/\b(however|therefore|moreover|furthermore|nevertheless|consequently)\b/gi, '   $1')
    
    // Handle quotations more naturally
    .replace(/"/g, '') // Remove quotation marks as they don't add to speech
    
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    .trim()
}

onMounted(() => {
  loadNotesFromBackend()
})

onUnmounted(() => {
  // Cleanup fullscreen state when component is destroyed
  if (isNotesFullscreen.value) {
    document.body.style.overflow = ''
    document.body.classList.remove('notes-fullscreen')
    document.removeEventListener('keydown', handleNotesEscapeKey)
  }
  
  // Cleanup mobile drawer state
  if (isMobileDrawerOpen.value) {
    document.body.style.overflow = ''
  }
  
  // Stop any ongoing speech and cleanup audio
  stopSpeech()
  if (currentAudio.value) {
    currentAudio.value.pause()
    currentAudio.value = null
  }
})
</script>

<style>
/* All existing styles preserved, just adding new content-specific styles */

/* Section Title Spacing */
.section-title {
  margin-bottom: 2.5rem !important;
}

/* Add spacing below main content sections */
.skills-content {
  margin-bottom: 4rem;
}

.experience-section {
  margin-bottom: 4rem;
  padding-top: 2rem;
}

/* Apple Notes Style Interface */
.apple-notes-container {
  display: flex;
  height: 70vh;
  margin-bottom: 2rem;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e5e7;
  transition: all 0.3s ease;
}

/* Responsive Fullscreen Mode - Base styles */
.apple-notes-container.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100vw !important;
  height: 100dvh !important; /* Dynamic viewport height - better for mobile */
  min-height: 100vh !important; /* Fallback for browsers without dvh support */
  max-height: 100vh !important; /* Prevent overflow above screen */
  max-width: none !important; /* Override parent container constraints */
  z-index: 10000 !important;
  margin: 0 !important;
  padding: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  border: none !important;
  background: #ffffff !important;
  overflow: hidden !important; /* Prevent any content overflow */
}

/* Ensure fullscreen container escapes parent constraints completely */
.portfolio-container:has(.apple-notes-container.fullscreen) {
  max-width: none !important;
  overflow: visible !important;
  position: relative !important;
}

/* Alternative fallback for browsers without :has() support */
.portfolio-section:has(.apple-notes-container.fullscreen) {
  max-width: none !important;
  overflow: visible !important;
}

/* Force fullscreen on larger screens to use full viewport */
@media (min-width: 1201px) {
  .apple-notes-container.fullscreen {
    width: 100vw !important;
    height: 100vh !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
  }
}

/* Desktop fullscreen - side-by-side layout (only for larger screens) */
@media (min-width: 769px) {
  .apple-notes-container.fullscreen {
    flex-direction: row !important; /* Side-by-side layout for desktop */
  }
}

/* iOS Safari specific fixes */
@supports (-webkit-touch-callout: none) {
  .apple-notes-container.fullscreen {
    height: 100svh !important; /* Small viewport height for iOS Safari */
  }
}

/* Mobile responsive adjustments for fullscreen */
@media (max-width: 480px) {
  .apple-notes-container.fullscreen {
    /* Use smaller viewport unit on mobile to avoid browser UI issues */
    height: 100svh !important;
    min-height: -webkit-fill-available !important;
    /* Keep the same mobile drawer layout in fullscreen */
    flex-direction: column !important;
    margin: 0 !important;
    border-radius: 0 !important;
    overflow: hidden !important;
  }
  
  /* Fullscreen mobile still uses drawer interface */
  .apple-notes-container.fullscreen .mobile-notes-header {
    display: flex !important;
    background: #f8f9fa !important;
    border-bottom: 1px solid #e5e5e7 !important;
  }
  
  .apple-notes-container.fullscreen .mobile-drawer-overlay {
    display: block !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    z-index: 10001 !important;
    background: rgba(0, 0, 0, 0.5) !important;
  }
  
  .apple-notes-container.fullscreen .mobile-notes-drawer {
    display: flex !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 300px !important;
    height: 100vh !important;
    z-index: 10002 !important;
    background: #ffffff !important;
    transform: translateX(-100%) !important;
    transition: transform 0.3s ease !important;
  }
  
  .apple-notes-container.fullscreen .mobile-notes-drawer.open {
    transform: translateX(0) !important;
  }
  
  /* Ensure drawer content is visible in fullscreen */
  .apple-notes-container.fullscreen .drawer-notes-list {
    background: #ffffff !important;
    color: #1d1d1f !important;
  }
  
  .apple-notes-container.fullscreen .drawer-note-item {
    color: #1d1d1f !important;
    background: transparent !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
  }
  
  .apple-notes-container.fullscreen .drawer-note-title {
    color: #1d1d1f !important;
  }
  
  .apple-notes-container.fullscreen .drawer-note-snippet {
    color: #86868b !important;
  }
  
  .apple-notes-container.fullscreen .drawer-note-date {
    color: #86868b !important;
  }
  
  .apple-notes-container.fullscreen .drawer-loading {
    color: #86868b !important;
  }
  
  .apple-notes-container.fullscreen .drawer-empty-state {
    color: #1d1d1f !important;
  }
  
  .apple-notes-container.fullscreen .drawer-empty-state h3 {
    color: #1d1d1f !important;
  }
  
  .apple-notes-container.fullscreen .drawer-title {
    color: #1d1d1f !important;
  }
  
  .apple-notes-container.fullscreen .drawer-count {
    color: #86868b !important;
    background: rgba(0, 0, 0, 0.05) !important;
  }
  
  .apple-notes-container.fullscreen .drawer-search-input {
    color: #1d1d1f !important;
    background: #f0f0f0 !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
  }
  
  .apple-notes-container.fullscreen .drawer-search-input::placeholder {
    color: #86868b !important;
  }
  
  .apple-notes-container.fullscreen .desktop-sidebar {
    display: none !important;
  }
  
  /* Mobile fullscreen content adjustments */
  .apple-notes-container.fullscreen .notes-content {
    flex: 1 !important;
    height: calc(100svh - 80px) !important;
    max-height: calc(100svh - 80px) !important;
    background: #1a1a1a !important;
    color: #ffffff !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }
  
  /* Enhanced typography for mobile fullscreen */
  .apple-notes-container.fullscreen .article-title {
    font-size: 1.75rem !important;
    font-weight: 800 !important;
    margin-bottom: 1.25rem !important;
    line-height: 1.2 !important;
    color: #ffffff !important;
  }
  
  .apple-notes-container.fullscreen .article-content {
    font-size: 1.1875rem !important;
    line-height: 1.75 !important;
    color: #ffffff !important;
  }
  
  .apple-notes-container.fullscreen .article-view {
    padding: 2rem 1.5rem !important;
  }
  
    .apple-notes-container.fullscreen .article-content h2 {
    font-size: 1.5rem !important;
    color: #ffffff !important;
    margin: 2.5rem 0 1.25rem 0 !important;
  }

  .apple-notes-container.fullscreen .article-content h3 {
    font-size: 1.375rem !important;
    color: #ffffff !important;
    margin: 2rem 0 1rem 0 !important;
  }

  .apple-notes-container.fullscreen .article-content p {
    margin-bottom: 1.375rem !important;
    color: #ffffff !important;
  }

  .apple-notes-container.fullscreen .article-content em {
    color: #cccccc !important;
  }
  
  .apple-notes-container.fullscreen .article-meta {
    color: #cccccc !important;
  }
  
  .apple-notes-container.fullscreen .article-date {
    color: #cccccc !important;
  }
}

/* Tablet responsive adjustments for fullscreen */
@media (min-width: 481px) and (max-width: 768px) {
  .apple-notes-container.fullscreen {
    height: 100svh !important;
    min-height: -webkit-fill-available !important;
    /* Use stacked layout on tablets too for better usability */
    flex-direction: column !important;
  }
  
  .apple-notes-container.fullscreen .notes-sidebar {
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    height: 240px !important;
    max-height: 240px !important;
    border-right: none !important;
    border-bottom: 1px solid #e5e5e7 !important;
  }
  
  .apple-notes-container.fullscreen .notes-content {
    flex: 1 !important;
    height: calc(100svh - 240px) !important;
    max-height: calc(100svh - 240px) !important;
    background: #ffffff !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }
  
  .apple-notes-container.fullscreen .article-view {
    padding: 2rem 1.5rem !important;
  }
}

/* Desktop Fullscreen Layout - side-by-side layout (769px and up only) */
@media (min-width: 769px) {
  .apple-notes-container.fullscreen .notes-sidebar {
    width: 350px !important; /* Fixed width for sidebar in fullscreen */
    min-width: 350px !important;
    max-width: 350px !important;
    height: 100% !important;
    border-right: 1px solid #e5e5e7 !important;
    border-bottom: none !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
    flex-shrink: 0 !important;
  }

  .apple-notes-container.fullscreen .notes-content {
    flex: 1 !important;
    height: 100% !important;
    max-height: 100% !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }

  .apple-notes-container.fullscreen .article-content {
    height: auto !important;
    max-height: none !important;
    overflow-y: visible !important;
  }
}

/* Enhanced typography for desktop fullscreen mode (769px and up only) */
@media (min-width: 769px) {
  .apple-notes-container.fullscreen .notes-title {
    font-size: 1.25rem !important;
    font-weight: 700 !important;
  }

  .apple-notes-container.fullscreen .notes-count {
    font-size: 0.875rem !important;
  }

  .apple-notes-container.fullscreen .note-title {
    font-size: 1.0625rem !important;
    font-weight: 600 !important;
  }

  .apple-notes-container.fullscreen .note-snippet {
    font-size: 0.9375rem !important;
    line-height: 1.5 !important;
  }

  .apple-notes-container.fullscreen .article-title {
    font-size: 2rem !important;
    font-weight: 700 !important;
    line-height: 1.2 !important;
    margin-bottom: 1.5rem !important;
  }

  .apple-notes-container.fullscreen .article-meta {
    font-size: 0.9375rem !important;
    margin-bottom: 2rem !important;
  }

  .apple-notes-container.fullscreen .article-content {
    font-size: 1.125rem !important;
    line-height: 1.7 !important;
  }

  .apple-notes-container.fullscreen .article-content h2 {
    font-size: 1.75rem !important;
    margin: 3rem 0 1.5rem 0 !important;
  }

  .apple-notes-container.fullscreen .article-content h3 {
    font-size: 1.5rem !important;
    margin: 2.5rem 0 1rem 0 !important;
  }

  .apple-notes-container.fullscreen .article-content p {
    margin-bottom: 1.5rem !important;
  }

  .apple-notes-container.fullscreen .article-view {
    padding: 2.5rem 3rem !important;
  }
}

.fullscreen-btn {
  background: transparent !important;
  border: 1px solid transparent !important;
  color: hsl(var(--muted-foreground)) !important;
  border-radius: 8px !important;
  width: 36px !important;
  height: 36px !important;
  min-width: 36px !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.15s ease !important;
  opacity: 0.8;
  touch-action: manipulation !important;
}

.fullscreen-btn:hover {
  background: hsl(var(--muted)/0.8) !important;
  color: hsl(var(--foreground)) !important;
  border-color: hsl(var(--border)) !important;
  opacity: 1;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.fullscreen-btn:active {
  background: hsl(var(--muted)) !important;
  transform: scale(0.95);
}

/* Dark mode support for fullscreen button */
@media (prefers-color-scheme: dark) {
  .fullscreen-btn {
    color: #8e8e93 !important;
  }
  
  .fullscreen-btn:hover {
    background: rgba(255, 255, 255, 0.1) !important;
    color: #ffffff !important;
    border-color: rgba(255, 255, 255, 0.2) !important;
  }
  
  .fullscreen-btn:active {
    background: rgba(255, 255, 255, 0.15) !important;
  }
}

/* Audio Player Styles */
.audio-player {
  margin-top: 20px;
  padding: 16px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.audio-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.audio-btn {
  background: hsl(var(--muted)/0.5) !important;
  border: 1px solid hsl(var(--border)) !important;
  color: hsl(var(--muted-foreground)) !important;
  border-radius: 8px !important;
  height: 36px !important;
  padding: 0 12px !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
}

.audio-btn:hover {
  background: hsl(var(--muted)) !important;
  color: hsl(var(--foreground)) !important;
  border-color: hsl(var(--border)) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.play-btn {
  background: hsl(var(--primary)) !important;
  color: hsl(var(--primary-foreground)) !important;
  border-color: hsl(var(--primary)) !important;
}

.play-btn:hover {
  background: hsl(var(--primary)/0.9) !important;
  color: hsl(var(--primary-foreground)) !important;
}

.stop-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626) !important;
  color: white !important;
  border: 2px solid rgba(239, 68, 68, 0.3) !important;
  transition: all 0.2s ease;
}

.stop-btn:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.audio-badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 6px;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
}

.audio-badge.ai-voice {
  background: linear-gradient(45deg, #4285f4, #34a853, #ea4335, #fbbc05);
  background-size: 200% 200%;
  animation: gemini-gradient 3s ease infinite;
  color: white;
  box-shadow: 0 2px 8px rgba(66, 133, 244, 0.4);
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.audio-badge.browser-voice {
  background: rgba(75, 85, 99, 0.3);
  color: inherit;
}

.loading-btn {
  opacity: 0.7;
  cursor: not-allowed !important;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid hsl(var(--muted));
  border-top: 2px solid hsl(var(--primary));
  border-radius: 50%;
  margin-right: 8px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes gemini-gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.voice-toggle-btn {
  background: hsl(var(--muted)/0.5) !important;
  border: 1px solid hsl(var(--border)) !important;
  color: hsl(var(--foreground)) !important;
  font-size: 0.8rem !important;
  font-weight: 600 !important;
  min-width: 60px !important;
  transition: all 0.2s ease !important;
}

.voice-toggle-btn:hover {
  background: linear-gradient(45deg, #4285f4, #34a853, #ea4335, #fbbc05) !important;
  background-size: 200% 200%;
  animation: gemini-gradient 2s ease infinite;
  color: white !important;
  border-color: transparent !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(66, 133, 244, 0.4);
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 12px;
  padding: 8px;
  background: hsl(var(--muted)/0.3);
  border-radius: 8px;
  border: 1px solid hsl(var(--border));
}

.speed-label, .speed-value {
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
  font-weight: 500;
  min-width: fit-content;
}

.speed-slider {
  width: 80px;
  height: 4px;
  background: hsl(var(--muted));
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.speed-slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  background: hsl(var(--primary));
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.speed-slider::-webkit-slider-thumb:hover {
  background: hsl(var(--primary)/0.8);
  transform: scale(1.1);
}

.speed-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: hsl(var(--primary));
  border-radius: 50%;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.speed-slider::-moz-range-thumb:hover {
  background: hsl(var(--primary)/0.8);
  transform: scale(1.1);
}

.audio-status {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.audio-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-text {
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
  font-weight: 500;
}

.audio-waves {
  display: flex;
  align-items: end;
  gap: 2px;
  height: 16px;
}

.audio-waves span {
  width: 3px;
  background: hsl(var(--primary));
  border-radius: 2px;
  animation: audio-wave 1.4s ease-in-out infinite;
}

.audio-waves span:nth-child(2) {
  animation-delay: 0.2s;
}

.audio-waves span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes audio-wave {
  0%, 40%, 100% {
    height: 4px;
    opacity: 0.6;
  }
  20% {
    height: 16px;
    opacity: 1;
  }
}

/* Dark mode support for audio player */
@media (prefers-color-scheme: dark) {
  .audio-player {
    border-top-color: rgba(255, 255, 255, 0.1);
  }
  
  .audio-btn {
    background: rgba(255, 255, 255, 0.1) !important;
    border-color: rgba(255, 255, 255, 0.2) !important;
    color: #ffffff !important;
  }
  
  .audio-btn:hover {
    background: rgba(255, 255, 255, 0.15) !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  .status-text {
    color: #8e8e93;
  }
  
  .audio-badge {
    background: rgba(0, 0, 0, 0.3);
    color: inherit;
  }
  
  .speed-control {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
  }
  
  .speed-slider {
    background: rgba(255, 255, 255, 0.2);
  }
}

/* Mobile responsive audio player */
@media (max-width: 768px) {
  .audio-player {
    margin-top: 16px;
    padding: 12px 0;
  }
  
  .audio-controls {
    flex-wrap: wrap;
    gap: 6px;
  }
  
  .audio-btn {
    height: 32px !important;
    padding: 0 8px !important;
    font-size: 0.8rem !important;
  }
  
  .audio-btn .h-4 {
    width: 14px !important;
    height: 14px !important;
  }
}

/* Extra small screens - even smaller buttons */
@media (max-width: 480px) {
  .audio-btn {
    height: 28px !important;
    padding: 0 6px !important;
    font-size: 0.75rem !important;
  }
  
  .audio-btn .h-4 {
    width: 12px !important;
    height: 12px !important;
  }
  
  .audio-badge {
    font-size: 0.6rem !important;
    padding: 1px 4px !important;
    margin-left: 4px !important;
  }
  
  .voice-toggle-btn {
    font-size: 0.7rem !important;
    min-width: 50px !important;
    padding: 0 6px !important;
  }
  
  .loading-btn {
    font-size: 0.7rem !important;
  }
  
  .loading-spinner {
    width: 12px !important;
    height: 12px !important;
    margin-right: 6px !important;
  }
  
  .speed-control {
    margin-left: 0 !important;
    margin-top: 8px !important;
    width: 100% !important;
    padding: 6px !important;
  }
  
  .speed-slider {
    flex: 1 !important;
    width: auto !important;
  }
  
  .audio-status {
    margin-top: 8px;
  }
  
  .status-text {
    font-size: 0.8rem;
  }
}

/* Fade-in animation for audio controls */
.audio-player {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.notes-sidebar {
  width: 320px;
  background: #f5f5f7;
  border-right: 1px solid #e5e5e7;
  display: flex;
  flex-direction: column;
}

.notes-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px 12px;
  border-bottom: 1px solid #e5e5e7;
}

.notes-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-btn {
  padding: 6px;
  border-radius: 6px;
  color: #86868b;
  transition: all 0.2s ease;
}

.admin-btn:hover {
  background: #e5e5e7;
  color: #1d1d1f;
}

.notes-title {
  font-size: 22px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
}

.notes-count {
  font-size: 14px;
  color: #86868b;
  background: #e5e5e7;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.search-container {
  position: relative;
  margin: 12px 16px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #86868b;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: none;
  background: #ffffff;
  border-radius: 8px;
  font-size: 14px;
  color: #1d1d1f;
  outline: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.search-input:focus {
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.2);
}

.search-input::placeholder {
  color: #86868b;
}

.notes-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.note-item {
  padding: 16px;
  cursor: pointer;
  border-bottom: 1px solid #e5e5e7;
  transition: all 0.2s ease;
  position: relative;
}

.note-item:hover {
  background: #e8e8ed;
}

.note-item.active {
  background: #007aff;
  color: white;
}

.note-item.active .note-title,
.note-item.active .note-snippet,
.note-item.active .note-date,
.note-item.active .note-tag {
  color: white;
}

.note-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #ffffff;
}

.note-preview {
  pointer-events: none;
}

.note-title {
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 6px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}

.note-snippet {
  font-size: 14px;
  color: #86868b;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}

.note-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.note-date {
  font-size: 12px;
  color: #86868b;
  font-weight: 500;
}

.note-tag {
  font-size: 12px;
  background: #e5e5e7;
  color: #86868b;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.notes-content {
  flex: 1;
  background: #ffffff;
  overflow-y: auto;
  position: relative;
}

.article-view {
  padding: 32px 40px;
  max-width: 700px;
  margin: 0 auto;
}

.article-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f5f5f7;
}

.article-title {
  font-size: 28px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.article-date,
.article-category,
.article-read-time {
  font-size: 14px;
  color: #86868b;
  font-weight: 500;
}

.article-category {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.article-category:is([class*="Poetry"]) {
  background: #ff6b9d;
}

.article-category:is([class*="Life"]) {
  background: #4ecdc4;
}

.article-category:is([class*="Thoughts"]) {
  background: #a8e6cf;
  color: #2c3e50;
}

.article-category:is([class*="Personal"]) {
  background: #ffd93d;
  color: #2c3e50;
}

.article-category:is([class*="Philosophy"]) {
  background: #6c5ce7;
}

.article-category:is([class*="Humor"]) {
  background: #fd79a8;
}

.article-category:is([class*="Draft"]) {
  background: #fdcb6e;
  color: #2c3e50;
  position: relative;
}

.article-category:is([class*="Draft"])::after {
  content: " ✏️";
}

.article-category:is([class*="Memory"]) {
  background: #74b9ff;
}

.article-category:is([class*="Identity"]) {
  background: #e84393;
}

.article-category:is([class*="Story"]) {
  background: #00b894;
}

.article-content {
  color: #1d1d1f;
  line-height: 1.6;
  font-size: 16px;
}

.article-content h2 {
  font-size: 22px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 32px 0 16px 0;
  line-height: 1.3;
}

.article-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 24px 0 12px 0;
  line-height: 1.3;
}

.article-content p {
  margin: 0 0 16px 0;
}

.article-content ul,
.article-content ol {
  margin: 0 0 16px 0;
  padding-left: 24px;
}

.article-content li {
  margin: 8px 0;
}

.article-content code {
  background: #f5f5f7;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 14px;
  color: #d73a49;
}

.article-content strong {
  font-weight: 600;
  color: #1d1d1f;
}

.article-tags {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f5f5f7;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #f5f5f7;
  color: #1d1d1f;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.tag:hover {
  background: #e5e5e7;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #86868b;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 8px 0;
}

.empty-description {
  font-size: 16px;
  color: #86868b;
  margin: 0;
}

.content-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .apple-notes-container {
    background: #1c1c1e;
    border-color: #38383a;
  }
  
  .notes-sidebar {
    background: #2c2c2e;
    border-color: #38383a;
  }
  
  .notes-header {
    border-color: #38383a;
  }
  
  .notes-title {
    color: #ffffff;
  }
  
  .notes-count {
    background: #48484a;
    color: #aeaeb2;
  }
  
  .search-input {
    background: #1c1c1e;
    color: #ffffff;
  }
  
  .note-item {
    border-color: #38383a;
  }
  
  .note-item:hover {
    background: #48484a;
  }
  
  .note-title {
    color: #ffffff;
  }
  
  .note-snippet,
  .note-date {
    color: #aeaeb2;
  }
  
  .note-tag {
    background: #48484a;
    color: #aeaeb2;
  }
  
  .notes-content {
    background: #1c1c1e;
  }
  
  .article-title {
    color: #ffffff;
  }
  
  .article-content {
    color: #ffffff;
  }
  
  .article-content h2,
  .article-content h3 {
    color: #ffffff;
  }
  
  .article-content code {
    background: #48484a;
    color: #ff7b72;
  }
  
  .article-tags {
    border-color: #38383a;
  }
  
  .tag {
    background: #48484a;
    color: #ffffff;
  }
  
  .tag:hover {
    background: #5a5a5c;
  }
  
  .empty-title {
    color: #ffffff;
  }
}

/* Mobile Notes Drawer Interface */

/* Mobile Notes Header */
.mobile-notes-header {
  display: none;
  position: sticky;
  top: 0;
  z-index: 100;
  background: #f8f9fa;
  border-bottom: 1px solid #e5e5e7;
  padding: 1rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.mobile-menu-button {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 32px;
  height: 32px;
  padding: 5px;
  background: rgba(0, 0, 0, 0.08);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
  touch-action: manipulation;
}

.mobile-menu-button:active {
  background: rgba(0, 0, 0, 0.12);
  transform: scale(0.95);
}

.hamburger-line {
  width: 100%;
  height: 2px;
  background: #1d1d1f;
  border-radius: 1px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.mobile-menu-button.active .hamburger-line:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.mobile-menu-button.active .hamburger-line:nth-child(2) {
  opacity: 0;
  transform: scale(0);
}

.mobile-menu-button.active .hamburger-line:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

.mobile-header-content {
  flex: 1;
  min-width: 0;
  text-align: center;
}

.mobile-article-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mobile-article-info {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  font-size: 0.8125rem;
  color: #86868b;
}

.mobile-read-time {
  font-weight: 500;
}

.mobile-category {
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.6875rem;
  letter-spacing: 0.5px;
}

.mobile-category.Draft { background: #fef3c7; color: #92400e; }
.mobile-category.Story { background: #dbeafe; color: #1e40af; }
.mobile-category.Identity { background: #f3e8ff; color: #7c3aed; }

.mobile-fullscreen-btn {
  width: 32px !important;
  height: 32px !important;
  min-width: 32px !important;
  background: rgba(0, 0, 0, 0.08) !important;
  border: none !important;
  border-radius: 5px !important;
  color: #1d1d1f !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  touch-action: manipulation !important;
}

.mobile-fullscreen-btn:active {
  background: rgba(0, 0, 0, 0.12) !important;
  transform: scale(0.95) !important;
}

/* Mobile Drawer Overlay */
.mobile-drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 200;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: none;
}

.mobile-drawer-overlay.show {
  opacity: 1;
  pointer-events: auto;
}

/* Mobile Notes Drawer */
.mobile-notes-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 320px;
  max-width: 85vw;
  background: #f5f5f7;
  border-right: 1px solid #e5e5e7;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  z-index: 300;
  transform: translateX(-100%);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: none;
  flex-direction: column;
  overflow: hidden;
}

.mobile-notes-drawer.open {
  transform: translateX(0);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1rem 0.875rem;
  border-bottom: 1px solid #e5e5e7;
  background: #f8f9fa;
}

.drawer-header-left {
  display: flex;
  align-items: center;
}

.drawer-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0;
}

.drawer-count {
  font-size: 0.8125rem;
  color: #86868b;
  background: rgba(0, 0, 0, 0.05);
  padding: 0.1875rem 0.4375rem;
  border-radius: 10px;
  font-weight: 600;
  margin-left: 0.625rem;
}

.drawer-close-btn {
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.08);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  color: #1d1d1f;
  touch-action: manipulation;
}

.drawer-close-btn:active {
  background: rgba(0, 0, 0, 0.12);
  transform: scale(0.95);
}

.drawer-search {
  position: relative;
  margin: 1rem 1.25rem 0.75rem;
}

.drawer-search .search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #86868b;
  pointer-events: none;
}

.drawer-search-input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  background: #ffffff;
  border: 1px solid #e5e5e7;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #1d1d1f;
  transition: all 0.2s ease;
}

.drawer-search-input:focus {
  outline: none;
  border-color: #007aff;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.drawer-search-input::placeholder {
  color: #86868b;
}

.drawer-notes-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
  -webkit-overflow-scrolling: touch;
}

.drawer-note-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  margin: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  min-height: 70px;
  touch-action: manipulation;
}

.drawer-note-item:active {
  background: #e8e8ed;
  transform: scale(0.98);
}

.drawer-note-item.active {
  background: #007aff;
  color: white;
}

.drawer-note-item.active .drawer-note-title,
.drawer-note-item.active .drawer-note-snippet,
.drawer-note-item.active .drawer-note-date,
.drawer-note-item.active .drawer-note-tag {
  color: white;
}

.drawer-note-preview {
  flex: 1;
  min-width: 0;
}

.drawer-note-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.drawer-note-snippet {
  font-size: 0.8125rem;
  color: #86868b;
  margin: 0 0 0.375rem 0;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.drawer-note-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.drawer-note-date {
  color: #86868b;
  font-weight: 500;
}

.drawer-note-tag {
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.625rem;
  letter-spacing: 0.5px;
}

.drawer-note-tag:nth-of-type(1) { background: #fef3c7; color: #92400e; }
.drawer-note-tag:nth-of-type(2) { background: #dbeafe; color: #1e40af; }
.drawer-note-tag:nth-of-type(3) { background: #f3e8ff; color: #7c3aed; }

.drawer-note-arrow {
  font-size: 1.125rem;
  color: #86868b;
  margin-left: 0.75rem;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.drawer-note-item:hover .drawer-note-arrow {
  transform: translateX(4px);
  color: #1d1d1f;
}

.drawer-note-item.active .drawer-note-arrow {
  color: white;
}

/* Drawer Loading State */
.drawer-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: #86868b;
}

.drawer-loading .loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #f0f0f0;
  border-top: 2px solid #007aff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.drawer-loading p {
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Drawer Empty State */
.drawer-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.drawer-empty-state .empty-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.drawer-empty-state h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 0.5rem 0;
}

.drawer-empty-state p {
  font-size: 0.875rem;
  color: #86868b;
  margin: 0;
  line-height: 1.4;
}

/* Mobile Reading Experience */
@media (max-width: 480px) {
  /* Show mobile elements */
  .mobile-notes-header {
    display: flex;
  }
  
  .mobile-drawer-overlay {
    display: block;
    position: absolute !important;
    top: 80px !important; /* Start below mobile header */
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    height: calc(100vh - 80px) !important; /* Match notes content height */
    background: rgba(0, 0, 0, 0.3) !important;
    z-index: 350 !important;
    pointer-events: none !important; /* Allow scrolling through overlay */
  }
  
  .mobile-drawer-overlay.show {
    pointer-events: auto !important; /* Only capture clicks when shown */
  }
  
  .mobile-notes-drawer {
    display: flex;
    position: absolute !important;
    top: 80px !important; /* Start below mobile header */
    left: 0 !important;
    bottom: 0 !important;
    height: calc(100vh - 80px) !important; /* Match notes content height */
    width: 320px !important;
    max-width: 85vw !important;
    background: #f5f5f7 !important;
    border-right: 1px solid #e5e5e7 !important;
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15) !important;
    z-index: 400 !important;
    transform: translateX(-100%) !important;
    transition: transform 0.3s ease !important;
  }
  
  .mobile-notes-drawer.open {
    transform: translateX(0) !important;
  }
  
  /* Ensure drawer content is visible on mobile */
  .mobile-notes-drawer .drawer-notes-list {
    background: #ffffff !important;
    color: #1d1d1f !important;
    padding: 0.5rem 0 !important;
  }
  
  .mobile-notes-drawer .drawer-note-item {
    color: #1d1d1f !important;
    background: transparent !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
    padding: 0.875rem 1rem !important;
    min-height: 70px !important;
  }
  
  .mobile-notes-drawer .drawer-note-title {
    color: #1d1d1f !important;
    font-size: 0.9375rem !important;
    font-weight: 600 !important;
  }
  
  .mobile-notes-drawer .drawer-note-snippet {
    color: #86868b !important;
    font-size: 0.8125rem !important;
  }
  
  .mobile-notes-drawer .drawer-note-date {
    color: #86868b !important;
    font-size: 0.75rem !important;
  }
  
  .mobile-notes-drawer .drawer-title {
    color: #1d1d1f !important;
    font-size: 1.125rem !important;
  }
  
  .mobile-notes-drawer .drawer-count {
    color: #86868b !important;
    background: rgba(0, 0, 0, 0.05) !important;
    font-size: 0.8125rem !important;
  }
  
  .mobile-notes-drawer .drawer-search-input {
    color: #1d1d1f !important;
    background: #f0f0f0 !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
  }
  
  .mobile-notes-drawer .drawer-empty-state {
    color: #1d1d1f !important;
  }
  
  .mobile-notes-drawer .drawer-empty-state h3 {
    color: #1d1d1f !important;
  }
  
  /* Hide desktop sidebar on mobile */
  .desktop-sidebar {
    display: none !important;
  }
  
  /* Full-screen mobile reading */
  .apple-notes-container {
    flex-direction: column !important;
    margin: 0 !important;
    border-radius: 0 !important;
    height: 100vh !important;
    min-height: 100vh !important;
    position: relative !important; /* Contain absolutely positioned drawer */
    overflow: hidden !important;
  }
  
  .notes-content {
    flex: 1 !important;
    height: calc(100vh - 80px) !important; /* Account for mobile header */
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
    background: #1a1a1a !important;
    color: #ffffff !important;
  }
  
  .article-view {
    padding: 1.5rem 1.25rem !important;
    height: 100% !important;
    overflow-y: auto !important;
    color: #ffffff !important;
    background: transparent !important;
  }
  
  .article-title {
    font-size: 1.625rem !important;
    font-weight: 800 !important;
    line-height: 1.25 !important;
    color: #ffffff !important;
    margin-bottom: 1rem !important;
  }
  
  .article-meta {
    gap: 0.875rem !important;
    flex-wrap: wrap !important;
    font-size: 0.9375rem !important;
    margin-bottom: 1.75rem !important;
    padding-bottom: 1.25rem !important;
    border-bottom: 1px solid #f0f0f0 !important;
  }
  
  .article-content {
    font-size: 1.125rem !important;
    line-height: 1.7 !important;
    color: #ffffff !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important;
  }
  
    .article-content h2 {
    font-size: 1.375rem !important;
    font-weight: 700 !important;
    margin: 2rem 0 1rem 0 !important;
    color: #ffffff !important;
  }

  .article-content h3 {
    font-size: 1.25rem !important;
    font-weight: 600 !important;
    margin: 1.75rem 0 0.75rem 0 !important;
    color: #ffffff !important;
  }
  
  .article-content p {
    margin-bottom: 1.25rem !important;
    text-align: justify !important;
    color: #ffffff !important;
  }
  
  .article-content em {
    color: #cccccc !important;
  }
  
  .article-date {
    color: #cccccc !important;
  }
  
  .article-meta {
    color: #cccccc !important;
  }
  
  /* Audio controls mobile optimization */
  .audio-player {
    margin-top: 2rem !important;
    padding: 1.25rem 0 !important;
    border-top: 1px solid #f0f0f0 !important;
  }
  
  .audio-controls {
    flex-wrap: wrap !important;
    gap: 1rem !important;
    justify-content: flex-start !important;
  }
  
  .audio-btn {
    height: 48px !important;
    min-width: 48px !important;
    padding: 0 1.25rem !important;
    font-size: 0.9375rem !important;
    font-weight: 600 !important;
    border-radius: 12px !important;
    touch-action: manipulation !important;
  }
  
  .speed-control {
    width: 100% !important;
    margin: 1rem 0 !important;
    justify-content: space-between !important;
  }
  
  .speed-slider {
    flex: 1 !important;
    margin: 0 1rem !important;
  }
}

/* Responsive Design - Same Layout for All Devices */

/* Tablet and larger devices use desktop layout */

/* Tablet and larger - keep original desktop layout */
@media (min-width: 481px) {
  /* Hide all mobile elements */
  .mobile-notes-header,
  .mobile-drawer-overlay,
  .mobile-notes-drawer {
    display: none !important;
  }
  
  /* Show desktop sidebar */
  .desktop-sidebar {
    display: flex !important;
  }
  
  /* Ensure normal sidebar layout for larger screens */
  .notes-sidebar {
    width: 300px !important;
    height: 100% !important;
    max-height: none !important;
    border-right: 1px solid #d1d5db !important;
    border-bottom: none !important;
  }
  
  .apple-notes-container {
    flex-direction: row !important;
    height: 70vh !important;
    min-height: 600px !important;
  }
  
  .notes-content {
    flex: 1 !important;
    height: 100% !important;
  }
}

/* Small Devices (tablets, 481px to 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .skills-section {
    padding: 1.5rem 1rem;
  }
  
  .section-header h2 {
    font-size: 2rem;
  }
  
  .apple-notes-container {
    flex-direction: column;
    height: 75vh;
    min-height: 600px;
    margin: 1rem 0;
  }
  
  .notes-sidebar {
    width: 100% !important;
    height: 220px !important;
    max-height: 220px !important;
    border-right: none !important;
    border-bottom: 1px solid #d1d5db !important;
    overflow-y: auto !important;
  }
  
  .notes-content {
    height: calc(75vh - 220px) !important;
    min-height: 380px !important;
  }
  
  .article-view {
    padding: 1.25rem 1.5rem !important;
  }
  
  .article-title {
    font-size: 1.625rem !important;
    font-weight: 700 !important;
  }
  
  .article-meta {
    gap: 0.875rem !important;
    font-size: 0.9375rem !important;
  }
  
  .article-content {
    font-size: 1.0625rem !important;
    line-height: 1.68 !important;
  }
  
  .experience-section {
    padding: 1.5rem 1rem;
  }
  
  .experience-item {
    padding: 1.25rem;
    margin-bottom: 1.25rem;
  }
}

/* Medium Devices (tablets/small laptops, 769px to 1024px) */
@media (min-width: 769px) and (max-width: 1024px) {
  .skills-section {
    padding: 2rem 1.5rem;
  }
  
  .section-header h2 {
    font-size: 2.25rem;
  }
  
  .apple-notes-container {
    flex-direction: row !important;
    height: 80vh !important;
    min-height: 700px !important;
  }
  
  .notes-sidebar {
    width: 320px !important;
    max-height: none !important;
    height: 100% !important;
    border-right: 1px solid #d1d5db !important;
    border-bottom: none !important;
    flex-shrink: 0 !important;
  }
  
  .notes-content {
    flex: 1 !important;
    height: 100% !important;
  }
  
  .article-view {
    padding: 2rem 2.5rem !important;
  }
  
  .article-title {
    font-size: 1.875rem !important;
    font-weight: 700 !important;
  }
  
  .article-meta {
    gap: 1rem !important;
    font-size: 1rem !important;
  }
  
  .article-content {
    font-size: 1.125rem !important;
    line-height: 1.75 !important;
  }
  
  .experience-section {
    padding: 2rem 1.5rem;
  }
  
  .content-section {
    padding: 1.5rem;
  }
  
  .content-hero h1 {
    font-size: 2rem;
  }
  
  .content-hero p {
    font-size: 1rem;
  }
}

/* Large Devices (desktops, 1025px to 1440px) */
@media (min-width: 1025px) and (max-width: 1440px) {
  .skills-section {
    padding: 2.5rem 2rem;
  }
  
  .section-header h2 {
    font-size: 2.5rem;
  }
  
  .apple-notes-container {
    height: 85vh;
    min-height: 800px;
  }
  
  .notes-sidebar {
    width: 320px;
  }
  
  .article-view {
    padding: 2rem 2.5rem;
  }
  
  .article-title {
    font-size: 2rem;
  }
  
  .article-content {
    font-size: 1.0625rem;
    line-height: 1.75;
  }
  
  .experience-section {
    padding: 2.5rem 2rem;
  }
  
  .content-section {
    padding: 2rem;
  }
  
  .content-hero h1 {
    font-size: 2.25rem;
  }
}

/* Extra Large Devices (large desktops, 1441px and up) */
@media (min-width: 1441px) {
  .skills-section {
    padding: 3rem 2.5rem;
  }
  
  .section-header h2 {
    font-size: 2.75rem;
  }
  
  .apple-notes-container {
    height: 90vh;
    min-height: 900px;
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .notes-sidebar {
    width: 350px;
  }
  
  .article-view {
    padding: 2.5rem 3rem;
  }
  
  .article-title {
    font-size: 2.25rem;
  }
  
  .article-content {
    font-size: 1.125rem;
    line-height: 1.8;
    max-width: 800px;
  }
  
  .experience-section {
    padding: 3rem 2.5rem;
  }
  
  .content-section {
    padding: 2.5rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .content-hero h1 {
    font-size: 2.5rem;
  }
  
  .content-hero p {
    font-size: 1.125rem;
  }
}

/* Touch-friendly improvements for mobile */
@media (max-width: 768px) and (pointer: coarse) {
  .article-list-item {
    min-height: 44px;
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
  }
  
  .fullscreen-btn {
    min-height: 36px !important;
    min-width: 36px !important;
  }
  
  .admin-btn {
    min-height: 36px !important;
    min-width: 36px !important;
  }
  
  /* Smaller icons for mobile buttons */
  .fullscreen-btn .h-3\.5 {
    width: 0.75rem !important;
    height: 0.75rem !important;
  }
  
  .admin-btn .h-4 {
    width: 0.875rem !important;
    height: 0.875rem !important;
  }
  
  .drawer-close-btn {
    width: 28px !important;
    height: 28px !important;
    border-radius: 5px !important;
    font-size: 1rem !important;
  }
  
  .tab-button {
    min-height: 44px;
    padding: 0.75rem 1rem;
  }
  
  /* Larger tap areas for audio controls */
  .audio-btn {
    min-height: 44px;
    min-width: 44px;
    padding: 0.5rem 1rem;
  }
  
  .voice-toggle-btn {
    min-height: 44px;
    padding: 0.75rem 1rem;
  }
}

/* Landscape orientation adjustments for phones */
@media (max-width: 768px) and (orientation: landscape) {
  .apple-notes-container {
    height: 85vh;
    min-height: 400px;
  }
  
  .notes-sidebar {
    height: 150px;
    max-height: 150px;
  }
  
  .article-panel {
    height: calc(85vh - 150px);
    min-height: 250px;
  }
  
  .skills-section {
    padding: 0.75rem 0.5rem;
  }
  
  .section-header {
    margin-bottom: 1rem;
  }
  
  .section-header h2 {
    font-size: 1.5rem;
  }
}

.content-hero {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
}

.content-icon-large {
  background: hsl(var(--primary)/10);
  border-radius: 1rem;
  padding: 1rem;
  flex-shrink: 0;
}

.content-card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 1rem;
  padding: 2rem;
}

.content-status {
  text-align: center;
  margin-bottom: 2rem;
}

.status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.coming-soon {
  background: hsl(var(--muted));
  color: hsl(var(--muted-foreground));
}

.development {
  background: hsl(var(--primary)/10);
  color: hsl(var(--primary));
}

.content-features {
  margin-bottom: 2rem;
}

.content-feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0;
  color: hsl(var(--foreground));
  font-size: 0.95rem;
}

.feature-icon {
  width: 1rem;
  height: 1rem;
  color: hsl(var(--primary));
  flex-shrink: 0;
}

.content-button {
  width: 100%;
  font-weight: 500;
}

.community-section {
  margin-top: 4rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.discord-card {
  background: linear-gradient(135deg, hsl(var(--primary)/5%) 0%, hsl(var(--card)) 100%);
  border: 1px solid hsl(var(--primary)/20);
  border-radius: 1rem;
  padding: 2rem;
}

.discord-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

.discord-icon-wrapper {
  background: #5865f2;
  border-radius: 1rem;
  padding: 1rem;
  flex-shrink: 0;
}

.discord-icon {
  width: 2rem;
  height: 2rem;
  color: white;
}

.discord-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin: 0 0 0.25rem 0;
}

.discord-subtitle {
  color: hsl(var(--muted-foreground));
  margin: 0;
  font-size: 0.95rem;
}

.discord-content {
  text-align: center;
}

.discord-description {
  color: hsl(var(--muted-foreground));
  line-height: 1.6;
  margin-bottom: 2rem;
}

.discord-button {
  background: #5865f2;
  color: white;
  border: none;
  font-weight: 600;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.discord-button:hover {
  background: #4752c4;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(88, 101, 242, 0.4);
}

@media (max-width: 768px) {
  .content-section {
    padding: 1rem;
  }
  
  .content-hero {
    flex-direction: column;
    text-align: center;
  }
  
  .discord-header {
    flex-direction: column;
    text-align: center;
  }
}
</style>

<style>
/* Global styles for responsive notes fullscreen mode */
body.notes-fullscreen {
  overflow: hidden !important;
  height: 100% !important;
  max-height: 100% !important;
  position: fixed !important; /* Prevent body scrolling */
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  top: 0 !important;
  left: 0 !important;
}

/* Ensure html element also respects viewport constraints */
html:has(body.notes-fullscreen) {
  overflow: hidden !important;
  height: 100% !important;
  max-height: 100% !important;
}

/* Hide ALL other elements when in fullscreen */
body.notes-fullscreen > *:not(#app) {
  display: none !important;
}

body.notes-fullscreen header,
body.notes-fullscreen nav,
body.notes-fullscreen footer,
body.notes-fullscreen .chatbot,
body.notes-fullscreen section:not(#skills) {
  display: none !important;
}

/* Hide everything in skills section except notes */
body.notes-fullscreen #skills .section-header,
body.notes-fullscreen #skills .experience-section {
  display: none !important;
}

/* Mobile-specific fullscreen optimizations */
@media (max-width: 768px) {
  body.notes-fullscreen {
    /* Prevent iOS Safari viewport issues */
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
  }
}

/* Prevent scrolling and bouncing on iOS */
@supports (-webkit-touch-callout: none) {
  body.notes-fullscreen {
    -webkit-overflow-scrolling: auto !important;
    touch-action: none !important;
  }
}
</style>