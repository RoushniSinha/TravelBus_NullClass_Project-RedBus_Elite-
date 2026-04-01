@echo off
cd /d "travelbus(RedBusElite)"
if exist node_modules rd /s /q node_modules
npm install --legacy-peer-deps
npm run dev
pause

