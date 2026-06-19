# 24/7 Server Setup Guide

This guide helps you run the VISION.COM trading site 24/7 using PM2 (Process Manager 2).

## Prerequisites

- Node.js >= 18
- npm

## Local 24/7 Setup (Windows/Mac/Linux)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Server in Background (Development)
```bash
npm run start:dev
```

### 3. Monitor Server Status
```bash
npm run status
```

### 4. View Live Logs
```bash
npm run logs
```

### 5. Manage Server
```bash
# Stop the server
npm run stop

# Restart the server
npm run restart

# Remove from PM2
npm run delete
```

## Production 24/7 Deployment

### Option 1: Deploy to Heroku (Free Tier Available)

1. **Create Heroku Account**: https://www.heroku.com/

2. **Install Heroku CLI**: 
```bash
npm install -g heroku
heroku login
```

3. **Create Heroku App**:
```bash
heroku create your-vision-trading-site
```

4. **Deploy**:
```bash
git push heroku main
```

5. **View Logs**:
```bash
heroku logs --tail
```

### Option 2: Deploy to DigitalOcean / AWS / VPS

1. **SSH into your server**
```bash
ssh root@your-server-ip
```

2. **Install Node.js and PM2**:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

3. **Clone Repository**:
```bash
cd /var/www
git clone https://github.com/sebastianblood254/eugene-onsare.git
cd eugene-onsare
npm install
```

4. **Start with PM2**:
```bash
pm2 start ecosystem.config.js --env production
pm2 startup
pm2 save
```

5. **Setup Nginx Reverse Proxy** (optional, for port 80):
```bash
sudo apt-get install nginx
# Edit /etc/nginx/sites-available/default to proxy to localhost:3000
sudo systemctl start nginx
```

### Option 3: Docker Container (Any Cloud Provider)

1. **Create Dockerfile**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

2. **Build and Run**:
```bash
docker build -t vision-trading-site .
docker run -d -p 3000:3000 --restart always vision-trading-site
```

## Health Monitoring

The server includes a health check endpoint:
```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "healthy",
  "uptime": 3600.5,
  "timestamp": "2026-06-19T10:30:00Z"
}
```

## Features for 24/7 Stability

✅ **Auto-restart on crash** - Server restarts within 10 seconds
✅ **Cluster mode** - Utilizes multiple CPU cores for better performance
✅ **Memory management** - Auto-restart if exceeds 500MB
✅ **Graceful shutdown** - Properly handles system signals
✅ **Error handling** - Catches uncaught exceptions and unhandled rejections
✅ **Logging** - All errors and events logged to files
✅ **Health check** - Monitor server status with `/api/health` endpoint

## Useful PM2 Commands

```bash
pm2 list                    # Show all running apps
pm2 logs vision-trading-site # View logs in real-time
pm2 reload vision-trading-site # Zero-downtime restart
pm2 stop vision-trading-site # Stop app
pm2 restart vision-trading-site # Restart app
pm2 delete vision-trading-site # Remove from PM2
pm2 info vision-trading-site # Show app details
pm2 monit                   # Monitor CPU/Memory usage
```

## Troubleshooting

**Port Already in Use**:
```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

**Server Won't Start**:
```bash
# Check logs
npm run logs
# Ensure Node.js and npm are installed
node --version
npm --version
```

**Memory Leak**:
```bash
# PM2 will auto-restart if exceeding 500MB
# Check resource usage
pm2 monit
```

## Deploy Checklist

- [ ] Installed Node.js >= 18
- [ ] Installed PM2 globally
- [ ] Dependencies installed (`npm install`)
- [ ] Server starts without errors (`npm run start:dev`)
- [ ] Health check working (`curl localhost:3000/api/health`)
- [ ] Logs are being created
- [ ] PM2 auto-startup configured (`pm2 startup && pm2 save`)

Your site is now configured to run 24/7! 🚀
