// PM2 ecosystem — alodev
//
// Cluster mode with 2 instances: rolling reload (no dropped requests) +
// dual-fault-tolerance. SQLite better-sqlite3 in WAL mode handles concurrent
// access between processes safely — readers parallel, writers serialized
// by SQLite's filesystem locking.
//
// Usage:
//   pm2 startOrReload ecosystem.config.cjs --update-env
//   pm2 save
//
// Code deploy (SCP + reload — no auto-watch):
//   scp new-file claude@host:.../server/routes/X.js
//   pm2 reload alodev-api --update-env
module.exports = {
  apps: [
    {
      name: 'alodev-api',
      script: './index.js',
      cwd: __dirname + '/server',
      instances: 2,
      exec_mode: 'cluster',
      max_memory_restart: '512M',
      watch: false,
      kill_timeout: 5000,
      wait_ready: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
