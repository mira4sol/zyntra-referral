deploy:
	git pull origin main
	pm2 restart pm2.config.js

install:
	cd backend && npm install

start:
	cd backend && npm run start

dev:
	cd backend && npm run dev

pm2-start:
	pm2 start pm2.config.js

pm2-stop:
	pm2 stop pm2.config.js

pm2-restart:
	pm2 restart pm2.config.js

pm2-logs:
	pm2 logs zynta-referral-system