<template>
  <section class="paint-hero">
    <div class="paint-window">
      <!-- Classic Paint Title Bar -->
      <div class="paint-title-bar">
        <div class="title-text">
          <span>📎</span>
          Untitled - Paint
        </div>
        <div class="window-controls">
          <button class="window-btn minimize">_</button>
          <button class="window-btn maximize">□</button>
          <button class="window-btn close">×</button>
        </div>
      </div>

      <!-- Menu Bar -->
      <div class="paint-menu-bar">
        <div class="menu-item" @click="toggleFileMenu">File
          <div v-if="showFileMenu" class="dropdown-menu">
            <div class="menu-option" @click="newCanvas">New</div>
            <div class="menu-option" @click="triggerFileUpload">Open...</div>
            <div class="menu-option" @click="loadExistingArtwork()">Load Existing...</div>
            <hr class="menu-separator">
            <div class="menu-option" @click="saveImage">
              Save 
              <span v-if="saveStatus === 'saving'" class="save-indicator">💾</span>
              <span v-else-if="saveStatus === 'saved'" class="save-indicator">✅</span>
              <span v-else-if="saveStatus === 'error'" class="save-indicator">❌</span>
            </div>
            <div class="menu-option" @click="downloadImage">Save As...</div>
            <hr class="menu-separator">
            <div class="menu-option" @click="clearCanvas">Clear All</div>
          </div>
        </div>
        <div class="menu-item">Edit</div>
        <div class="menu-item">View</div>
        <div class="menu-item">Image</div>
        <div class="menu-item">Colors</div>
        <div class="menu-item">Help</div>
      </div>

      <!-- Hidden file input for image upload -->
      <input 
        ref="fileInput" 
        type="file" 
        accept="image/*" 
        @change="handleImageUpload" 
        style="display: none"
      />

      <!-- Main Paint Area -->
      <div class="paint-main">
        <!-- Left Tool Palette -->
        <div class="tool-palette">
          <div class="tool-grid">
            <button 
              @click="setTool('select')" 
              :class="{ active: currentTool === 'select' }"
              class="paint-tool"
              title="Select"
            >
              ⬚
            </button>
            <button 
              @click="setTool('freeform')" 
              :class="{ active: currentTool === 'freeform' }"
              class="paint-tool"
              title="Free-form Select"
            >
              ◯
            </button>
            <button 
              @click="setTool('eraser')" 
              :class="{ active: currentTool === 'eraser' }"
              class="paint-tool"
              title="Eraser/Color Eraser"
            >
              ⬜
            </button>
            <button 
              @click="setTool('fill')" 
              :class="{ active: currentTool === 'fill' }"
              class="paint-tool"
              title="Fill With Color"
            >
              🪣
            </button>
            <button 
              @click="setTool('picker')" 
              :class="{ active: currentTool === 'picker' }"
              class="paint-tool"
              title="Pick Color"
            >
              💧
            </button>
            <button 
              @click="setTool('magnifier')" 
              :class="{ active: currentTool === 'magnifier' }"
              class="paint-tool"
              title="Magnifier"
            >
              🔍
            </button>
            <button 
              @click="setTool('pencil')" 
              :class="{ active: currentTool === 'pencil' }"
              class="paint-tool"
              title="Pencil"
            >
              ✏️
            </button>
            <button 
              @click="setTool('brush')" 
              :class="{ active: currentTool === 'brush' }"
              class="paint-tool"
              title="Brush"
            >
              🖌️
            </button>
            <button 
              @click="setTool('airbrush')" 
              :class="{ active: currentTool === 'airbrush' }"
              class="paint-tool"
              title="Airbrush"
            >
              💨
            </button>
            <button 
              @click="setTool('text')" 
              :class="{ active: currentTool === 'text' }"
              class="paint-tool"
              title="Text"
            >
              A
            </button>
            <button 
              @click="setTool('line')" 
              :class="{ active: currentTool === 'line' }"
              class="paint-tool"
              title="Line"
            >
              ╱
            </button>
            <button 
              @click="setTool('curve')" 
              :class="{ active: currentTool === 'curve' }"
              class="paint-tool"
              title="Curve"
            >
              ∿
            </button>
            <button 
              @click="setTool('rectangle')" 
              :class="{ active: currentTool === 'rectangle' }"
              class="paint-tool"
              title="Rectangle"
            >
              ▭
            </button>
            <button 
              @click="setTool('polygon')" 
              :class="{ active: currentTool === 'polygon' }"
              class="paint-tool"
              title="Polygon"
            >
              ⬟
            </button>
            <button 
              @click="setTool('ellipse')" 
              :class="{ active: currentTool === 'ellipse' }"
              class="paint-tool"
              title="Ellipse"
            >
              ○
            </button>
            <button 
              @click="setTool('rounded')" 
              :class="{ active: currentTool === 'rounded' }"
              class="paint-tool"
              title="Rounded Rectangle"
            >
              ▢
            </button>
          </div>
        </div>

        <!-- Canvas and Right Area -->
        <div class="canvas-area">
          <!-- Canvas Container -->
          <div class="canvas-container">
            <canvas 
              ref="canvas"
              @mousedown="startDrawing"
              @mousemove="draw"
              @mouseup="stopDrawing"
              @mouseleave="stopDrawing"
              @touchstart="handleTouch"
              @touchmove="handleTouch"
              @touchend="stopDrawing"
              class="paint-canvas"
            ></canvas>
          </div>
        </div>
      </div>

      <!-- Bottom Color Palette -->
      <div class="color-palette">
        <div class="current-colors">
          <div class="color-display">
            <div class="color-box primary" :style="{ backgroundColor: brushColor }"></div>
            <div class="color-box secondary" :style="{ backgroundColor: secondaryColor }"></div>
          </div>
        </div>
        <div class="color-grid">
          <div 
            v-for="color in colorPalette"
            :key="color"
            @click="selectColor(color)"
            @contextmenu.prevent="selectSecondaryColor(color)"
            class="color-cell"
            :style="{ backgroundColor: color }"
            :class="{ active: color === brushColor }"
          ></div>
        </div>
      </div>

      <!-- Status Bar -->
      <div class="status-bar">
        <div class="status-left">
          <div class="status-item">
            <span v-if="saveStatus === 'saving'">💾 Saving...</span>
            <span v-else-if="saveStatus === 'saved'">✅ Saved</span>
            <span v-else-if="saveStatus === 'error'">❌ Save failed</span>
            <span v-else-if="canvasId">🤝 Collaborative artwork</span>
            <span v-else>🎨 New artwork</span>
          </div>
          <div class="status-item" v-if="canvasId">ID: {{ canvasId }}</div>
        </div>
        <div class="status-right">
          <div class="status-item">{{ canvasSize.width }} x {{ canvasSize.height }}px</div>
          <div class="status-item">{{ contributors.length }} artist{{ contributors.length === 1 ? '' : 's' }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/*
  Classic Microsoft Paint interface replica for interactive portfolio
  Features authentic Windows 95/98 Paint layout with tool palette, color grid, and canvas
*/

import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { API_ENDPOINTS } from '@/config/api'

interface DrawingData {
  strokes: Array<{
    x: number
    y: number
    prevX: number
    prevY: number
    color: string
    size: number
    tool: string
    user: string
  }>
  contributors: Array<{
    name: string
    color: string
  }>
}

// No props needed - always use "visitor" as default username

const canvas = ref<HTMLCanvasElement>()
const isDrawing = ref(false)
const currentTool = ref('brush')
const brushColor = ref('#000000')
const secondaryColor = ref('#ffffff')
const brushSize = ref(3)
const contributors = ref<Array<{ name: string; color: string }>>([])
const canvasSize = ref({ width: 800, height: 600 })
const showFileMenu = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const startPos = ref({ x: 0, y: 0 })
const currentShape = ref<{ x: number, y: number, width: number, height: number } | null>(null)

// Canvas state tracking
const canvasId = ref<string | null>(null)
const isNewCanvas = ref(true)
const saveStatus = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')
const lastSaveTime = ref<Date | null>(null)

const colorPalette = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#808040', '#004040', '#0080FF', '#004080', '#8000FF', '#804000', '#FF8040', '#800040',
  '#FFFFFF', '#C0C0C0', '#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF',
  '#FFFF80', '#00FF80', '#80FFFF', '#8080FF', '#FF0080', '#FF8000', '#C0C0C0', '#400000'
]

