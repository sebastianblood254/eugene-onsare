module.exports = {
  apps: [
    {
      name: 'vision-trading-site',
      script: './server.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: ['server.js', 'assets/'],
      ignore_watch: ['node_modules', 'logs'],
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      listen_timeout: 3000,
      kill_timeout: 5000
    }
  ],
  deploy: {
    production: {
      user: 'node',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'https://github.com/sebastianblood254/eugene-onsare.git',
      path: '/var/www/vision-trading-site',
      'post-deploy': 'npm install && npm run start:prod'
    }
  }
};
