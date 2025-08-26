<template>
  <div 
    class="chatbot-container"
    :class="{ 
      'expanded': isOpen, 
      'dragging': isDragging,
      'following': isFollowingUser
    }"
    :style="getPositionStyle()"
    @mousedown="startDragging"
    role="complementary"
    aria-label="AI Assistant Chat Interface"
  >
    <!-- Chat Messages Dialog -->
    <div 
      v-if="isOpen" 
      class="chat-messages" 
      @mousedown.stop
      role="dialog"
      aria-labelledby="chat-header-title"
      aria-modal="true"
    >
      <header class="chat-header">
        <div class="bot-info">
          <div class="bot-avatar" role="img" aria-label="Robot assistant">🤖</div>
          <div>
            <h3 id="chat-header-title" class="bot-name">Lisa</h3>
            <p class="bot-status">Your AI Guide</p>
          </div>
        </div>
        <button 
          @click="closeChat" 
          class="close-btn"
          aria-label="Close chat"
          type="button"
        >
          ✕
        </button>
      </header>
      
      <div 
        class="messages-container" 
        ref="messagesContainer"
        role="log"
        aria-live="polite"
        aria-label="Chat conversation"
      >
        <div 
          v-for="message in messages" 
          :key="message.id"
          :class="['message', message.type]"
          role="article"
          :aria-label="`${message.type === 'bot' ? 'Assistant' : 'You'} message at ${message.time}`"
        >
          <div 
            class="message-avatar" 
            v-if="message.type === 'bot'"
            role="img" 
            aria-label="Assistant avatar"
          >
            🤖
          </div>
          <div class="message-content">
            <div class="message-text">{{ message.text }}</div>
            <time class="message-time" :datetime="message.time">{{ message.time }}</time>
          </div>
          <div 
            class="message-avatar" 
            v-if="message.type === 'user'"
            role="img"
            aria-label="User avatar"
          >
            👨‍💻
          </div>
        </div>
        
        <div v-if="isTyping" class="message bot">
          <div class="message-avatar"></div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
      
      <form class="chat-input" @submit.prevent="sendMessage">
        <label for="message-input" class="sr-only">Type your message</label>
        <input 
          id="message-input"
          v-model="currentMessage"
          @keypress.enter="sendMessage"
          placeholder="Ask anything about my work..."
          class="message-input"
          :disabled="isTyping"
          aria-describedby="input-hint"
          autocomplete="off"
          maxlength="500"
        />
        <span id="input-hint" class="sr-only">Press Enter to send message</span>
        <button 
          type="submit"
          @click="sendMessage" 
          class="send-btn"
          :disabled="!currentMessage.trim() || isTyping"
          aria-label="Send message"
        >
          📤
        </button>
      </form>
    </div>

    <!-- Speech Bubble -->
    <div 
      v-if="showSpeechBubble" 
      class="speech-bubble"
      :class="{ 
        'speech-bubble--welcome': showingWelcome,
        'synchronized': isSyncSpeaking 
      }"
    >
      <div class="speech-content">
        {{ speechBubble }}
        <span v-if="isSpeechTyping" class="typing-cursor">|</span>
      </div>
      <div class="speech-bubble-arrow"></div>
    </div>

    <!-- Bot Avatar (always visible) -->
    <div 
      class="bot-toggle"
      @mousedown="handleBotMouseDown"
    >
      <div class="bot-face">
        <div class="bot-eyes">
          <div class="eye" :class="{ blink: isBlinking }"></div>
          <div class="eye" :class="{ blink: isBlinking }"></div>
        </div>
        <div class="bot-mouth" :class="{ talking: isTyping || isSpeaking }"></div>
      </div>
      <div v-if="hasUnread && !isOpen" class="notification-dot"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
/*
  Cute draggable chatbot component for portfolio interactivity
  Features smooth animations, predefined responses, and drag functionality
*/

import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { API_ENDPOINTS } from '@/config/api'
import elevenLabsTTS from '@/services/elevenlabs-tts'

// No props needed - bot will always greet as "visitor"

interface Message {
  id: number
  text: string
  type: 'user' | 'bot'
  time: string
}

const isOpen = ref(false)
const isDragging = ref(false)
const isTyping = ref(false)
const isBlinking = ref(false)
const hasUnread = ref(true)
const currentMessage = ref('')
const messages = ref<Message[]>([])
const messagesContainer = ref<HTMLElement>()

const position = ref({ x: 0, y: 0 })
const dragOffset = ref({ x: 0, y: 0 })
const mouseStartPos = ref({ x: 0, y: 0 })
const hasMoved = ref(false)
const showingWelcome = ref(false)
const isInitialLoad = ref(true)
const speechBubble = ref('')
const showSpeechBubble = ref(false)
const fullWelcomeMessage = ref('')
const isSpeechTyping = ref(false)

// New interactive features
const currentSection = ref('hero')
const lastSection = ref('')
const isFollowingUser = ref(false)
const isSpeaking = ref(false)
const hasSpokenWelcome = ref(false)
const isSyncSpeaking = ref(false)
const sectionVisitCount = ref<Record<string, number>>({})
const lastInteractionTime = ref(Date.now())
const boredTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const scrollTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

