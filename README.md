# JobMilegi.in - Government Job Notification Website

🇮🇳 A comprehensive government job notification platform built with Next.js 14, MongoDB, and multi-language support for Hindi, English, Marathi, Bengali, Tamil, Telugu, and Gujarati.

## 🚀 Features

### 🌐 Multi-Language Support

- **7 Indian Languages**: Hindi, English, Marathi, Bengali, Tamil, Telugu, Gujarati
- **Dynamic Language Switching** with URL localization
- **SEO-optimized** language-specific URLs

### 💼 Job Management

- **Rich Job Listings** with filters and pagination
- **Category-based Organization** (Railway, SSC, Bank, Police, etc.)
- **Advanced Search** functionality
- **Job Details** with rich HTML content via Quill editor
- **View Tracking** and trending jobs

### 🎨 Modern UI/UX

- **Navy Blue + Neon Green** professional theme
- **Responsive Design** for mobile and desktop
- **Clean, Modern Interface** optimized for government job seekers
- **Fast Loading** with optimized images and lazy loading

### 📈 SEO & Performance

- **Next.js App Router** with Server Components
- **Dynamic Metadata** API for each page
- **JSON-LD Schema** for job postings
- **Automatic Sitemap** generation
- **ISR (Incremental Static Regeneration)** with 60s revalidation

### 💰 Monetization Ready

- **Google AdSense Integration**
- **Strategic Ad Placements** (sidebar, in-content, between jobs)
- **AdSense RPM Optimization** with high-quality content structure

### 🔐 Admin Panel

- **JWT Authentication** with HTTP-only cookies
- **Rich Text Editor** (React Quill) for job descriptions
- **Image Upload** via Cloudinary integration
- **Complete CRUD** operations for job management

## 🛠️ Tech Stack

| Category                 | Technology                      |
| ------------------------ | ------------------------------- |
| **Framework**            | Next.js 14 (App Router)         |
| **Database**             | MongoDB Atlas with Mongoose ODM |
| **Authentication**       | JWT with HTTP-only cookies      |
| **Internationalization** | next-intl                       |
| **Styling**              | TailwindCSS                     |
| **Editor**               | React Quill                     |
| **Image Upload**         | Cloudinary                      |
| **Deployment**           | Vercel (recommended)            |

## 📁 Project Structure

```
jobmilegi/
├── app/
│   ├── [locale]/                 # Internationalized routes
│   │   ├── page.tsx             # Homepage
│   │   ├── jobs/                # Job listing & details
│   │   ├── admin/               # Admin panel
│   │   └── layout.tsx           # Root layout
│   ├── api/                     # API routes
│   │   ├── jobs/               # Job CRUD APIs
│   │   └── admin/              # Admin authentication
│   └── globals.css             # Global styles
├── components/
│   ├── Navbar.tsx              # Navigation with language switcher
│   ├── JobCard.tsx             # Job listing card
│   ├── AdSenseUnit.tsx         # Google AdSense component
│   └── LanguageSwitcher.tsx    # Language dropdown
├── lib/
│   ├── models/                 # Mongoose schemas
│   │   ├── Job.ts
│   │   └── Admin.ts
│   ├── mongodb.ts              # Database connection
│   ├── auth.ts                 # JWT utilities
│   └── i18n.ts                 # Internationalization config
├── messages/                   # Translation files
│   ├── hi.json                # Hindi translations
│   ├── en.json                # English translations
│   └── ...                    # Other languages
└── middleware.ts               # Next.js middleware for i18n
```

## ⚙️ Environment Setup

Create `.env.local` file:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobmilegi

# JWT Secret (Change in production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google AdSense
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-your-publisher-id

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://jobmilegi.in
```

## 🚦 Getting Started

1. **Clone & Install**

   ```bash
   git clone <repository-url>
   cd jobmilegi
   npm install
   ```

2. **Setup Environment**

   - Copy `.env.local` and fill in your values
   - Setup MongoDB Atlas database
   - Configure Cloudinary account

3. **Run Development Server**

   ```bash
   npm run dev
   ```

4. **Create Admin User**
   ```bash
   # You'll need to create an admin user manually in your MongoDB
   # Or create a setup script (recommended for production)
   ```

## 🌍 Language Support

The website supports 7 Indian languages with full UI translation:

| Language | Code | Native Name |
| -------- | ---- | ----------- |
| Hindi    | `hi` | हिंदी       |
| English  | `en` | English     |
| Marathi  | `mr` | मराठी       |
| Bengali  | `bn` | বাংলা       |
| Tamil    | `ta` | தமிழ்       |
| Telugu   | `te` | తెలుగు      |
| Gujarati | `gu` | ગુજરાતી     |

## 📊 Database Schema

### Job Model

- Title, slug, subtitle, descriptions
- Category (railway, ssc, bank, police, etc.)
- Job type (latest, admit card, result, answer key)
- Publish/expiry dates, location
- Image URL, YouTube embed
- SEO metadata, view tracking

### Admin Model

- Username, email, password (bcrypted)
- Role-based access control
- Last login tracking

## 🎨 UI Theme

**Professional Navy Blue + Neon Green Palette:**

- Primary: Deep Navy (#0A1A44)
- Secondary: Blue Gray (#2E4369)
- Accent: Neon Green (#4FE06A)
- Background: Clean White (#FFFFFF)

## 📈 SEO Features

- **Dynamic Metadata** for each page
- **Open Graph** and Twitter Cards
- **JSON-LD Schema** for job postings
- **Automatic Sitemap** generation
- **Robots.txt** configuration
- **Canonical URLs** for all pages

## 💰 AdSense Integration

Strategic ad placements for maximum RPM:

- **Sidebar ads** on desktop
- **In-content ads** between job descriptions
- **Bottom page ads**
- **Between job listings**

## 🚀 Deployment

**Recommended: Vercel**

```bash
npm run build
vercel deploy
```

**Other Options:**

- Railway
- DigitalOcean App Platform
- AWS Amplify
- Traditional VPS with PM2

## 🔧 Development Guidelines

- **Use Server Components** where possible
- **Implement ISR** with 60-second revalidation
- **Follow SEO best practices**
- **Optimize for mobile** experience
- **Maintain clean, professional UI**

## 📄 License

MIT License - feel free to use for your government job portal projects.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

**Built with ❤️ for the Indian job seekers community**

_Helping millions find their dream government jobs across India_ 🇮🇳
