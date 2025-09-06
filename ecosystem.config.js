module.exports = {
  apps: [{
    name: 'hexsyn-server',
    script: 'src/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: process.env.PORT || 5000
    },
    // Logging
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Process management
    max_memory_restart: '1G',
    min_uptime: '10s',
    max_restarts: 10,
    autorestart: true,
    
    // Graceful shutdown
    kill_timeout: 5000,
    listen_timeout: 3000,
    
    // Health monitoring
    health_check_grace_period: 3000,
    
    // Environment variables
    env_file: '.env'
  }]
};
