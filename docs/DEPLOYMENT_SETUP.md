# FastLane Documentation - Vercel Deployment Setup

This FastLane documentation site uses **Nextra** (Next.js-based docs) with **Vercel password protection** and deploys automatically via **Vercel GitOps**.

## 🔧 Setup Requirements

### 1. Vercel Password Protection (Simple Auth)

**Vercel Built-in Password Protection** ⭐ **RECOMMENDED**
1. **Deploy your project** to Vercel first
2. **In Vercel Dashboard** → Your Project → Settings → **Security**
3. **Enable "Password Protection"**
4. **Set a password** for your documentation site
5. **Done!** - Your entire site is now password protected



### 2. Configure Vercel Project

1. **Connect GitHub repo** to Vercel
2. **Set build settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `docs`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3. Simple Deployment (No Environment Variables Needed!)

**With Vercel Password Protection, you don't need any complex authentication setup!**

**All configuration happens in the Vercel Dashboard - no code changes required.**



## 🚀 Local Development

1. **Install dependencies:**
   ```bash
   cd docs
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```
   **Note**: With password protection, no authentication setup is needed locally - just develop normally!

3. **Test production build:**
   ```bash
   npm run build
   npm start
   ```

**That's it!** 🎉 No complex authentication setup needed for local development.

## 🔄 Deployment Process

**Simple Vercel GitOps Integration** (Fully Automated):

1. **Connect Repository:**
   - Import project in Vercel Dashboard
   - Connect to your GitHub repository
   - Set root directory: `docs`

2. **Automatic Deployment:**
   - Push to `develop` branch → Production deployment
   - Create Pull Request → Preview deployment
   - Vercel GitOps handles everything automatically!

3. **Enable Password Protection:**
   - Project Settings → Security → Password Protection
   - Set your password
   - Done!

## 🔐 Authentication Flow

**Simple Password Protection:**

1. User visits the documentation site
2. Vercel presents a password prompt
3. User enters the password you set
4. Full access to all documentation
5. Password is remembered for the session

**Development Mode**: No password protection locally - develop freely!

## 🛠️ Access Control

**Simple Password Protection:**
- **Anyone with the password** can access the documentation
- **Session-based** - password remembered during browsing session
- **No account creation** required - just enter the password you set

## 📱 Features

- ✅ Simple password protection via Vercel
- ✅ Responsive design with Nextra theme
- ✅ Dark mode support
- ✅ Session-based authentication
- ✅ No complex auth setup required
- ✅ Preview deployments for PRs
- ✅ Production deployments to Vercel
- ✅ Search functionality built-in
- ✅ Fast Next.js performance

## 🔧 Troubleshooting

### Common Issues:

1. **Password protection not working**
   - Ensure password protection is enabled in Vercel Dashboard
   - Check Project Settings → Security → Password Protection
   - Verify you've set a password in the Vercel interface

2. **Build/deployment fails**
   - Ensure `docs` directory is correct in build settings
   - Check Vercel deployment logs for specific errors
   - Verify Next.js build completes successfully locally

3. **Local development issues**
   - No authentication setup needed for local development
   - Check that port 3001 is available
   - Run `npm run build` to test production build locally

4. **Site not accessible after deployment**
   - Check if password protection is enabled
   - Try accessing the site in incognito mode
   - Verify deployment completed successfully in Vercel Dashboard

### Getting Help:

- Check Vercel deployment logs in dashboard
- Test production build locally with `npm run build && npm start`
- Verify project settings in Vercel Dashboard
- Check browser console for any JavaScript errors

## 🔄 Migration from VitePress

This setup replaces the previous VitePress + GitHub Pages with:
- **Next.js performance** with static generation and SSR
- **Simple password protection** via Vercel (no complex auth setup)
- **Better DX** with TypeScript and modern tooling
- **Vercel deployment** for better performance and analytics
- **Advanced features** like search, themes, and components 
