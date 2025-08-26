# 🔧 Portfolio Troubleshooting Guide

## 🚨 Common Issues & Solutions

### **1. CORS Error when Drawing/Typing**
**Symptoms:** You see `21m00Tcm4TlvDq8ikWAM CORS error` in browser console

**Cause:** The AI voice system is trying to call external APIs (ElevenLabs) directly from the browser, which causes CORS (Cross-Origin Resource Sharing) errors.

**✅ Solution:** 
- The portfolio now defaults to **browser voice** instead of AI voice
- If you see this error, click the **🔄 Basic** button to switch to browser voice
- The voice toggle is in the audio player controls

### **2. Voice Not Audible**
**Symptoms:** Audio player shows but no sound plays

**✅ Solutions:**
1. **Check browser permissions:** Make sure audio is not blocked
2. **Use browser voice:** Click **🔄 Basic** button instead of **🧠 AI Voice**
3. **Check volume:** Ensure system and browser volume are up
4. **Try different browser:** Chrome/Edge work best for speech synthesis

### **3. Admin Panel Access**
**Question:** How do I access admin features?

**✅ Answer:**
- **Password:** `admin123`
- **Access:** Click the admin button in the Skills section
- **Features:** Add/edit notes, manage content

### **4. Backend API 404 Errors** 
**Symptoms:** Console shows errors like `404 Not Found` for `/api/chat/message`, `/api/canvas/save`, etc.

**✅ Solutions:**
1. **For Portfolio Showcase (Recommended):** 
   - This is normal! The portfolio works perfectly without a backend
   - All features use localStorage fallbacks automatically
   - Star ratings, canvas saves, and chatbot all work offline

2. **For Production Use:**
   - Deploy the backend service first (see README.md)
   - Set `VITE_API_BASE_URL` environment variable to your backend URL
   - Copy `env.example` to `.env.local` and configure

### **5. Paint Canvas Issues**
**Symptoms:** Canvas not saving or CORS errors

**✅ Solution:** 
- Canvas now saves to localStorage automatically when backend is unavailable
- You'll see "Canvas saved locally!" message - this is working correctly
- Your artwork persists in browser storage

---

## 🎵 **Audio System Explanation**

### **Browser Voice (Recommended)**
- ✅ **Always works** - No network required
- ✅ **No CORS issues** - Built into browser
- ✅ **Multiple voices** - Different accents/languages
- ⚠️ **Quality varies** by browser/system

### **AI Voice (Advanced)**
- 🎤 **High quality** - Professional-grade synthesis
- 🌐 **Requires API** - External service calls
- ⚠️ **CORS issues** - Browser security restrictions
- 💰 **Paid service** - Requires ElevenLabs API key

---

## 🛠️ **Developer Notes**

### **For Production Use:**
1. **Set up backend proxy** for ElevenLabs API to avoid CORS
2. **Configure API keys** in environment variables
3. **Implement proper authentication** for admin features
4. **Consider voice caching** for better performance

### **Current Configuration:**
- Default: Browser voice (no CORS issues)
- Fallback: Auto-switches on errors
- Admin password: `admin123` (change in production)

---

## 📞 **Still Having Issues?**

1. **Check browser console** for specific error messages
2. **Try different browser** (Chrome recommended)
3. **Disable browser extensions** that might block audio
4. **Clear browser cache** and reload page
5. **Check network connection** for any API features

---

🎉 **Enjoy your responsive portfolio with working audio!** 🎉
