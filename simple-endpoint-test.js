/**
 * Simple Endpoint Testing Script
 * Tests API endpoints using native Node.js
 */

const http = require('http');
const https = require('https');

// Test configuration
const CONFIG = {
  BASE_URL: process.env.VITE_API_BASE_URL || '',
  ELEVENLABS_API_KEY: 'sk_ee4a88f7169325a3f5f8e19e643eaa0f0fd70535a74671f6',
  DEV_SERVER_PORT: 5173
};

const testResults = [];

/**
 * Make HTTP request
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https:') ? https : http;
    const req = lib.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

/**
 * Test endpoint
 */
async function testEndpoint(name, url, method = 'GET', body = null, headers = {}) {
  console.log(`🔍 Testing: ${name}`);
  console.log(`   ${method} ${url}`);
  
  try {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CrusoPortfolio-Tester/1.0',
        ...headers
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await makeRequest(url, options);
    const status = response.statusCode < 400 ? 'SUCCESS' : 'FAILED';
    const statusIcon = status === 'SUCCESS' ? '✅' : '❌';
    
    console.log(`   ${statusIcon} ${status}: ${response.statusCode}`);
    
    testResults.push({
      name,
      method,
      url,
      status,
      statusCode: response.statusCode,
      response: response.data.substring(0, 100) + '...'
    });
    
    return response;
    
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    testResults.push({
      name,
      method,
      url,
      status: 'ERROR',
      error: error.message
    });
    return null;
  }
  
  console.log('');
}

/**
 * Test main API endpoints
 */
async function testMainEndpoints() {
  console.log('\n🔍 Testing Main API Endpoints');
  console.log('='.repeat(40));
  
  const baseUrl = CONFIG.BASE_URL || 'http://localhost:3000';
  
  await testEndpoint('Chat Message', `${baseUrl}/chat/message`, 'POST', {
    message: 'Hello test',
    username: 'tester'
  });
  
  await testEndpoint('Canvas Save', `${baseUrl}/canvas/save`, 'POST', {
    username: 'tester',
    title: 'Test Art',
    image_data: 'data:image/png;base64,test',
    contributors: []
  });
  
  await testEndpoint('Canvas Gallery', `${baseUrl}/canvas/gallery`, 'GET');
  
  await testEndpoint('Reviews', `${baseUrl}/reviews`, 'POST', {
    username: 'tester',
    message: 'Great work!',
    rating: 5
  });
  
  await testEndpoint('Contact Submit', `${baseUrl}/contact/submit`, 'POST', {
    contact_type: 'work',
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    message: 'Test message'
  });
  
  await testEndpoint('Notes List', `${baseUrl}/notes`, 'GET');
}

/**
 * Test ElevenLabs API
 */
async function testElevenLabsAPI() {
  console.log('\n🎤 Testing ElevenLabs API');
  console.log('='.repeat(40));
  
  await testEndpoint(
    'ElevenLabs Voices',
    'https://api.elevenlabs.io/v1/voices',
    'GET',
    null,
    { 'xi-api-key': CONFIG.ELEVENLABS_API_KEY }
  );
  
  // Test a small TTS request
  await testEndpoint(
    'ElevenLabs TTS Test',
    'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM',
    'POST',
    {
      text: 'Hello test',
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    },
    {
      'xi-api-key': CONFIG.ELEVENLABS_API_KEY,
      'Accept': 'audio/mpeg'
    }
  );
}

/**
 * Test development server
 */
async function testDevServer() {
  console.log('\n🌐 Testing Development Server');
  console.log('='.repeat(40));
  
  await testEndpoint('Dev Server Root', `http://localhost:${CONFIG.DEV_SERVER_PORT}`, 'GET');
}

/**
 * Generate summary
 */
function generateSummary() {
  console.log('\n📊 TEST SUMMARY');
  console.log('='.repeat(50));
  
  const total = testResults.length;
  const success = testResults.filter(r => r.status === 'SUCCESS').length;
  const failed = testResults.filter(r => r.status === 'FAILED').length;
  const errors = testResults.filter(r => r.status === 'ERROR').length;
  
  console.log(`Total Tests: ${total}`);
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`💥 Errors: ${errors}`);
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('1. Open your browser to http://localhost:5173');
  console.log('2. Use the built-in API tester component');
  console.log('3. Check console for detailed API responses');
  
  if (!CONFIG.BASE_URL) {
    console.log('\n💡 NOTE: No backend configured (VITE_API_BASE_URL empty)');
    console.log('   This is normal for demo mode - all features work with fallbacks!');
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🚀 COMPREHENSIVE ENDPOINT TESTING');
  console.log('='.repeat(50));
  console.log(`Backend URL: ${CONFIG.BASE_URL || 'Not configured (demo mode)'}`);
  console.log(`Dev Server: http://localhost:${CONFIG.DEV_SERVER_PORT}`);
  console.log('='.repeat(50));
  
  await testDevServer();
  await testMainEndpoints();
  await testElevenLabsAPI();
  
  generateSummary();
}

// Run tests
if (require.main === module) {
  runTests().catch(console.error);
}
