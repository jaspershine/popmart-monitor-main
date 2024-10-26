#!/usr/bin/env bash
# exit on error
set -o errexit

# Install project dependencies
npm install
npm run postinstall