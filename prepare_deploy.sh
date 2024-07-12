#!/bin/bash

echo "Preparing deploy branch..."

# Ensure we are in the main branch
git checkout main

# Create or switch to the deploy branch
git checkout -B deploy

# Merge changes from main into deploy without affecting the remote main branch
git merge main

# Push the deploy branch to the remote repository
git push origin deploy --force

# Switch back to the main branch
git checkout main

echo "Deploy branch is ready with the latest changes, and you are now back on the main branch."