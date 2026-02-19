// PM2 Configuration for 24/7 Operation
module.exports = {
  apps: [{
    name: 'the-empire-backend',
    script: 'server/index.cjs',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    merge_logs: true,
    
    // Restart configuration for 24/7 operation
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000,
    
    // Health monitoring
    health_check_grace_period: 3000,
    health_check_fatal_exceptions: true,
    
    // Advanced PM2 features for production
    kill_timeout: 5000,
    listen_timeout: 3000,
    
    // Cron restart for daily maintenance (optional)
    cron_restart: '0 4 * * *', // Restart at 4 AM daily
    
    // Environment variables
    env_file: '.env'
  }]
};