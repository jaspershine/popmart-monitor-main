#!/usr/bin/env bash
# exit on error
set -o errexit

# Install project dependencies
npm ci

# Ensure Puppeteer installs Chrome
npm run postinstall