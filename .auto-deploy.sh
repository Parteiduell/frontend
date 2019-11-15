#bin/bash!
git add .;
git reset --hard;
if git pull | grep 'Already up to date.' > /dev/null; then
    exit;
fi
npm i;
npm run build;
pm2 restart parteiduell.de;