let ctx: CanvasRenderingContext2D | null = null
let lastX = 0
let lastY = 0
let drawingData: DrawingData = {
  strokes: [],
  contributors: []
}

function initCanvas() {
  if (!canvas.value) return
  
  // Set canvas size to match container
  const container = canvas.value.parentElement
  if (container) {
    canvasSize.value.width = container.clientWidth
    canvasSize.value.height = container.clientHeight
  }
  
  canvas.value.width = canvasSize.value.width
  canvas.value.height = canvasSize.value.height
  
  ctx = canvas.value.getContext('2d')
  if (!ctx) return
  
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvasSize.value.width, canvasSize.value.height)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  
  loadCanvas()
}

function setTool(tool: string) {
  currentTool.value = tool
}

function selectColor(color: string) {
  brushColor.value = color
}

function selectSecondaryColor(color: string) {
  secondaryColor.value = color
}

function startDrawing(e: MouseEvent) {
  if (!ctx || !canvas.value) return
  
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  startPos.value = { x, y }
  isDrawing.value = true
  
  // Handle different tools
  switch (currentTool.value) {
    case 'fill':
      floodFill(x, y, brushColor.value)
      return
    case 'picker':
      pickColor(x, y)
      return
    case 'text':
      addText(x, y)
      return
    default:
      ctx.beginPath()
      ctx.moveTo(x, y)
      addContributor()
  }
}

