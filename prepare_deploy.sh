#!/bin/bash

echo "Preparing deploy branch..."

# Ensure we are in the main branch
current_branch=$(git symbolic-ref --short HEAD)
if [ "$current_branch" != "main" ]; then
  echo "You are not in the main branch. Please switch to the main branch."
  exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
  echo "Warning: You have uncommitted changes. These will not be part of the deployment."
fi

# Push local main branch to remote deploy branch with force
git push origin main:deploy --force

echo "Deploy branch is ready with the latest changes."