// Section-specific interactive responses
const sectionResponses = {
  hero: [
    "Hi there! Welcome ! I'm Lisa, your friendly  guide! 🤖✨",
    "Welcome visitor! Ready for an interactive tour? I can tell you about every pixel of this place! 😄",
    "Hey! *waves digitally* I'm like a GPS but for portfolios - much more fun though! 🗺️",
    "First time here? Don't worry, I'll be your digital tour guide. No boring facts, I promise! 😉"
  ],
  projects: [
    "Oooh, checking out the projects? These are Robinson's babies! Want me to tell you which one can make you rich? 💰",
    "Projects section! This is where the magic happens. CodeSensei is my personal favorite - it's almost as smart as me! 🧠",
    "Look at these beauties! Each project has a story. Want to hear some developer drama? 🎭",
    "These projects are like Pokemon cards but for developers - gotta code them all! ⚡"
  ],
  skills: [
    "Skills and Notes! This is where Robinson shows off... I mean, shares knowledge! 📚",
    "Reading time! Some of these articles are longer than my attention span, but they're worth it! 😅",
    "Did you know you can listen to these articles? I have a beautiful voice - well, ElevenLabs does! 🎵",
    "Notes section! Warning: May contain high levels of wisdom and bad programming jokes! 🤓"
  ],
  canvas: [
    "Paint time! 🎨 This is my favorite playground. Wanna create some digital chaos together?",
    "MS Paint vibes but make it 2024! I love watching people draw stick figures and call it art! 😂",
    "Canvas section! Fun fact: I've seen some masterpieces here... and some things that can't be unseen! 👨‍🎨",
    "Ready to unleash your inner Picasso? Or your inner 5-year-old? Both are equally valid! 🖌️"
  ],
  contact: [
    "Contact section! This is where business gets real. No more fun and games... just kidding, I'm always fun! 📞",
    "Thinking of hiring Robinson? Smart choice! I can put in a good word for you... for a small fee 😉",
    "Contact form time! Remember, Robinson loves coffee, so mention that for bonus points! ☕",
    "Ready to collaborate? Warning: Robinson codes faster than I can keep up with! 🏃‍♂️💨"
  ]
}

// General chat responses
const responses = [
  "Hi visitor! 👋 This is Lisa! I'm excited to share portfolio with you. How can I help you today? 🤖",
  "I'm a passionate developer specializing in AI-powered applications and cutting-edge agricultural technology! 🚀",
  "My CodeSensei project is an AI-powered code analysis tool that transforms applications into interactive learning platforms! 💻",
  "Check out my AGRO Frontend - it's a modern agricultural management system with advanced analytics! 🌱",
  "I'm based in beautiful Bangalore, India, the Silicon Valley of India! Always excited about innovative tech! 📍",
  "Want to collaborate? Scroll down to my contact form and let's build something amazing together! 💌",
  "My tech arsenal includes JavaScript, Python, React, Vue.js, AI/ML, Docker, and many more powerful tools! ⚡",
  "Nice to meet you, visitor! I'm Lisa, Robinson's digital assistant! Drag me anywhere and let's chat about technology! 🎮",
  "My portfolio showcases current innovations and exciting future projects that will change the world! 🔮",
  "Need a tour? I know every section of this portfolio like the back of my digital hand! 🧭",
  "I love discussing AI, machine learning, and how technology can solve real-world problems! 🧠",
  "Thanks for exploring Robinson's work, visitor! Ask me anything technical! 🚀"
]

// Boredom responses for idle users
const boredResponses = [
  "Getting bored? Wanna play some games or talk to me? I promise I'm more interesting than your social media feed! 📱",
  "Hey! Still there? Want me to tell you a programmer joke? Warning: It might be terrible! 😂",
  "Psst! Need entertainment? I can tell you fun facts about each project or we could just chat! 🎪",
  "Idle for too long! How about we explore the paint canvas? I love watching people create digital art! 🎨",
  "Boredom detected! Want me to give you a personalized tour? I know all the Easter eggs! 🥚"
]

let messageId = 0

// Dragging functionality
function startDragging(event: MouseEvent) {
  const element = event.currentTarget as HTMLElement
  const rect = element.getBoundingClientRect()
  
  // Store initial mouse position
  mouseStartPos.value = {
    x: event.clientX,
    y: event.clientY
  }
  
  hasMoved.value = false
  
  dragOffset.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.body.style.userSelect = 'none'
  event.preventDefault()
}

function handleMouseMove(event: MouseEvent) {
  const moveDistance = Math.sqrt(
    Math.pow(event.clientX - mouseStartPos.value.x, 2) + 
    Math.pow(event.clientY - mouseStartPos.value.y, 2)
  )
  
  // If mouse moved more than 10 pixels, start dragging
  if (moveDistance > 10) {
    hasMoved.value = true
    if (!isDragging.value) {
      isDragging.value = true
    }
  }
  
  if (isDragging.value) {
    const newX = event.clientX - dragOffset.value.x
    const newY = event.clientY - dragOffset.value.y
    
    // Keep within viewport bounds
    const maxX = window.innerWidth - 80
    const maxY = window.innerHeight - 80
    
    position.value = {
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    }
  }
}

function handleMouseUp() {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.body.style.userSelect = ''
  
  // If user didn't move mouse much, treat it as a click (open chat)
  if (!hasMoved.value && !isDragging.value) {
    console.log('Opening chat - click detected')
    toggleChat()
  } else {
    console.log('Drag completed')
  }
  
  // Reset dragging state
  isDragging.value = false
  hasMoved.value = false
}

// Handle bot mouse down - separate from container drag
function handleBotMouseDown(event: MouseEvent) {
  // Store initial mouse position
  mouseStartPos.value = {
    x: event.clientX,
    y: event.clientY
  }
  
  hasMoved.value = false
  
  const element = event.currentTarget as HTMLElement
  const rect = element.getBoundingClientRect()
  
  dragOffset.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
  
  document.addEventListener('mousemove', handleBotMouseMove)
  document.addEventListener('mouseup', handleBotMouseUp)
  document.body.style.userSelect = 'none'
  event.preventDefault()
  event.stopPropagation()
}