function draw(e: MouseEvent) {
  if (!isDrawing.value || !ctx || !canvas.value) return
  
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  // Handle shape tools differently
  if (['rectangle', 'ellipse', 'line'].includes(currentTool.value)) {
    drawShape(x, y)
    return
  }
  
  // Handle drawing tools
  if (currentTool.value === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineWidth = brushSize.value * 2
  } else if (currentTool.value === 'airbrush') {
    drawAirbrush(x, y)
    return
  } else {
    ctx.globalCompositeOperation = 'source-over'
    ctx.strokeStyle = brushColor.value
    ctx.lineWidth = brushSize.value
  }
  
  ctx.lineTo(x, y)
  ctx.stroke()
  
  // Store stroke data
  drawingData.strokes.push({
    x,
    y,
    prevX: lastX || x,
    prevY: lastY || y,
    color: brushColor.value,
    size: brushSize.value,
    tool: currentTool.value,
    user: 'visitor'
  })
  
  lastX = x
  lastY = y
}

function stopDrawing() {
  if (!isDrawing.value) return
  
  isDrawing.value = false
  if (ctx) {
    ctx.beginPath()
  }
  
  saveCanvas()
}

function handleTouch(e: TouchEvent) {
  e.preventDefault()
  const touch = e.touches[0]
  const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
    e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
    clientX: touch.clientX,
    clientY: touch.clientY
  })
  
  if (e.type === 'touchstart') startDrawing(mouseEvent)
  else if (e.type === 'touchmove') draw(mouseEvent)
  else stopDrawing()
}

function clearCanvas() {
  if (!ctx) return
  
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvasSize.value.width, canvasSize.value.height)
  
  drawingData = {
    strokes: [],
    contributors: []
  }
  
  contributors.value = []
  saveCanvas()
}

function resetCanvasState() {
  // Reset canvas state for new artwork
  canvasId.value = null
  isNewCanvas.value = true
  saveStatus.value = 'idle'
  lastSaveTime.value = null
  
  // Clear localStorage
  localStorage.removeItem('portfolioCanvasId')
  localStorage.removeItem('portfolioPaintData')
}

function addContributor() {
  const username = 'visitor'
  
  if (!contributors.value.find(c => c.name === username)) {
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316']
    const color = colors[contributors.value.length % colors.length]
    
    contributors.value.push({ name: username, color })
    drawingData.contributors = [...contributors.value]
  }
}

// File Menu Functions
function toggleFileMenu() {
  showFileMenu.value = !showFileMenu.value
}

