module.exports = {
  apps: [
    {
      name: 'zynta-referral-system',
      script: 'cd backend && npm run start',
      autorestart: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