function handleBotMouseMove(event: MouseEvent) {
  const moveDistance = Math.sqrt(
    Math.pow(event.clientX - mouseStartPos.value.x, 2) + 
    Math.pow(event.clientY - mouseStartPos.value.y, 2)
  )
  
  // If mouse moved more than 8 pixels, start dragging
  if (moveDistance > 8) {
    hasMoved.value = true
    if (!isDragging.value) {
      isDragging.value = true
    }
    
    // Calculate position relative to the container
    const containerRect = document.querySelector('.chatbot-container')?.getBoundingClientRect()
    if (containerRect) {
      const newX = event.clientX - dragOffset.value.x
      const newY = event.clientY - dragOffset.value.y
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - 80
      const maxY = window.innerHeight - 80
      
      position.value = {
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      }
    }
  }
}

function handleBotMouseUp() {
  document.removeEventListener('mousemove', handleBotMouseMove)
  document.removeEventListener('mouseup', handleBotMouseUp)
  document.body.style.userSelect = ''
  
  // If user didn't move mouse much, treat it as a click (open chat)
  if (!hasMoved.value && !isDragging.value) {
    toggleChat()
  }
  
  // Reset dragging state
  isDragging.value = false
  hasMoved.value = false
}

function toggleChat() {
  isOpen.value = !isOpen.value
  hasUnread.value = false
  
  if (isOpen.value && messages.value.length === 0) {
    // Welcome message for visitor
    setTimeout(() => {
      addBotMessage(responses[0])
    }, 500)
  }
}

function closeChat() {
  isOpen.value = false
}

async function sendMessage() {
  if (!currentMessage.value.trim()) return
  
  const userMessage = currentMessage.value
  
  // Add user message
  messages.value.push({
    id: messageId++,
    text: userMessage,
    type: 'user',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })
  
  currentMessage.value = ''
  scrollToBottom()
  
  // Show bot typing
  isTyping.value = true
  
  try {
    // Send message to backend API
    const response = await fetch(API_ENDPOINTS.CHAT_MESSAGE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        username: 'visitor'
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      isTyping.value = false
      addBotMessage(data.response)
    } else {
      throw new Error('Backend not available')
    }
  } catch (error) {
    // Fallback to static responses if backend is down
    isTyping.value = false
    console.log('Backend not available, using fallback responses')
    setTimeout(() => {
      const fallbackResponse = getSmartResponse(userMessage.toLowerCase())
      addBotMessage(fallbackResponse)
    }, 1000)
  }
}

function getSmartResponse(userMsg: string): string {
  // More AI-like contextual responses
  if (userMsg.includes('project') || userMsg.includes('work') || userMsg.includes('portfolio')) {
    return responses[Math.random() > 0.5 ? 1 : 2]
  } else if (userMsg.includes('contact') || userMsg.includes('email') || userMsg.includes('hire')) {
    return responses[5]
  } else if (userMsg.includes('tech') || userMsg.includes('skill') || userMsg.includes('stack')) {
    return responses[6]
  } else if (userMsg.includes('ai') || userMsg.includes('machine learning') || userMsg.includes('ml')) {
    return responses[10]
  } else if (userMsg.includes('location') || userMsg.includes('where') || userMsg.includes('bangalore')) {
    return responses[4]
  } else if (userMsg.includes('drag') || userMsg.includes('move')) {
    return responses[7]
  } else if (userMsg.includes('hello') || userMsg.includes('hi') || userMsg.includes('hey')) {
    return responses[0]
  } else if (userMsg.includes('who') || userMsg.includes('about')) {
    return responses[11]
  } else if (userMsg.includes('codesensei')) {
    return responses[2]
  } else if (userMsg.includes('agro') || userMsg.includes('agriculture')) {
    return responses[3]
  } else if (userMsg.includes('future') || userMsg.includes('next')) {
    return responses[8]
  } else {
    // More intelligent random selection based on context
    const contextResponses = [responses[0], responses[9], responses[11]]
    return contextResponses[Math.floor(Math.random() * contextResponses.length)]
  }
}

