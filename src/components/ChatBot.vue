<template>
  <div 
    class="chatbot-container"
    :class="{ 
      'expanded': isOpen, 
      'dragging': isDragging 
    }"
    :style="getPositionStyle()"
    @mousedown="startDragging"
  >
    <!-- Chat Messages -->
    <div v-if="isOpen" class="chat-messages" @mousedown.stop>
      <div class="chat-header">
                  <div class="bot-info">
            <div class="bot-avatar">🤖</div>
            <div>
              <div class="bot-name">Cruso</div>
              <div class="bot-status">AI Assistant</div>
            </div>
          </div>
        <button @click="closeChat" class="close-btn">✕</button>
      </div>
      
      <div class="messages-container" ref="messagesContainer">
        <div 
          v-for="message in messages" 
          :key="message.id"
          :class="['message', message.type]"
        >
          <div class="message-avatar" v-if="message.type === 'bot'">🤖</div>
          <div class="message-content">
            <div class="message-text">{{ message.text }}</div>
            <div class="message-time">{{ message.time }}</div>
          </div>
          <div class="message-avatar" v-if="message.type === 'user'">👨‍💻</div>
        </div>
        
        <div v-if="isTyping" class="message bot">
          <div class="message-avatar">🤖</div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="chat-input">
        <input 
          v-model="currentMessage"
          @keypress.enter="sendMessage"
          placeholder="Ask Cruso anything about my work..."
          class="message-input"
        />
        <button @click="sendMessage" class="send-btn">📤</button>
      </div>
    </div>

    <!-- Speech Bubble -->
    <div 
      v-if="showSpeechBubble" 
      class="speech-bubble"
      :class="{ 'speech-bubble--welcome': showingWelcome }"
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
        <div class="bot-mouth" :class="{ talking: isTyping }"></div>
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

import { ref, onMounted, nextTick } from 'vue'

interface Props {
  username?: string
}

const props = defineProps<Props>()

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

// Predefined responses about the portfolio
const getResponses = (username?: string) => [
  `Hi ${username || 'there'}! 👋 This is Robinson! I'm excited to share my portfolio with you. How can I help you today? 🤖`,
  "I'm a passionate developer specializing in AI-powered applications and cutting-edge agricultural technology! 🚀",
  "My CodeSensei project is an AI-powered code analysis tool that transforms applications into interactive learning platforms! 💻",
  "Check out my AGRO Frontend - it's a modern agricultural management system with advanced analytics! 🌱",
  "I'm based in beautiful Bangalore, India, the Silicon Valley of India! Always excited about innovative tech! 📍",
  "Want to collaborate? Scroll down to my contact form and let's build something amazing together! 💌",
  "My tech arsenal includes JavaScript, Python, React, Vue.js, AI/ML, Docker, and many more powerful tools! ⚡",
  `Nice to meet you, ${username || 'friend'}! I'm Cruso, Robinson's digital assistant! Drag me anywhere and let's chat about technology! 🎮`,
  "My portfolio showcases current innovations and exciting future projects that will change the world! 🔮",
  "Need a tour? I know every section of this portfolio like the back of my digital hand! 🧭",
  "I love discussing AI, machine learning, and how technology can solve real-world problems! 🧠",
  `${username ? `${username}, you're awesome for checking out` : 'Thanks for exploring'} Robinson's work! Ask me anything technical! 🚀`
]

const responses = getResponses(props.username)

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
    // Welcome message with username
    setTimeout(() => {
      const welcomeMsg = props.username 
        ? `Hi ${props.username}! 👋 This is Robinson! I'm excited to share my portfolio with you. How can I help you today? 🤖`
        : responses[0]
      addBotMessage(welcomeMsg)
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
    const response = await fetch('http://localhost:8000/api/chat/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        username: props.username || 'Anonymous'
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
    // Top-right position for welcome (slightly to the right)
    return {
      top: '150px',
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
  // Default position (top-right)
  return {
    top: '10px',
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

// Initial welcome sequence with speech bubble
function startWelcomeSequence() {
  if (props.username && isInitialLoad.value) {
    showingWelcome.value = true
    
    // Start in paint canvas with welcome message
    setTimeout(() => {
      showSpeechBubble.value = true
      fullWelcomeMessage.value = `Hi ${props.username}! Would you like to paint? Ask me any questions if you need help!`
      
      typeMessage(fullWelcomeMessage.value, () => {
        // After message completes, wait then move to top-left and sleep
        setTimeout(() => {
          showSpeechBubble.value = false
          showingWelcome.value = false
          position.value = { x: 0, y: 0 } // Move to top-left
          isInitialLoad.value = false
        }, 2000) // Stay visible for 2 seconds
      })
    }, 1000)
  }
}

// Blinking animation
onMounted(() => {
  // Random blinking
  setInterval(() => {
    if (!isTyping.value) {
      isBlinking.value = true
      setTimeout(() => {
        isBlinking.value = false
      }, 150)
    }
  }, 2000 + Math.random() * 3000)
  
  // Initialize position
  position.value = { x: 0, y: 0 }
  
  // Start welcome sequence if user has a name
  setTimeout(() => {
    startWelcomeSequence()
  }, 500)
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
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 16px;
  padding: 0.75rem 1rem;
  width: 320px;
  max-height: 60px;
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.3;
  color: hsl(var(--foreground));
  box-shadow: 
    0 4px 12px hsl(var(--foreground)/8),
    0 2px 4px hsl(var(--foreground)/5);
  animation: slideLeft 0.4s ease-out;
  z-index: 10;
  pointer-events: none;
  overflow: hidden;
}

.speech-bubble--welcome {
  right: 30px;
  top: 60px;
  width: 280px;
  max-height: 70px;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 0.875rem 1rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
  color: white;
  border-radius: 18px;
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4), 0 4px 12px rgba(139, 92, 246, 0.3);
  animation: slideFromRightWelcome 0.8s ease-out;
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
  left: -8px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid hsl(var(--card));
}

.speech-bubble--welcome .speech-bubble-arrow {
  left: -8px;
  border-left: none;
  border-right: 8px solid #8b5cf6;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}

.speech-bubble-arrow::before {
  content: '';
  position: absolute;
  right: 1px;
  top: -9px;
  width: 0;
  height: 0;
  border-top: 9px solid transparent;
  border-bottom: 9px solid transparent;
  border-right: 9px solid hsl(var(--border));
}

.speech-bubble--welcome .speech-bubble-arrow {
  border-right-color: hsl(var(--card));
}

.speech-bubble--welcome .speech-bubble-arrow::before {
  border-right-color: hsl(var(--primary)/20);
}

/* Chat Messages */
.chat-messages {
  position: absolute;
  top: 70px;
  right: 0;
  width: 320px;
  height: 400px;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 16px;
  box-shadow: 0 20px 40px hsl(var(--foreground)/15);
  overflow: hidden;
  animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

/* Mobile responsiveness */
@media (max-width: 768px) {
  .chat-messages {
    width: 280px;
    height: 350px;
  }
  
  .messages-container {
    height: 220px;
  }
  
  .bot-toggle {
    width: 50px;
    height: 50px;
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
</style>
