Deploy build fix notes
- package.json build script is now: npx --yes vite build
- package-lock.json exists and is committed
- Verified locally with: npm ci && npm run build
- Dist output: dist/index.html + dist/assets/*.js + dist/assets/*.css
