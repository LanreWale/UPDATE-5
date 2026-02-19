# 🏆 THE EMPIRE AFFILIATE MARKETING HUB - 24/7 Backend

**Ultimate Multi-Account CPA Management Platform with 24/7 Automation**

## 🚀 24/7 Operation Features

✅ **Continuous Processing**: Processes 1300+ offers per hour (24/7)  
✅ **Real-time Monitoring**: Lead checking every 30 seconds  
✅ **Automated Alerts**: Telegram & WhatsApp notifications  
✅ **Data Synchronization**: Google Sheets integration  
✅ **Health Monitoring**: System health checks & error handling  
✅ **Auto-restart**: PM2 process management for reliability  

## 🏗️ Architecture

```
Frontend (React) ←→ Backend (Node.js/Express) ←→ External APIs
                           ↓
                    [24/7 Automation Service]
                           ↓
              ┌─────────────┼─────────────┐
              ↓             ↓             ↓
        CPA Services   Alert System   Data Storage
        (5 Accounts)   (Telegram/WA)  (Google Sheets)
```

## 🛠️ Quick Start (24/7 Setup)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
# Edit .env with your API keys
```

### 3. Build & Start 24/7 Service
```bash
# Build frontend
npm run build

# Start 24/7 backend server
npm run server

# Or start both frontend & backend
npm run dev:full
```

### 4. Production Deployment (24/7)

#### Option A: PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2 for 24/7 operation
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# View logs
pm2 logs the-empire-backend
```

#### Option B: Docker (24/7 Container)
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f empire-backend

# Health check
curl http://localhost:3001/health
```

## 📊 API Endpoints

### System Control
- `GET /api/status` - System status
- `POST /api/start` - Start 24/7 automation
- `POST /api/stop` - Stop automation
- `GET /api/stats` - Performance statistics

### Data & Monitoring
- `GET /api/accounts` - CPA account status
- `POST /api/test-integrations` - Test all integrations
- `GET /health` - Health check endpoint

## 🔧 24/7 Configuration

### Automation Intervals
- **Offer Processing**: Every 2.77 seconds (1300/hour)
- **Lead Checking**: Every 30 seconds
- **Earnings Aggregation**: Every 5 minutes
- **Hourly Reports**: Every hour
- **Health Checks**: Every 6 hours
- **Daily Backup**: Every 24 hours

### Process Management
```javascript
// PM2 Configuration (ecosystem.config.js)
{
  instances: 1,
  autorestart: true,
  max_memory_restart: '1G',
  min_uptime: '10s',
  max_restarts: 10,
  cron_restart: '0 4 * * *' // Daily restart at 4 AM
}
```

## 🚨 Monitoring & Alerts

### Real-time Notifications
- **Telegram**: System status, errors, milestones
- **WhatsApp**: Critical alerts, reports
- **Console**: Detailed logging with timestamps

### Health Monitoring
- Memory usage tracking
- Error rate monitoring  
- Uptime statistics
- Performance metrics

## 🔐 Security Features

- Environment variable protection
- Non-root Docker user
- Error handling & recovery
- Graceful shutdown procedures
- Rate limiting protection

## 📈 Performance Optimization

### Resource Management
- Memory limit: 1GB
- CPU optimization for continuous processing
- Efficient data structures
- Connection pooling

### Scaling Options
- Horizontal scaling with multiple instances
- Load balancing with nginx
- Database clustering support
- CDN integration ready

## 🛡️ Error Handling

### Automatic Recovery
- Process restart on crashes
- API retry mechanisms
- Fallback procedures
- Error threshold monitoring

### Logging System
```bash
# View different log types
pm2 logs the-empire-backend --lines 100
tail -f logs/combined.log
tail -f logs/err.log
```

## 🌐 Deployment Options

### Cloud Platforms
- **AWS EC2**: Full control, scalable
- **Google Cloud**: Integrated with Sheets
- **DigitalOcean**: Cost-effective
- **Heroku**: Easy deployment
- **Railway**: Modern platform

### VPS Deployment
```bash
# Ubuntu/Debian setup
sudo apt update
sudo apt install nodejs npm nginx
npm install -g pm2
git clone <your-repo>
cd the-empire-affiliate-marketing-hub
npm install
npm run build
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

## 📊 Monitoring Dashboard

Access your 24/7 system at:
- **Frontend**: `http://localhost:3001`
- **API Status**: `http://localhost:3001/api/status`
- **Health Check**: `http://localhost:3001/health`
- **PM2 Monitor**: `pm2 monit`

## 🔄 Maintenance

### Daily Tasks (Automated)
- ✅ Data backup to GitHub
- ✅ System health report
- ✅ Performance metrics
- ✅ Error log rotation

### Weekly Tasks (Manual)
- Review error logs
- Update dependencies
- Performance optimization
- Security updates

## 🆘 Troubleshooting

### Common Issues
```bash
# Service not starting
pm2 restart the-empire-backend

# Memory issues
pm2 reload the-empire-backend

# Check logs
pm2 logs the-empire-backend --lines 50

# Reset everything
pm2 delete the-empire-backend
pm2 start ecosystem.config.js
```

### Debug Mode
```bash
# Enable debug logging
NODE_ENV=development npm run server

# Test integrations
curl -X POST http://localhost:3001/api/test-integrations
```

## 🏆 THE EMPIRE - 24/7 Success

Your affiliate marketing empire now runs **24/7 without interruption**:

- ⚡ **1300+ offers processed per hour**
- 🔄 **Continuous lead monitoring**  
- 📊 **Real-time data synchronization**
- 🚨 **Instant alert notifications**
- 💾 **Automated backups**
- 🛡️ **Self-healing system**

**THE EMPIRE NEVER SLEEPS** 👑🚀

---

*For support: Check logs, review documentation, or contact system administrator*