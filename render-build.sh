#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Chromium
apt-get update
apt-get install -y chromium chromium-browser libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libasound2 libpangocairo-1.0-0 libatk1.0-0 libatk-bridge2.0-0 libgtk-3-0

# Install project dependencies
npm install