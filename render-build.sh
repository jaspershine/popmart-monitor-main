#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Chromium
apt-get update
apt-get install -y chromium

# Install project dependencies
npm install