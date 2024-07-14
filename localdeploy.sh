#!/bin/bash

# Variables
REMOTE_DIR="/var/www/bookmarks-server"
PM2_APP_NAME="bookmarks-server"
DEPLOY_BRANCH="deploy"

echo "Starting deployment locally on droplet..."

# Ensure we are in the correct directory
cd $REMOTE_DIR || { echo "Failed to change directory to $REMOTE_DIR"; exit 1; }

# Switch to the deploy branch
echo "Switching to the deploy branch..."
git switch $DEPLOY_BRANCH || { echo "Failed to switch to the deploy branch"; exit 1; }

# Fetch the latest changes and reset to the latest deploy branch
echo "Fetching latest changes from deploy branch..."
git fetch origin || { echo "Failed to fetch latest changes"; exit 1; }

echo "Resetting local deploy branch to match remote deploy branch..."
git reset --hard origin/$DEPLOY_BRANCH || { echo "Failed to reset to the latest deploy branch"; exit 1; }

# Install dependencies
echo "Installing dependencies..."
yarn install || { echo "Failed to install dependencies"; exit 1; }

# Restart the application with PM2
echo "Restarting application with PM2..."
pm2 restart $PM2_APP_NAME || pm2 start dist/main.js --name $PM2_APP_NAME || { echo "Failed to restart/start the application with PM2"; exit 1; }

echo "Deployment completed."