function addBotMessage(text: string) {
  messages.value.push({
    id: messageId++,
    text,
    type: 'bot',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })
  
  scrollToBottom()
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Position styling function
function getPositionStyle() {
  if (showingWelcome.value) {
    // Lower-right position for welcome (slightly to the right)
    return {
      top: '200px',
      right: '100px',
      left: 'auto',
      transform: 'none'
    }
  } else if (position.value.x !== 0 || position.value.y !== 0) {
    // Custom dragged position
    return {
      transform: `translate(${position.value.x}px, ${position.value.y}px)`,
      top: '0',
      left: '0',
      right: 'auto'
    }
  }
  // Default position (lower right)
  return {
    top: '120px',
    right: '20px',
    left: 'auto',
    transform: 'none'
  }
}

// Typewriter effect for welcome message
function typeMessage(message: string, callback?: () => void) {
  speechBubble.value = ''
  isSpeechTyping.value = true
  let index = 0
  
  const typeInterval = setInterval(() => {
    if (index < message.length) {
      speechBubble.value += message.charAt(index)
      index++
    } else {
      isSpeechTyping.value = false
      clearInterval(typeInterval)
      if (callback) callback()
    }
  }, 50) // 50ms per character for smooth typing
}

// Initial welcome sequence with speech bubble and voice
async function startWelcomeSequence() {
  if (isInitialLoad.value && !hasSpokenWelcome.value) {
    showingWelcome.value = true
    hasSpokenWelcome.value = true
    
    // Welcome message with ElevenLabs speech
    setTimeout(async () => {
      showSpeechBubble.value = true
      const welcomeText = "Hi there! Welcome ! I'm Lisa, your friendly AI guide!"
      fullWelcomeMessage.value = welcomeText
      
      // Speak the welcome message with synchronized text
      try {
        await speakMessageSynced(
          welcomeText, 
          (displayText: string, isComplete: boolean) => {
            speechBubble.value = displayText
            isSpeechTyping.value = !isComplete
            
            if (isComplete) {
              // After message completes, tell a joke
              setTimeout(async () => {
                const jokeText = "Here's a joke: Why do programmers prefer dark mode? Because light attracts bugs! 😂"
                fullWelcomeMessage.value = jokeText
                
                try {
                  await speakMessageSynced(
                    jokeText,
                    (jokeDisplayText: string, jokeIsComplete: boolean) => {
                      speechBubble.value = jokeDisplayText
                      isSpeechTyping.value = !jokeIsComplete
                      
                      if (jokeIsComplete) {
                        // After joke, move to corner and set up scroll detection
                        setTimeout(() => {
                          showSpeechBubble.value = false
                          showingWelcome.value = false
                          position.value = { x: 20, y: 20 } // Move to top-left corner
                          isInitialLoad.value = false
                          startScrollDetection()
                          startBoredTimer()
                        }, 3000)
                      }
                    }
                  )
                } catch (error) {
                  console.log('TTS not available for joke')
                  // Fallback to typing animation for joke
                  typeMessage(jokeText, () => {
                    setTimeout(() => {
                      showSpeechBubble.value = false
                      showingWelcome.value = false
                      position.value = { x: 20, y: 20 }
                      isInitialLoad.value = false
                      startScrollDetection()
                      startBoredTimer()
                    }, 3000)
                  })
                }
              }, 2000)
            }
          }
        )
      } catch (error) {
        console.log('TTS not available, continuing with text only')
        // Fallback to typing animation
      typeMessage(fullWelcomeMessage.value, () => {
          // After message completes, tell a joke
          setTimeout(async () => {
            const jokeText = "Here's a joke: Why do programmers prefer dark mode? Because light attracts bugs! 😂"
            fullWelcomeMessage.value = jokeText
            
            typeMessage(jokeText, () => {
              // After joke, move to corner and set up scroll detection
        setTimeout(() => {
          showSpeechBubble.value = false
          showingWelcome.value = false
                position.value = { x: 20, y: 20 } // Move to top-left corner
          isInitialLoad.value = false
                startScrollDetection()
                startBoredTimer()
              }, 3000)
            })
          }, 2000)
        })
      }
    }, 1500)
  }
}

// Synchronized speak with text display
async function speakMessageSynced(
  text: string, 
  onTextUpdate: (displayText: string, isComplete: boolean) => void
) {
  try {
    isSpeaking.value = true
    isSyncSpeaking.value = true
    await elevenLabsTTS.speakWithSync(
      text,
      (displayText: string, wordIndex: number, isComplete: boolean) => {
        onTextUpdate(displayText, isComplete)
      },
      undefined, // no noteId for chatbot messages
      {
        voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel - natural female voice
        stability: 0.6,
        similarityBoost: 0.8,
        style: 0.3, // Add some personality
        useSpeakerBoost: true
      }
    )
  } catch (error) {
    console.log('ElevenLabs synchronized TTS failed:', error)
    // Fallback to full text display
    onTextUpdate(text, true)
    throw error
  } finally {
    isSpeaking.value = false
    isSyncSpeaking.value = false
  }
}

// Legacy speak method for backward compatibility
async function speakMessage(text: string) {
  try {
    await elevenLabsTTS.speak(text, {
      voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel - natural female voice
      stability: 0.6,
      similarityBoost: 0.8,
      style: 0.3, // Add some personality
      useSpeakerBoost: true
    })
  } catch (error) {
    console.log('ElevenLabs TTS failed:', error)
    throw error
  }
}

// Scroll detection and section identification
function startScrollDetection() {
  const handleScroll = () => {
    // Update last interaction time
    lastInteractionTime.value = Date.now()
    resetBoredTimer()
    
    // Stop any current speaking during active scrolling
    if (isSpeaking.value) {
      elevenLabsTTS.stop()
      isSpeaking.value = false
      isSyncSpeaking.value = false
      showSpeechBubble.value = false
    }
    
    // Debounce scroll events
    if (scrollTimeout.value) {
      clearTimeout(scrollTimeout.value)
    }
    
    scrollTimeout.value = setTimeout(() => {
      // Only trigger section detection when scrolling stops
      detectCurrentSection()
    }, 1000) // Wait 1 second after scroll stops before speaking
  }
  
  window.addEventListener('scroll', handleScroll)
  
  // Initial section detection
  detectCurrentSection()
}

// Detect which section user is currently viewing
function detectCurrentSection() {
  const sections = [
    { id: 'hero', element: document.querySelector('.hero-section, #hero') },
    { id: 'projects', element: document.querySelector('.projects-section, #projects') },
    { id: 'skills', element: document.querySelector('.skills-section, #skills') },
    { id: 'canvas', element: document.querySelector('.paint-section, #paint, .canvas-section') },
    { id: 'contact', element: document.querySelector('.contact-section, #contact') }
  ]
  
  const scrollY = window.scrollY
  const windowHeight = window.innerHeight
  const threshold = windowHeight * 0.3 // 30% of viewport
  
  for (const section of sections) {
    if (section.element) {
      const rect = section.element.getBoundingClientRect()
      const sectionTop = scrollY + rect.top
      const sectionBottom = sectionTop + rect.height
      
      // Check if section is currently visible
      if (scrollY + threshold >= sectionTop && scrollY + threshold <= sectionBottom) {
        if (currentSection.value !== section.id) {
          handleSectionChange(section.id)
        }
        break
      }
    }
  }
}

// Handle section change with interactive responses
function handleSectionChange(newSection: string) {
  lastSection.value = currentSection.value
  currentSection.value = newSection
  
  // Track visit count
  sectionVisitCount.value[newSection] = (sectionVisitCount.value[newSection] || 0) + 1
  
  // Don't interrupt if bot is already speaking or typing
  if (isSpeaking.value || isTyping.value || isDragging.value) {
    return
  }
  
  // Animate bot movement based on section
  animateBotToSection(newSection)
  
  // Provide contextual commentary with delay to avoid spam
  setTimeout(() => {
    provideContextualCommentary(newSection)
  }, 800)
}

// Animate bot to appropriate position based on section
function animateBotToSection(section: string) {
  if (isDragging.value) return // Don't move if user is dragging
  
  const positions = {
    hero: { x: window.innerWidth - 100, y: 100 },
    projects: { x: 50, y: window.innerHeight / 2 - 100 },
    skills: { x: window.innerWidth - 100, y: window.innerHeight / 2 },
    canvas: { x: window.innerWidth / 2 - 25, y: 50 },
    contact: { x: window.innerWidth - 100, y: window.innerHeight - 150 }
  }
  
  const targetPos = positions[section as keyof typeof positions] || { x: 20, y: 20 }
  
  // Smooth animation to target position
  isFollowingUser.value = true
  position.value = {
    x: Math.max(0, Math.min(targetPos.x, window.innerWidth - 80)),
    y: Math.max(0, Math.min(targetPos.y, window.innerHeight - 80))
  }
  
  setTimeout(() => {
    isFollowingUser.value = false
  }, 800)
}

// Provide contextual commentary for current section
async function provideContextualCommentary(section: string) {
  const visitCount = sectionVisitCount.value[section] || 1
  
  // Don't spam the user - limit commentary frequency
  if (visitCount > 2 && Math.random() > 0.3) {
    return // Only 30% chance of commentary after 2+ visits
  }
  
  const sectionComments = sectionResponses[section as keyof typeof sectionResponses]
  if (!sectionComments || sectionComments.length === 0) return
  
  let comment = sectionComments[Math.floor(Math.random() * sectionComments.length)]
  
  // Add visit-specific modifiers
  if (visitCount > 1) {
    const revisitComments = [
      "Back again I see! 😉 ",
      "Oh, we're revisiting! ",
      "Round two? ",
      "Can't get enough of this section? "
    ]
    comment = revisitComments[Math.floor(Math.random() * revisitComments.length)] + comment
  }
  
  // Show speech bubble and speak
  showProactiveMessage(comment, true)
}

// Show proactive message with optional synchronized speech
async function showProactiveMessage(message: string, speak: boolean = false) {
  // Don't show if chat is open or bot is busy
  if (isOpen.value || isSpeaking.value || isTyping.value) {
    return
  }
  
  showSpeechBubble.value = true
  
  try {
    if (speak) {
      // Use synchronized speech with real-time text display
      await speakMessageSynced(
        message,
        (displayText: string, isComplete: boolean) => {
          speechBubble.value = displayText
          isSpeechTyping.value = !isComplete
          
          if (isComplete) {
            // Hide bubble after delay
            setTimeout(() => {
              showSpeechBubble.value = false
            }, 4000)
          }
        }
      )
    } else {
      // Just type message without speech
      typeMessage(message, () => {
        // Hide bubble after delay
        setTimeout(() => {
          showSpeechBubble.value = false
        }, 3000)
      })
    }
    
  } catch (error) {
    // If speech fails, fallback to typing animation
    console.log('Synchronized speech failed, using fallback typing')
    typeMessage(message, () => {
      setTimeout(() => {
        showSpeechBubble.value = false
      }, 3000)
    })
  }
}

// Boredom detection and engagement
function startBoredTimer() {
  resetBoredTimer()
}

function resetBoredTimer() {
  if (boredTimer.value) {
    clearTimeout(boredTimer.value)
  }
  
  // Set bored timer for 30 seconds of inactivity
  boredTimer.value = setTimeout(() => {
    if (!isOpen.value && !isSpeaking.value && !isTyping.value) {
      const boredMessage = boredResponses[Math.floor(Math.random() * boredResponses.length)]
      showProactiveMessage(boredMessage, true)
      
      // Wiggle animation to get attention
      const botElement = document.querySelector('.bot-toggle') as HTMLElement
      if (botElement) {
        botElement.style.animation = 'wiggle 0.5s ease-in-out 3'
        setTimeout(() => {
          botElement.style.animation = 'bounce 2s ease-in-out infinite'
        }, 1500)
      }
    }
  }, 30000) // 30 seconds
}

// Cleanup function for scroll and timers
function cleanup() {
  if (boredTimer.value) {
    clearTimeout(boredTimer.value)
  }
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }
  // Remove scroll listener
  window.removeEventListener('scroll', () => {})
}

