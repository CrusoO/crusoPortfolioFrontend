# 🚀 Robinson's Portfolio Backend

**FastAPI backend with PostgreSQL for Robinson's interactive portfolio website.**

## 📊 **Data Storage & Database**

### 🗄️ **Current Database Structure**

Your backend uses **PostgreSQL on Render** (production) with automatic table creation:

#### **Database Tables:**

1. **`notes`** - Personal articles and writings
   ```sql
   id (Primary Key), title, content, category, tags (JSON), 
   read_time, is_published, created_at, updated_at
   ```

2. **`reviews`** - User feedback and ratings
   ```sql
   id, username, message, rating (1-5), is_approved, 
   ip_address, created_at, updated_at
   ```

3. **`contacts`** - Work inquiries and contact forms
   ```sql
   id, contact_type ('work'|'review'), first_name, last_name, 
   email, timeline, message, status, ip_address, created_at, updated_at
   ```

4. **`canvas_art`** - Paint canvas artwork
   ```sql
   id, username, title, image_data (Base64), thumbnail, 
   contributors (JSON), is_public, created_at, updated_at
   ```

5. **`chat_sessions`** - AI chatbot conversations
   ```sql
   id, session_id, username, messages (JSON), is_active, 
   created_at, updated_at
   ```

6. **`analytics`** - Usage tracking and statistics
   ```sql
   id, event_type, username, data (JSON), ip_address, 
   user_agent, created_at, updated_at
   ```

---

## 🚀 **Deploy to Render (Recommended)**

### **Step 1: Push to GitHub**

```bash
# Initialize git repository
git init
git add .
git commit -m "Robinson's Portfolio Backend - Ready for Render"

# Push to your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/cruso-portfolio-backend.git
git push -u origin main
```

### **Step 2: Create Render Services**

#### **2a. PostgreSQL Database**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. **New +** → **PostgreSQL**
3. Settings:
   - **Name**: `portfolio-db`
   - **Database**: `portfolio_production`
   - **User**: `portfolio_user`
   - **Plan**: Free or Starter ($7/month)

#### **2b. Web Service**
1. **New +** → **Web Service**
2. Connect GitHub repo
3. Settings:
   - **Name**: `cruso-portfolio-backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`

### **Step 3: Environment Variables**

Add in Render Web Service → Environment:

```env
DATABASE_URL=postgresql://user:pass@host:port/portfolio_production
SECRET_KEY=generate-a-long-random-secure-key-here
OPENAI_API_KEY=your-openai-api-key-optional
OWNER_EMAIL=thaparobinson1@gmail.com
OWNER_NAME=Robinson
OWNER_LOCATION=Bangalore, India
PORT=10000
```

### **Step 4: Deploy & Verify**

Your API will be live at: `https://cruso-portfolio-backend.onrender.com`

**Test endpoints:**
- `GET /` - API info
- `GET /docs` - Interactive docs
- `POST /api/chat/message` - Chatbot
- `GET /api/notes` - Personal notes
- `POST /api/reviews` - Submit review

---

## 🔗 **Frontend Integration**

Update your Vue.js frontend API URLs:

```javascript
// Replace localhost with your Render URL
const API_BASE_URL = 'https://cruso-portfolio-backend.onrender.com/api'

// Examples:
// ChatBot: POST ${API_BASE_URL}/chat/message
// Notes: GET ${API_BASE_URL}/notes
// Reviews: POST ${API_BASE_URL}/reviews
// Canvas: POST ${API_BASE_URL}/canvas/save
// Contact: POST ${API_BASE_URL}/contact/submit
```

---

## 💾 **Data Flow**

### **How Your Data is Stored:**

1. **User chats with Cruso** → Saved to `chat_sessions` table
2. **User submits review** → Saved to `reviews` table  
3. **User sends work inquiry** → Saved to `contacts` table
4. **User paints artwork** → Saved to `canvas_art` table
5. **User views notes** → Loaded from `notes` table
6. **All interactions** → Tracked in `analytics` table

### **Data Persistence:**

- ✅ **PostgreSQL database** - Enterprise-grade reliability
- ✅ **Automatic daily backups** - Never lose data
- ✅ **ACID compliance** - Data consistency guaranteed
- ✅ **Concurrent access** - Multiple users simultaneously
- ✅ **JSON support** - Complex data structures stored efficiently

---

## 🛠️ **Local Development**

### **Requirements:**
```bash
pip install -r requirements.txt
```

### **Environment Setup:**
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your settings
DATABASE_URL=sqlite:///./portfolio.db  # Local SQLite
SECRET_KEY=your-local-development-key
OPENAI_API_KEY=your-openai-key-optional
```

### **Run Locally:**
```bash
python main.py
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
```

---

## 📊 **Database Management**

### **View Your Data:**

1. **Render Dashboard** → PostgreSQL service → Connect
2. **pgAdmin** or any PostgreSQL client
3. **API endpoints** for programmatic access:

```python
# Example: Get all reviews
GET /api/reviews

# Example: Get contact inquiries  
GET /api/contact/inquiries

# Example: Get canvas artwork
GET /api/canvas/gallery
```

### **Export Data:**

```python
import psycopg2
import pandas as pd

# Connect to production database
conn = psycopg2.connect("postgresql://...")

# Export reviews
reviews_df = pd.read_sql("SELECT * FROM reviews", conn)
reviews_df.to_csv("reviews_export.csv")

# Export contacts
contacts_df = pd.read_sql("SELECT * FROM contacts", conn) 
contacts_df.to_csv("contacts_export.csv")

print(f"Exported {len(reviews_df)} reviews and {len(contacts_df)} contacts")
```

---

## 🔒 **Security Features**

- ✅ **CORS protection** - Only your frontend can access
- ✅ **Input validation** - Pydantic schemas prevent bad data
- ✅ **SQL injection protection** - SQLAlchemy ORM safe queries
- ✅ **Environment secrets** - API keys stored securely
- ✅ **Rate limiting** - Built into FastAPI
- ✅ **HTTPS/SSL** - Automatic on Render

---

## 💰 **Cost & Scaling**

### **Render Pricing:**
- **PostgreSQL**: Free (512MB) or $7/month (1GB+)
- **Web Service**: Free (750 hrs/month) or $7/month (unlimited)

### **Production Ready:**
- **Auto-scaling** - Handles traffic spikes
- **Zero-downtime deploys** - Seamless updates  
- **Global CDN** - Fast worldwide access
- **24/7 monitoring** - Auto-restart if needed

---

## 🎯 **What You Get**

### **Data Insights:**
- Real-time chat conversations with users
- User feedback and ratings 
- Work inquiry leads with contact details
- Creative artwork from paint canvas
- Portfolio engagement analytics

### **Business Value:**
- **Lead Generation** - Work inquiries saved automatically
- **User Feedback** - Reviews and ratings collected
- **Portfolio Analytics** - See what users engage with most
- **Content Management** - Update notes/articles via API
- **Creative Showcase** - Users' paint creations stored

---

## 🚀 **Ready to Deploy!**

Your backend is production-ready with:
- ✅ Professional PostgreSQL database
- ✅ Scalable FastAPI architecture  
- ✅ AI-powered chatbot integration
- ✅ Comprehensive data storage
- ✅ Security best practices
- ✅ Easy deployment to Render

**Next Steps:**
1. Push code to GitHub
2. Create Render services (PostgreSQL + Web Service)
3. Set environment variables
4. Update frontend API URLs
5. Deploy and go live! 🌟

---

**Made with ❤️ for Robinson's Portfolio - Bangalore, India** 🇮🇳