function newCanvas() {
  resetCanvasState()
  clearCanvas()
  showFileMenu.value = false
  console.log('🎨 Started new canvas')
}

function triggerFileUpload() {
  fileInput.value?.click()
  showFileMenu.value = false
}

function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !ctx) return

  const img = new Image()
  img.onload = () => {
    if (!ctx) return
    
    // Clear canvas first
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvasSize.value.width, canvasSize.value.height)
    
    // Draw uploaded image, scaling to fit canvas
    const scale = Math.min(
      canvasSize.value.width / img.width,
      canvasSize.value.height / img.height
    )
    const width = img.width * scale
    const height = img.height * scale
    const x = (canvasSize.value.width - width) / 2
    const y = (canvasSize.value.height - height) / 2
    
    ctx.drawImage(img, x, y, width, height)
    saveCanvas()
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

function saveImage() {
  saveCanvas()
  showFileMenu.value = false
}

function downloadImage() {
  if (!canvas.value) return
  
  const link = document.createElement('a')
  link.download = 'my-painting.png'
  link.href = canvas.value.toDataURL()
  link.click()
  
  showFileMenu.value = false
}

// Tool Functions
function floodFill(startX: number, startY: number, fillColor: string) {
  if (!ctx || !canvas.value) return
  
  const imageData = ctx.getImageData(0, 0, canvasSize.value.width, canvasSize.value.height)
  const data = imageData.data
  const startPos = (Math.floor(startY) * canvasSize.value.width + Math.floor(startX)) * 4
  
  const startR = data[startPos]
  const startG = data[startPos + 1]
  const startB = data[startPos + 2]
  
  const hex = fillColor.replace('#', '')
  const fillR = parseInt(hex.substr(0, 2), 16)
  const fillG = parseInt(hex.substr(2, 2), 16)
  const fillB = parseInt(hex.substr(4, 2), 16)
  
  if (startR === fillR && startG === fillG && startB === fillB) return
  
  const stack: Array<[number, number]> = [[Math.floor(startX), Math.floor(startY)]]
  
  while (stack.length) {
    const [x, y] = stack.pop()!
    if (x < 0 || x >= canvasSize.value.width || y < 0 || y >= canvasSize.value.height) continue
    
    const pos = (y * canvasSize.value.width + x) * 4
    
    if (data[pos] === startR && data[pos + 1] === startG && data[pos + 2] === startB) {
      data[pos] = fillR
      data[pos + 1] = fillG
      data[pos + 2] = fillB
      data[pos + 3] = 255
      
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
    }
  }
  
  ctx.putImageData(imageData, 0, 0)
  saveCanvas()
}

function pickColor(x: number, y: number) {
  if (!ctx) return
  
  const imageData = ctx.getImageData(x, y, 1, 1)
  const data = imageData.data
  const r = data[0]
  const g = data[1]
  const b = data[2]
  
  const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
  brushColor.value = hex
}

function addText(x: number, y: number) {
  const text = prompt('Enter text:')
  if (!text || !ctx) return
  
  ctx.font = '16px Arial'
  ctx.fillStyle = brushColor.value
  ctx.fillText(text, x, y)
  saveCanvas()
}

function drawShape(currentX: number, currentY: number) {
  if (!ctx || !canvas.value) return
  
  // Clear and redraw everything for live preview
  const imageData = ctx.getImageData(0, 0, canvasSize.value.width, canvasSize.value.height)
  ctx.putImageData(imageData, 0, 0)
  
  ctx.strokeStyle = brushColor.value
  ctx.lineWidth = brushSize.value
  ctx.beginPath()
  
  const startX = startPos.value.x
  const startY = startPos.value.y
  
  switch (currentTool.value) {
    case 'rectangle':
      ctx.rect(startX, startY, currentX - startX, currentY - startY)
      break
    case 'ellipse':
      const radiusX = Math.abs(currentX - startX) / 2
      const radiusY = Math.abs(currentY - startY) / 2
      const centerX = startX + (currentX - startX) / 2
      const centerY = startY + (currentY - startY) / 2
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI)
      break
    case 'line':
      ctx.moveTo(startX, startY)
      ctx.lineTo(currentX, currentY)
      break
  }
  
  ctx.stroke()
}

