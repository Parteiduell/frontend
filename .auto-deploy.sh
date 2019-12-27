#bin/bash!
git add .;
git reset --hard;
if git pull origin $1| grep 'Already up to date.' > /dev/null; then
    exit;
fi
yarn install;
yarn run build;
if [ "$1" == "master" ]; then  
    pm2 restart parteiduell.de;
fi
if [ "$1" == "staging" ]; then  
    pm2 restart staging.parteiduell.de;
fi