#!/bin/bash

# Variables
REMOTE_USER="root"
REMOTE_HOST="kidscoding.zone"
REMOTE_DIR="/var/www/bookmarks-server"
PM2_APP_NAME="bookmarks-server"

echo "Starting deployment..."

# Step 1: SSH into the remote server and pull the latest changes from the deploy branch
ssh $REMOTE_USER@$REMOTE_HOST << EOF
  set -e
  echo "Entering remote directory..."
  cd $REMOTE_DIR
  echo "Marking directory as safe..."
  git config --global --add safe.directory $REMOTE_DIR
  echo "Fetching latest changes from deploy branch..."
  git fetch origin
  git reset --hard origin/deploy
  echo "Installing dependencies..."
# yarn install
  /root/.nvm/versions/node/v22.4.0/bin/yarn install
  echo "Restarting application with PM2..."
  pm2 restart $PM2_APP_NAME || pm2 start dist/main.js --name $PM2_APP_NAME
EOF

echo "Deployment completed."