function drawAirbrush(x: number, y: number) {
  if (!ctx) return
  
  const density = 20
  const radius = brushSize.value * 3
  
  ctx.fillStyle = brushColor.value
  
  for (let i = 0; i < density; i++) {
    const offsetX = (Math.random() - 0.5) * radius
    const offsetY = (Math.random() - 0.5) * radius
    const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY)
    
    if (distance <= radius) {
      ctx.globalAlpha = 0.1
      ctx.fillRect(x + offsetX, y + offsetY, 1, 1)
    }
  }
  
  ctx.globalAlpha = 1
}

function saveCanvas() {
  if (!canvas.value) return
  
  const imageData = canvas.value.toDataURL()
  const saveData = {
    imageData,
    drawingData,
    timestamp: Date.now()
  }
  
  // Save locally
  localStorage.setItem('portfolioPaintData', JSON.stringify(saveData))
  
  // Also save to backend (async, non-blocking)
  saveCanvasToBackend(imageData)
}

async function saveCanvasToBackend(imageData: string) {
  saveStatus.value = 'saving'
  
  // Define artwork data outside try block so it's accessible in catch
  const artworkData = {
    username: 'visitor',
    title: `Artwork by visitor - ${new Date().toLocaleString()}`,
    image_data: imageData,
    contributors: contributors.value.map(c => ({ name: c.name, color: c.color })),
    is_public: true
  }
  
  try {
    
    let response: Response
    
    // Always use POST for saving (let backend handle create vs update)
    response = await fetch(API_ENDPOINTS.CANVAS_SAVE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(artworkData)
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Artwork saved:', result.id || 'success')
      
      if (result.id && !canvasId.value) {
        canvasId.value = result.id
        isNewCanvas.value = false
        localStorage.setItem('portfolioCanvasId', result.id)
      }
    }
    
    if (response.ok) {
      saveStatus.value = 'saved'
      lastSaveTime.value = new Date()
      
      // Clear saved status after 3 seconds
      setTimeout(() => {
        if (saveStatus.value === 'saved') {
          saveStatus.value = 'idle'
        }
      }, 3000)
    } else {
      throw new Error(`Save failed with status: ${response.status}`)
    }
    
  } catch (error) {
    console.log('❌ Backend not available, saving canvas locally:', error)
    
    // Fallback: Save to localStorage
    try {
      const localId = canvasId.value || `canvas_${Date.now()}`
      const localArtwork = {
        ...artworkData,
        id: localId,
        saved_locally: true,
        saved_at: new Date().toISOString()
      }
      
      // Save to localStorage
      const existingArtworks = JSON.parse(localStorage.getItem('portfolioCanvasArt') || '[]')
      const existingIndex = existingArtworks.findIndex((art: any) => art.id === localId)
      
      if (existingIndex >= 0) {
        existingArtworks[existingIndex] = localArtwork
      } else {
        existingArtworks.push(localArtwork)
      }
      
      localStorage.setItem('portfolioCanvasArt', JSON.stringify(existingArtworks))
      
      if (!canvasId.value) {
        canvasId.value = localId
        isNewCanvas.value = false
        localStorage.setItem('portfolioCanvasId', localId)
      }
      
      saveStatus.value = 'saved'
      lastSaveTime.value = new Date()
      console.log('✅ Canvas saved locally successfully!')
      
      // Clear saved status after 3 seconds
      setTimeout(() => {
        if (saveStatus.value === 'saved') {
          saveStatus.value = 'idle'
        }
      }, 3000)
      
    } catch (localError) {
      console.error('Failed to save locally:', localError)
      saveStatus.value = 'error'
      
      // Clear error status after 3 seconds
      setTimeout(() => {
        if (saveStatus.value === 'error') {
          saveStatus.value = 'idle'
        }
      }, 3000)
    }
  }
}

