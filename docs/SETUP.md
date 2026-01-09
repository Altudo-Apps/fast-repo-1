# FastLane Documentation - Quick Setup

This is a Next.js-based documentation site using Nextra with simple Vercel password protection.

## 🚀 Quick Start (Super Simple!)

### 1. Install & Run

```bash
cd docs
npm install
npm run dev
```

**That's it!** 🎉 Your site is available at `http://localhost:3001`

No authentication setup needed for local development - just start building!

### 2. Production Deployment

**For production, you'll use Vercel's simple password protection.**

See `DEPLOYMENT_SETUP.md` for complete deployment instructions!



## 🔧 Production Deployment

### Simple Vercel Deployment:

**No environment variables or secrets needed!** 🎉

1. **Import project** in Vercel Dashboard
2. **Connect your GitHub repo**
3. **Set root directory** to `docs`
4. **Deploy** → Automatic!
5. **Enable password protection** in Project Settings → Security

**That's it!** No complex authentication setup required.

## 📁 Project Structure

```
docs/
├── pages/                 # Nextra pages (markdown files)
│   ├── _app.tsx          # App wrapper
│   ├── _meta.ts          # Navigation structure
│   ├── index.md          # Home page
│   ├── components/       # Component documentation
│   ├── templates/        # Template documentation
│   └── getting-started/  # Getting started guides
├── styles/               # Global styles
├── theme.config.tsx      # Nextra theme config
├── middleware.ts         # Simple middleware
└── next.config.mjs       # Next.js config
```

## ✨ Key Features

- **Next.js 15** with Pages Router
- **Nextra** for markdown-based docs
- **Simple Password Protection** via Vercel (no complex auth setup)
- **TypeScript** support
- **Automatic deployment** via Vercel
- **Responsive design** with dark mode
- **Markdown and MDX** support
- **Zero-config development** mode

## 🔐 Authentication Flow

**Development Mode:**
1. User visits site
2. No password protection locally
3. All content is accessible immediately
4. Navigation shows "🔒 Protected by Vercel" indicator
5. Develop freely without authentication barriers

**Production Mode (Vercel):**
1. User visits site
2. Vercel presents password prompt
3. User enters the password you set in Vercel dashboard
4. Password is remembered for the session
5. Full access to all documentation

### Development vs Production

**Local Development:**
- ✅ **No password needed** - develop freely
- ✅ **Full content access** immediately
- ✅ **Fast iteration** without auth barriers

**Production (Vercel):**
- 🔒 **Password protection** via Vercel dashboard
- 🔒 **Session-based** authentication
- 🔒 **Simple setup** - no code changes needed

## 🔧 Customization

### Adding New Pages:

1. Create `.md` file in `pages/` directory
2. Update corresponding `_meta.ts` for navigation
3. Use standard markdown syntax

### Styling:

- Edit `styles/globals.css` for global styles
- Modify `theme.config.tsx` for theme customization
- Use Nextra's built-in CSS variables

### Authentication:

- **Password protection** handled entirely by Vercel dashboard
- **No code changes** needed for authentication
- **Simple setup** in Vercel project settings

## 🆚 Benefits vs VitePress

**Advantages:**
- ✅ Next.js ecosystem and SSR
- ✅ Simple Vercel password protection
- ✅ React component library compatibility
- ✅ Standard Markdown support
- ✅ TypeScript support
- ✅ API routes for backend functionality
- ✅ Same markdown files as VitePress

**Considerations:**
- ✅ **Simpler setup** than complex auth systems
- ⚠️ Requires Node.js server (vs static)
- ✅ Uses your existing markdown files 