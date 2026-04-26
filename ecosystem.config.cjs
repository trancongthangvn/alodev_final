// PM2 ecosystem — alodev
// Frontend is a Next.js static export served directly by nginx from ./out
// (no Node process needed). Only the API needs a long-lived process.
//
// Usage:
//   pm2 startOrReload ecosystem.config.cjs
//   pm2 save
module.exports = {
  apps: [
    {
      name: 'alodev-api',
      script: './index.js',
      cwd: __dirname + '/server',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '512M',
      watch: ['index.js', 'routes'],
      ignore_watch: ['node_modules', 'uploads', 'logs', '.git'],
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