function loadCanvas() {
  const savedData = localStorage.getItem('portfolioPaintData')
  const savedCanvasId = localStorage.getItem('portfolioCanvasId')
  
  // Load canvas ID if exists
  if (savedCanvasId) {
    canvasId.value = savedCanvasId
    isNewCanvas.value = false
  }
  
  if (!savedData || !ctx || !canvas.value) return
  
  try {
    const data = JSON.parse(savedData)
    
    const img = new Image()
    img.onload = () => {
      ctx!.drawImage(img, 0, 0)
    }
    img.src = data.imageData
    
    if (data.drawingData) {
      drawingData = data.drawingData
      contributors.value = data.drawingData.contributors || []
    }
    
    console.log(`📄 Canvas loaded ${canvasId.value ? '(existing artwork)' : '(new artwork)'}`)
  } catch (error) {
    console.log('Could not load saved canvas')
  }
}

// Load public artworks from backend (could be used for a gallery feature)
async function loadPublicArtworks() {
  try {
    const response = await fetch(`${API_ENDPOINTS.CANVAS_GALLERY}?limit=10`)
    if (response.ok) {
      const artworks = await response.json()
      console.log('🎨 Public artworks available:', artworks.length)
      return artworks
    }
  } catch (error) {
    console.log('❌ Could not load public artworks from backend')
    return []
  }
}

// Load existing artwork by ID for collaboration
async function loadExistingArtwork(artworkId?: string) {
  if (!artworkId) {
    // Prompt user for artwork ID
    const promptResult = prompt('Enter artwork ID to collaborate on:')
    if (!promptResult) return
    artworkId = promptResult
  }
  
  try {
    const response = await fetch(`${API_ENDPOINTS.CANVAS_SAVE}/${artworkId}`)
    if (response.ok) {
      const artwork = await response.json()
      
      // Load the artwork data
      canvasId.value = artwork.id
      isNewCanvas.value = false
      
      // Load contributors
      if (artwork.contributors) {
        contributors.value = artwork.contributors
        drawingData.contributors = artwork.contributors
      }
      
      // Load image data to canvas
      if (artwork.image_data && ctx) {
        const img = new Image()
        img.onload = () => {
          if (ctx) {
            ctx.clearRect(0, 0, canvasSize.value.width, canvasSize.value.height)
            ctx.drawImage(img, 0, 0)
          }
        }
        img.src = artwork.image_data
      }
      
      // Save to localStorage for persistence
      localStorage.setItem('portfolioCanvasId', artwork.id)
      const saveData = {
        imageData: artwork.image_data,
        drawingData,
        timestamp: Date.now()
      }
      localStorage.setItem('portfolioPaintData', JSON.stringify(saveData))
      
      console.log('🤝 Loaded existing artwork for collaboration:', artwork.id)
      showFileMenu.value = false
      
    } else {
      alert('Artwork not found. Please check the ID and try again.')
    }
  } catch (error) {
    console.log('❌ Failed to load existing artwork:', error)
    alert('Failed to load artwork. Please try again.')
  }
}

function handleResize() {
  if (!canvas.value) return
  
  const container = canvas.value.parentElement
  if (container) {
    const newWidth = container.clientWidth
    const newHeight = container.clientHeight
    
    if (newWidth !== canvasSize.value.width || newHeight !== canvasSize.value.height) {
      // Save current canvas content
      const imageData = canvas.value.toDataURL()
      
      // Resize canvas
      canvasSize.value.width = newWidth
      canvasSize.value.height = newHeight
      canvas.value.width = newWidth
      canvas.value.height = newHeight
      
      // Restore content
      if (ctx) {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, newWidth, newHeight)
        
        const img = new Image()
        img.onload = () => {
          ctx!.drawImage(img, 0, 0)
        }
        img.src = imageData
      }
    }
  }
}

