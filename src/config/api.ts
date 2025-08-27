// API Configuration - Defaults to local mode (no backend required)
// Set VITE_API_BASE_URL environment variable only if you have deployed backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export const API_ENDPOINTS = {
  CHAT_MESSAGE: `${API_BASE_URL}/chat/message`,
  CANVAS_SAVE: `${API_BASE_URL}/canvas/save`,
  CANVAS_GALLERY: `${API_BASE_URL}/canvas/gallery`,
  REVIEWS: `${API_BASE_URL}/reviews`,
  CONTACT_SUBMIT: `${API_BASE_URL}/contact/submit`,
  NOTES: `${API_BASE_URL}/notes`,
  NOTES_CREATE: `${API_BASE_URL}/notes`,
  NOTES_UPDATE: (id: number) => `${API_BASE_URL}/notes/${id}`,
  NOTES_DELETE: (id: number) => `${API_BASE_URL}/notes/${id}`
}

// Helper function for making API requests with error handling
export async function apiRequest(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.log(`API request failed for ${url}:`, error)
    throw error
  }
}
