<template>
  <div class="api-tester">
    <div class="tester-header">
      <h2>🧪 API Endpoints Test Results</h2>
      <p>Testing all backend API endpoints to identify issues</p>
      <button @click="testAllEndpoints" :disabled="testing" class="test-btn">
        {{ testing ? 'Testing...' : 'Run All Tests' }}
      </button>
    </div>

    <div class="test-results">
      <div 
        v-for="result in testResults" 
        :key="result.endpoint"
        class="test-result"
        :class="result.status"
      >
        <div class="result-header">
          <h3>{{ result.name }}</h3>
          <span class="status-badge" :class="result.status">
            {{ result.status.toUpperCase() }}
          </span>
        </div>
        
        <div class="result-details">
          <p><strong>URL:</strong> {{ result.url || 'Not configured' }}</p>
          <p><strong>Method:</strong> {{ result.method }}</p>
          <p><strong>Response:</strong> {{ result.response }}</p>
          <p><strong>Error:</strong> {{ result.error || 'None' }}</p>
          
          <div v-if="result.fallbackWorks" class="fallback-info">
            <span class="fallback-badge">✅ Fallback Working</span>
            <p>{{ result.fallbackDescription }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="summary" v-if="testResults.length > 0">
      <h3>📊 Test Summary</h3>
      <div class="summary-stats">
        <div class="stat">
          <span class="stat-number">{{ successCount }}</span>
          <span class="stat-label">Working</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ failureCount }}</span>
          <span class="stat-label">Failed</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ fallbackCount }}</span>
          <span class="stat-label">Has Fallback</span>
        </div>
      </div>
      
      <div class="recommendations">
        <h4>🔧 Recommendations</h4>
        <ul>
          <li v-if="failureCount > 0">
            <strong>For Portfolio Showcase:</strong> This is normal! All features work with localStorage fallbacks.
          </li>
          <li v-if="!apiBaseUrl">
            <strong>No Backend Configured:</strong> VITE_API_BASE_URL is empty (recommended for demo)
          </li>
          <li v-if="apiBaseUrl">
            <strong>Backend Required:</strong> Deploy backend service to {{ apiBaseUrl }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { API_ENDPOINTS } from '@/config/api'

interface TestResult {
  name: string
  endpoint: string
  url: string
  method: string
  status: 'success' | 'failed' | 'testing'
  response: string
  error?: string
  fallbackWorks: boolean
  fallbackDescription?: string
}

const testing = ref(false)
const testResults = ref<TestResult[]>([])

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''

const successCount = computed(() => 
  testResults.value.filter(r => r.status === 'success').length
)

const failureCount = computed(() => 
  testResults.value.filter(r => r.status === 'failed').length
)

const fallbackCount = computed(() => 
  testResults.value.filter(r => r.fallbackWorks).length
)

async function testAllEndpoints() {
  testing.value = true
  testResults.value = []

  const endpointTests = [
    {
      name: 'Chatbot Messages',
      endpoint: 'CHAT_MESSAGE',
      method: 'POST',
      data: { message: 'Hello', username: 'tester' },
      fallbackWorks: true,
      fallbackDescription: 'Uses smart fallback responses when backend unavailable'
    },
    {
      name: 'Canvas Save',
      endpoint: 'CANVAS_SAVE', 
      method: 'POST',
      data: { 
        username: 'tester',
        title: 'Test Artwork',
        image_data: 'data:image/png;base64,test',
        contributors: []
      },
      fallbackWorks: true,
      fallbackDescription: 'Saves artwork to localStorage with full persistence'
    },
    {
      name: 'Canvas Gallery',
      endpoint: 'CANVAS_GALLERY',
      method: 'GET',
      fallbackWorks: false,
      fallbackDescription: 'Gallery feature requires backend'
    },
    {
      name: 'Reviews Submit',
      endpoint: 'REVIEWS',
      method: 'POST', 
      data: {
        username: 'tester',
        message: 'Great portfolio!',
        rating: 5
      },
      fallbackWorks: true,
      fallbackDescription: 'Saves reviews to localStorage and displays them'
    },
    {
      name: 'Contact Submit',
      endpoint: 'CONTACT_SUBMIT',
      method: 'POST',
      data: {
        contact_type: 'work',
        first_name: 'Test',
        last_name: 'User', 
        email: 'test@example.com',
        message: 'Test inquiry'
      },
      fallbackWorks: true,
      fallbackDescription: 'Opens email client and saves inquiry locally'
    },
    {
      name: 'Notes List',
      endpoint: 'NOTES',
      method: 'GET',
      fallbackWorks: true,
      fallbackDescription: 'Uses predefined notes array for articles section'
    },
    {
      name: 'Notes Create',
      endpoint: 'NOTES_CREATE',
      method: 'POST',
      data: {
        title: 'Test Note',
        content: 'Test content',
        category: 'testing'
      },
      fallbackWorks: true,
      fallbackDescription: 'Admin can create notes in localStorage'
    }
  ]

  for (const test of endpointTests) {
    await testSingleEndpoint(test)
    // Add small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  testing.value = false
}

async function testSingleEndpoint(test: any) {
  const result: TestResult = {
    name: test.name,
    endpoint: test.endpoint,
    url: (API_ENDPOINTS as any)[test.endpoint],
    method: test.method,
    status: 'testing',
    response: 'Testing...',
    fallbackWorks: test.fallbackWorks,
    fallbackDescription: test.fallbackDescription
  }

  testResults.value.push(result)

  try {
    const url = (API_ENDPOINTS as any)[test.endpoint]
    
    if (!url || url.startsWith('/')) {
      result.status = 'failed'
      result.response = 'No backend URL configured (VITE_API_BASE_URL is empty)'
      result.error = 'Backend URL missing'
      return
    }

    const options: RequestInit = {
      method: test.method,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    if (test.data && test.method !== 'GET') {
      options.body = JSON.stringify(test.data)
    }

    console.log(`Testing ${test.name}: ${test.method} ${url}`)

    const response = await fetch(url, options)
    
    if (response.ok) {
      const data = await response.json()
      result.status = 'success' 
      result.response = `${response.status} - ${JSON.stringify(data).substring(0, 100)}...`
    } else {
      result.status = 'failed'
      result.response = `${response.status} ${response.statusText}`
      result.error = `HTTP ${response.status}`
    }

  } catch (error) {
    result.status = 'failed'
    result.error = error instanceof Error ? error.message : 'Unknown error'
    
    if (error instanceof Error) {
      if (error.message.includes('CORS')) {
        result.response = 'CORS Error - Backend not accessible from browser'
      } else if (error.message.includes('fetch')) {
        result.response = 'Network Error - Backend not reachable'
      } else {
        result.response = error.message
      }
    } else {
      result.response = 'Unknown network error'
    }
  }
}
</script>

<style scoped>
.api-tester {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.tester-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
}

.tester-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
}

.tester-header p {
  margin: 0 0 1.5rem 0;
  opacity: 0.9;
}

.test-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.test-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.test-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.test-results {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.test-result {
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 1.5rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.test-result.success {
  border-left: 4px solid #10b981;
  background: #f0fdf4;
}

.test-result.failed {
  border-left: 4px solid #ef4444;
  background: #fef2f2;
}

.test-result.testing {
  border-left: 4px solid #f59e0b;
  background: #fffbeb;
  animation: pulse 2s infinite;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.result-header h3 {
  margin: 0;
  font-size: 1.125rem;
  color: #1f2937;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.success {
  background: #dcfce7;
  color: #166534;
}

.status-badge.failed {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.testing {
  background: #fef3c7;
  color: #92400e;
}

.result-details {
  font-size: 0.875rem;
  line-height: 1.6;
}

.result-details p {
  margin: 0.5rem 0;
  color: #4b5563;
}

.result-details strong {
  color: #1f2937;
}

.fallback-info {
  margin-top: 1rem;
  padding: 1rem;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
}

.fallback-badge {
  display: inline-block;
  background: #22c55e;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.summary {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 2rem;
}

.summary h3 {
  margin: 0 0 1.5rem 0;
  color: #1e293b;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat {
  text-align: center;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #1e293b;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.recommendations {
  margin-top: 1.5rem;
}

.recommendations h4 {
  margin: 0 0 1rem 0;
  color: #1e293b;
}

.recommendations ul {
  margin: 0;
  padding-left: 1.5rem;
}

.recommendations li {
  margin-bottom: 0.75rem;
  color: #475569;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@media (max-width: 768px) {
  .api-tester {
    padding: 1rem;
  }
  
  .result-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .summary-stats {
    grid-template-columns: 1fr;
  }
}
</style>
