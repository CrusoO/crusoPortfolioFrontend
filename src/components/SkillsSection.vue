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
            <div v-show="activeTab === 'articles'" class="apple-notes-container">
              <!-- Sidebar -->
              <div class="notes-sidebar">
                <div class="notes-header">
                  <h3 class="notes-title">My Notes</h3>
                  <span class="notes-count">{{ filteredArticles.length }}</span>
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
  </section>
</template>

<script setup lang="ts">
/*
  Skills section displaying technical competencies and knowledge sharing
  Organized by categories with visual icons and badges
*/

import { ref, computed } from 'vue'
import { API_ENDPOINTS } from '@/config/api'
import { FileText, BookOpen, ChevronRight, MessageCircle, Search } from 'lucide-vue-next'
import Progress from '@/components/ui/Progress.vue'
import Tabs from '@/components/ui/Tabs.vue'
import Button from '@/components/ui/Button.vue'

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
const isLoadingNotes = ref(true)

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

function selectArticle(article: Article) {
  selectedArticle.value = article
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
}

function openDiscord() {
  window.open(discordLink, '_blank')
}
</script>

<style>
/* All existing styles preserved, just adding new content-specific styles */

/* Apple Notes Style Interface */
.apple-notes-container {
  display: flex;
  height: 70vh;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e5e7;
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

/* Responsive design */
@media (max-width: 768px) {
  .apple-notes-container {
    flex-direction: column;
    height: auto;
  }
  
  .notes-sidebar {
    width: 100%;
    max-height: 300px;
  }
  
  .article-view {
    padding: 24px 20px;
  }
  
  .article-title {
    font-size: 24px;
  }
  
  .article-meta {
    gap: 12px;
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