onMounted(async () => {
  await nextTick()
  initCanvas()
  
  // Handle window resize
  window.addEventListener('resize', handleResize)
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.menu-item')) {
      showFileMenu.value = false
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Classic MS Paint Interface */
.paint-hero {
  position: relative;
  min-height: 100vh;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  padding-top: 120px;
  font-family: 'MS Sans Serif', Tahoma, Arial, sans-serif;
  font-size: 11px;
}

.paint-window {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  width: 100%;
  max-width: 1000px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 2px 8px rgba(0,0,0,0.3);
}

/* Title Bar */
.paint-title-bar {
  background: linear-gradient(to bottom, #0078d4, #106ebe);
  color: white;
  padding: 4px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 11px;
}

.title-text {
  display: flex;
  align-items: center;
  gap: 6px;
}

.window-controls {
  display: flex;
  gap: 2px;
}

.window-btn {
  width: 16px;
  height: 14px;
  background: #c0c0c0;
  border: 1px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
}

.window-btn:hover {
  background: #d0d0d0;
}

.window-btn:active {
  border-color: #808080 #ffffff #ffffff #808080;
}

/* Menu Bar */
.paint-menu-bar {
  background: #c0c0c0;
  display: flex;
  border-bottom: 1px solid #808080;
  padding: 4px;
}

.menu-item {
  position: relative;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 11px;
  color: #000000;
}

.menu-item:hover {
  background: #316ac5;
  color: white;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  min-width: 120px;
  z-index: 1000;
  box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.menu-option {
  padding: 4px 8px;
  cursor: pointer;
  font-size: 11px;
  color: #000000;
  white-space: nowrap;
}

.menu-option:hover {
  background: #316ac5;
  color: white;
}

.menu-separator {
  height: 1px;
  background: #808080;
  border: none;
  margin: 2px 0;
}

.save-indicator {
  float: right;
  font-size: 10px;
}

/* Main Paint Area */
.paint-main {
  display: flex;
  flex: 1;
  background: #c0c0c0;
  overflow: hidden;
}

/* Tool Palette */
.tool-palette {
  width: 54px;
  background: #c0c0c0;
  border-right: 2px solid;
  border-right-color: #808080;
  padding: 4px;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
}

.paint-tool {
  width: 22px;
  height: 22px;
  background: #c0c0c0;
  border: 1px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #000000;
}

.paint-tool:hover {
  background: #d0d0d0;
}

.paint-tool:active,
.paint-tool.active {
  background: #b0b0b0;
  border-color: #808080 #ffffff #ffffff #808080;
}

/* Canvas Area */
.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #c0c0c0;
}

.canvas-container {
  flex: 1;
  margin: 8px;
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  background: white;
  overflow: hidden;
}

.paint-canvas {
  display: block;
  cursor: crosshair;
  background: #ffffff;
  width: 100%;
  height: 100%;
}

/* Color Palette */
.color-palette {
  background: #c0c0c0;
  border-top: 1px solid #808080;
  padding: 8px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.current-colors {
  display: flex;
  align-items: center;
}

.color-display {
  position: relative;
  width: 32px;
  height: 32px;
}

.color-box {
  position: absolute;
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
}

.color-box.primary {
  width: 24px;
  height: 24px;
  top: 0;
  left: 0;
  z-index: 2;
}

.color-box.secondary {
  width: 24px;
  height: 24px;
  top: 8px;
  left: 8px;
  z-index: 1;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  gap: 1px;
  flex: 1;
}

.color-cell {
  width: 16px;
  height: 16px;
  border: 1px solid #808080;
  cursor: pointer;
}

.color-cell:hover {
  border-color: #000000;
}

.color-cell.active {
  border: 2px solid #000000;
}

/* Status Bar */
.status-bar {
  background: #c0c0c0;
  border-top: 1px solid #808080;
  padding: 4px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #000000;
}

.status-left {
  display: flex;
  gap: 12px;
}

.status-right {
  display: flex;
  gap: 12px;
}

.status-item {
  font-size: 11px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .paint-hero {
    padding: 10px;
    padding-top: 100px;
  }
  
  .paint-window {
    height: 95vh;
  }
  
  .tool-palette {
    width: 48px;
  }
  
  .paint-tool {
    width: 20px;
    height: 20px;
    font-size: 12px;
  }
  
  .color-grid {
    grid-template-columns: repeat(8, 1fr);
  }
  
  .color-palette {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .paint-hero {
    padding: 5px;
    padding-top: 90px;
  }
  
  .tool-palette {
    width: 44px;
  }
  
  .paint-tool {
    width: 18px;
    height: 18px;
    font-size: 11px;
  }
  
  .color-cell {
    width: 14px;
    height: 14px;
  }
  
  .status-bar {
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }
}
</style>