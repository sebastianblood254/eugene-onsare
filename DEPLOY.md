# Deployment guide for VISION.COM

## Local development with Git

1. **Install Git** from https://git-scm.com/download/win if not already installed.

2. **Navigate to the project**:
   ```powershell
   cd c:\Users\Admin\Documents\GitHub\eugene-onsare
   ```

3. **Configure git user (first time only)**:
   ```powershell
   git config --global user.email "your-email@example.com"
   git config --global user.name "Your Name"
   ```

4. **Stage and commit changes**:
   ```powershell
   git add -A
   git commit -m "Add login, signup, broker integration and deployment setup"
   ```

5. **Push to GitHub**:
   ```powershell
   git branch -M main
   git push -u origin main
   ```

## What's in this commit

- `login.html` — Login page with form validation
- `signup.html` — Signup page
- `broker.html` — Sample broker API integration page
- `server.js` — Node/Express backend with:
  - Signup endpoint
  - Login endpoint
  - Broker account data endpoint
  - Broker quote endpoint
- `package.json` — Node project dependencies
- `README.md` — Local dev and deployment instructions
- `assets/script.js` — Updated with form handlers
- `.gitignore` — Exclude node_modules and OS files

## Deploy to production

### Option A: GitHub Pages (static only)

1. Push to GitHub
2. In repository settings, enable GitHub Pages
3. Set source to main branch
4. Your site will be available at `https://username.github.io/eugene-onsare`

### Option B: Vercel (with Node backend)

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Follow prompts to connect your GitHub repo
4. Vercel will automatically detect `server.js` and deploy

### Option C: Render (with Node backend)

1. Push to GitHub
2. Go to render.com and create new Web Service
3. Connect your GitHub repo
4. Set Build Command: `npm install`
5. Set Start Command: `npm start`

### Option D: Deploy to custom domain `vision.com`

1. Register domain on Namecheap, GoDaddy, etc.
2. Deploy app to Vercel/Render
3. Add CNAME record pointing to your host provider
4. Update domain in hosting dashboard

## Install dependencies locally

```powershell
npm install
npm start
# Open http://localhost:3000
```