// Blinking animation and initialization
onMounted(() => {
  // Random blinking
  setInterval(() => {
    if (!isTyping.value && !isSpeaking.value) {
      isBlinking.value = true
      setTimeout(() => {
        isBlinking.value = false
      }, 150)
    }
  }, 2000 + Math.random() * 3000)
  
  // Initialize position
  position.value = { x: 0, y: 0 }
  
  // Start welcome sequence with interactive features
  setTimeout(() => {
    startWelcomeSequence()
  }, 1000) // Slightly longer delay for better UX
})

// Cleanup on unmount
onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  z-index: 1000;
  user-select: none;
  cursor: grab;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.chatbot-container.dragging {
  cursor: grabbing;
  transition: none;
  z-index: 1001;
}

/* Enhanced transitions for smooth following */
.chatbot-container:not(.dragging) {
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Bot Toggle Button */
.bot-toggle {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/80));
  border-radius: 50%;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px hsl(var(--primary)/30);
  transition: all 0.3s ease;
  position: relative;
  border: 2px solid hsl(var(--background));
  animation: bounce 2s ease-in-out infinite;
  user-select: none;
}

.bot-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px hsl(var(--primary)/40);
}

.bot-toggle:active {
  cursor: grabbing;
}

.bot-face {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.bot-eyes {
  display: flex;
  gap: 4px;
}

.eye {
  width: 3px;
  height: 3px;
  background: hsl(var(--background));
  border-radius: 50%;
  transition: all 0.15s ease;
  box-shadow: 0 0 2px hsl(var(--foreground)/30);
}

.eye.blink {
  height: 1px;
}

.bot-mouth {
  width: 8px;
  height: 4px;
  background: hsl(var(--background));
  border-radius: 0 0 8px 8px;
  transition: all 0.2s ease;
  box-shadow: 0 0 2px hsl(var(--foreground)/30);
}

.bot-mouth.talking {
  animation: talk 0.5s ease-in-out infinite alternate;
}

.notification-dot {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 12px;
  height: 12px;
  background: #ff4444;
  border-radius: 50%;
  border: 2px solid white;
  animation: pulse 2s ease-in-out infinite;
}

/* Side Speech Bubble */
.speech-bubble {
  position: absolute;
  top: 10px;
  right: 70px;
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 0.875rem 1.25rem;
  width: 340px;
  max-height: 70px;
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.3;
  color: #ffffff;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 10;
  pointer-events: none;
  backdrop-filter: blur(20px) saturate(1.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.speech-bubble:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.speech-bubble--welcome {
  right: 30px;
  top: 50px;
  width: 320px;
  max-height: 80px;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 1rem 1.25rem;
  background: rgba(0, 0, 0, 0.85);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 22px;
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
  animation: popIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  backdrop-filter: blur(25px) saturate(1.3);
  position: fixed;
  z-index: 10000;
}

.speech-content {
  position: relative;
  display: inline-block;
}

.typing-cursor {
  animation: blink 1.2s infinite;
  color: hsl(var(--primary));
  font-weight: 700;
  margin-left: 2px;
  font-size: 1.1em;
}

.speech-bubble-arrow {
  position: absolute;
  top: 50%;
  right: -8px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 8px solid rgba(0, 0, 0, 0.85);
}

.speech-bubble--welcome .speech-bubble-arrow {
  right: -8px;
  border-right: none;
  border-left: 8px solid rgba(0, 0, 0, 0.85);
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}

.speech-bubble-arrow::before {
  content: '';
  position: absolute;
  left: 1px;
  top: -9px;
  width: 0;
  height: 0;
  border-top: 9px solid transparent;
  border-bottom: 9px solid transparent;
  border-left: 9px solid rgba(255, 255, 255, 0.15);
}

.speech-bubble--welcome .speech-bubble-arrow::before {
  border-left-color: rgba(255, 255, 255, 0.2);
}

/* Chat Messages */
.chat-messages {
  position: absolute;
  top: 70px;
  right: 0;
  width: 320px;
  height: 400px;
  background: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 20px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
  animation: chatPopIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  backdrop-filter: blur(20px) saturate(1.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-header {
  padding: 1rem;
  background: hsl(var(--muted));
  border-bottom: 1px solid hsl(var(--border));
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bot-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.bot-avatar {
  width: 40px;
  height: 40px;
  background: hsl(var(--primary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.bot-name {
  font-weight: 600;
  color: hsl(var(--foreground));
  font-size: 0.875rem;
}

.bot-status {
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
}

.close-btn {
  background: none;
  border: none;
  color: hsl(var(--muted-foreground));
  font-size: 1rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: hsl(var(--muted));
  color: hsl(var(--foreground));
}

.messages-container {
  height: 260px;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.messages-container::-webkit-scrollbar {
  width: 4px;
}

.messages-container::-webkit-scrollbar-track {
  background: hsl(var(--muted));
}

.messages-container::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground));
  border-radius: 2px;
}

.message {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  animation: messageSlide 0.3s ease-out;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: hsl(var(--primary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.message.user .message-avatar {
  background: hsl(var(--secondary));
}

.message-content {
  max-width: 200px;
}

.message.user .message-content {
  align-items: flex-end;
}

.message-text {
  background: hsl(var(--muted));
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  line-height: 1.4;
  color: hsl(var(--foreground));
}

.message.user .message-text {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-radius: 12px 12px 4px 12px;
}

.message.bot .message-text {
  border-radius: 12px 12px 12px 4px;
}

.message-time {
  font-size: 0.625rem;
  color: hsl(var(--muted-foreground));
  margin-top: 0.25rem;
  text-align: right;
}

.message.bot .message-time {
  text-align: left;
}

.typing-indicator {
  display: flex;
  gap: 2px;
  padding: 0.75rem;
  background: hsl(var(--muted));
  border-radius: 12px 12px 12px 4px;
}

.typing-indicator span {
  width: 4px;
  height: 4px;
  background: hsl(var(--muted-foreground));
  border-radius: 50%;
  animation: typing 1.4s ease-in-out infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

.chat-input {
  padding: 1rem;
  border-top: 1px solid hsl(var(--border));
  display: flex;
  gap: 0.5rem;
  background: hsl(var(--background));
}

.message-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid hsl(var(--border));
  border-radius: 20px;
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s ease;
}

.message-input:focus {
  border-color: hsl(var(--primary));
  box-shadow: 0 0 0 2px hsl(var(--primary)/20);
}

.send-btn {
  background: hsl(var(--primary));
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.send-btn:hover {
  background: hsl(var(--primary)/90);
  transform: scale(1.05);
}

/* Animations */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes messageSlide {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}

@keyframes talk {
  0% {
    transform: scaleY(1);
  }
  100% {
    transform: scaleY(0.3);
  }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-6px);
    opacity: 1;
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-3px);
  }
}

@keyframes slideLeft {
  0% {
    opacity: 0;
    transform: translateX(20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes slideFromLeftWelcome {
  0% {
    left: -100%;
    opacity: 0.5;
  }
  100% {
    left: 50%;
    opacity: 1;
  }
}

@keyframes slideFromRightWelcome {
  0% {
    right: 10px;
    opacity: 0;
    transform: translateX(10px) scale(0.9);
  }
  100% {
    right: 30px;
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3) translateX(20px);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05) translateX(-5px);
  }
  70% {
    opacity: 1;
    transform: scale(0.95) translateX(2px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateX(0);
  }
}

@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.2) translateX(30px);
  }
  30% {
    opacity: 0.3;
    transform: scale(0.8) translateX(10px);
  }
  60% {
    opacity: 0.8;
    transform: scale(1.1) translateX(-5px);
  }
  80% {
    opacity: 1;
    transform: scale(0.95) translateX(2px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateX(0);
  }
}

@keyframes chatPopIn {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(-20px);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05) translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Comprehensive Responsive Design */

/* Extra Small Devices (phones, 480px and down) */
@media (max-width: 480px) {
  .chatbot-container {
    position: fixed;
    bottom: 0.5rem;
    right: 0.5rem;
    z-index: 1000;
  }

  .bot-toggle {
    width: 48px;
    height: 48px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .chat-messages {
    width: calc(100vw - 1rem);
    max-width: 300px;
    height: 60vh;
    max-height: 400px;
    bottom: 60px;
    right: 0.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  }
  
  .messages-container {
    height: calc(60vh - 140px);
    max-height: 260px;
    padding: 0.75rem;
  }

  .chat-header {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }

  .chat-input-container {
    padding: 0.75rem;
  }

  .chat-input {
    font-size: 0.875rem;
    padding: 0.625rem 1rem;
  }

  .send-button {
    width: 36px;
    height: 36px;
    min-width: 36px;
  }

  .message {
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.4;
  }

  .message-content {
    padding: 0.625rem 0.875rem;
    border-radius: 12px;
  }

  /* Adjust speech bubble positioning for mobile */
  .speech-bubble {
    width: calc(100vw - 1rem);
    max-width: 280px;
    right: 0.5rem;
    font-size: 0.8125rem;
    padding: 0.75rem;
    border-radius: 10px;
  }
}

/* Small Devices (tablets, 481px to 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .chatbot-container {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 1000;
  }

  .bot-toggle {
    width: 52px;
    height: 52px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }

  .chat-messages {
    width: 320px;
    height: 65vh;
    max-height: 450px;
    bottom: 65px;
    right: 1rem;
    border-radius: 16px;
  }
  
  .messages-container {
    height: calc(65vh - 140px);
    max-height: 310px;
    padding: 1rem;
  }

  .chat-header {
    padding: 1rem;
    font-size: 0.9375rem;
  }

  .chat-input-container {
    padding: 1rem;
  }

  .chat-input {
    font-size: 0.9375rem;
    padding: 0.75rem 1rem;
  }

  .send-button {
    width: 40px;
    height: 40px;
    min-width: 40px;
  }

  .message {
    margin-bottom: 1rem;
    font-size: 0.9375rem;
    line-height: 1.5;
  }

  .message-content {
    padding: 0.75rem 1rem;
    border-radius: 14px;
  }

  .speech-bubble {
    width: 300px;
    right: 1rem;
    font-size: 0.875rem;
    padding: 1rem;
    border-radius: 12px;
  }
}

/* Medium Devices (tablets/small laptops, 769px to 1024px) */
@media (min-width: 769px) and (max-width: 1024px) {
  .chatbot-container {
    position: fixed;
    bottom: 1.25rem;
    right: 1.25rem;
    z-index: 1000;
  }

  .bot-toggle {
    width: 56px;
    height: 56px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  .chat-messages {
    width: 360px;
    height: 500px;
    bottom: 70px;
    right: 1.25rem;
    border-radius: 18px;
  }
  
  .messages-container {
    height: 350px;
    padding: 1.25rem;
  }

  .chat-header {
    padding: 1.25rem;
  }

  .chat-input-container {
    padding: 1.25rem;
  }

  .message {
    margin-bottom: 1.25rem;
  }

  .message-content {
    padding: 0.875rem 1.125rem;
    border-radius: 16px;
  }

  .speech-bubble {
    width: 340px;
    right: 1.25rem;
    padding: 1.25rem;
    border-radius: 14px;
  }
}

/* Large Devices (desktops, 1025px to 1440px) */
@media (min-width: 1025px) and (max-width: 1440px) {
  .chatbot-container {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 1000;
  }

  .bot-toggle {
    width: 60px;
    height: 60px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  .chat-messages {
    width: 380px;
    height: 520px;
    bottom: 75px;
    right: 1.5rem;
    border-radius: 20px;
  }
  
  .messages-container {
    height: 370px;
    padding: 1.5rem;
  }

  .chat-header {
    padding: 1.5rem;
  }

  .chat-input-container {
    padding: 1.5rem;
  }

  .message {
    margin-bottom: 1.5rem;
  }

  .message-content {
    padding: 1rem 1.25rem;
    border-radius: 18px;
  }

  .speech-bubble {
    width: 360px;
    right: 1.5rem;
    padding: 1.5rem;
    border-radius: 16px;
  }
}

/* Extra Large Devices (large desktops, 1441px and up) */
@media (min-width: 1441px) {
  .chatbot-container {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 1000;
  }
  
  .bot-toggle {
    width: 64px;
    height: 64px;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
  }

  .chat-messages {
    width: 400px;
    height: 560px;
    bottom: 80px;
    right: 2rem;
    border-radius: 24px;
  }
  
  .messages-container {
    height: 400px;
    padding: 2rem;
  }

  .chat-header {
    padding: 1.75rem 2rem;
    font-size: 1.0625rem;
  }

  .chat-input-container {
    padding: 1.75rem 2rem;
  }

  .chat-input {
    font-size: 1rem;
    padding: 0.875rem 1.25rem;
  }

  .send-button {
    width: 44px;
    height: 44px;
    min-width: 44px;
  }

  .message {
    margin-bottom: 1.75rem;
    font-size: 1rem;
  }

  .message-content {
    padding: 1.125rem 1.5rem;
    border-radius: 20px;
  }

  .speech-bubble {
    width: 380px;
    right: 2rem;
    font-size: 0.9375rem;
    padding: 1.75rem;
    border-radius: 18px;
  }
}

/* Touch-friendly improvements for mobile */
@media (max-width: 768px) and (pointer: coarse) {
  .bot-toggle {
    min-height: 48px; /* Ensure minimum touch target size */
    min-width: 48px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
  }

  .send-button {
    min-height: 44px;
    min-width: 44px;
    touch-action: manipulation;
  }

  .chat-input {
    min-height: 44px;
    touch-action: manipulation;
  }

  /* Increase tap area for close button */
  .chat-header button {
    min-height: 44px;
    min-width: 44px;
    padding: 0.5rem;
  }
}

/* Landscape orientation adjustments for phones */
@media (max-width: 768px) and (orientation: landscape) {
  .chat-messages {
    height: 80vh;
    max-height: 320px;
    width: 280px;
  }
  
  .messages-container {
    height: calc(80vh - 120px);
    max-height: 200px;
  }

  .chatbot-container {
    bottom: 0.25rem;
    right: 0.25rem;
  }

  .bot-toggle {
    width: 44px;
    height: 44px;
  }

  .speech-bubble {
    width: 260px;
    font-size: 0.75rem;
    padding: 0.625rem;
  }
}

/* High DPI/Retina display optimizations */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .bot-toggle {
    border-width: 0.5px; /* Thinner borders on high DPI displays */
  }
  
  .chat-messages {
    border-width: 0.5px;
  }
}

/* Dark theme adjustments */
.dark .bot-toggle {
  border-color: hsl(var(--border));
}

.dark .chat-messages {
  background: hsl(var(--card));
  border-color: hsl(var(--border));
}

/* Screen reader only content for accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Performance optimizations */
.chatbot-container {
  will-change: transform;
  contain: layout style;
}

.chat-messages {
  will-change: auto;
  contain: layout;
}

.message {
  contain: layout;
}

/* Improved focus styles for accessibility */
.message-input:focus,
.send-btn:focus,
.close-btn:focus,
.bot-toggle:focus {
  outline: 2px solid #007acc;
  outline-offset: 2px;
}

/* Disabled states */
.message-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .chat-messages {
    border-width: 2px;
  }
  
  .message-text {
    border: 1px solid;
  }
}

/* Interactive animations */
@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg) scale(1.05); }
  75% { transform: rotate(5deg) scale(1.05); }
}

@keyframes pulse-attention {
  0%, 100% { transform: scale(1); box-shadow: 0 6px 20px hsl(var(--primary)/30); }
  50% { transform: scale(1.1); box-shadow: 0 8px 25px hsl(var(--primary)/50); }
}

/* Enhanced speech bubble styles */
.speech-bubble {
  animation: slideInBounce 0.5s ease-out;
  transform-origin: bottom left;
}

@keyframes slideInBounce {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.8);
  }
  60% {
    opacity: 1;
    transform: translateY(-2px) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.speech-bubble--welcome {
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/90));
  color: hsl(var(--primary-foreground));
  border: 2px solid hsl(var(--primary)/20);
}

/* Speaking animation for bot mouth */
.bot-mouth.talking {
  animation: speak 0.3s ease-in-out infinite alternate;
}

@keyframes speak {
  0% { transform: scaleY(1); }
  100% { transform: scaleY(0.6); }
}

/* Synchronized speech bubble effects */
.speech-bubble.synchronized {
  border-color: hsl(var(--primary)/60) !important;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 0 2px hsl(var(--primary)/30),
    0 0 16px hsl(var(--primary)/40),
    inset 0 1px 0 rgba(255, 255, 255, 0.25) !important;
  animation: 
    slideInBounce 0.5s ease-out,
    syncPulse 2s ease-in-out infinite;
}

@keyframes syncPulse {
  0%, 100% { 
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.4),
      0 0 0 2px hsl(var(--primary)/20),
      0 0 12px hsl(var(--primary)/30),
      inset 0 1px 0 rgba(255, 255, 255, 0.25);
  }
  50% { 
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.4),
      0 0 0 2px hsl(var(--primary)/40),
      0 0 20px hsl(var(--primary)/50),
      inset 0 1px 0 rgba(255, 255, 255, 0.25);
  }
}

/* Enhanced typing indicator for synchronized speech */
.speech-bubble.synchronized .typing-indicator::after {
  border-color: hsl(var(--primary)) !important;
}

/* Following user animation class */
.chatbot-container.following {
  transition: transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 1001;
}

/* Attention-seeking pulse */
.bot-toggle.seeking-attention {
  animation: pulse-attention 1.5s ease-in-out infinite;
}

/* Typing cursor animation */
.typing-cursor {
  animation: blink 1s ease-in-out infinite;
  font-weight: bold;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .chatbot-container *,
  .chat-messages *,
  .speech-bubble * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .chatbot-container {
    transition: none !important;
  }
}
</style>
