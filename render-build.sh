#!/usr/bin/env bash
# exit on error
set -o errexit

CHROME_DIR=/opt/render/project/.render/chrome

if [[ ! -d $CHROME_DIR ]]; then
  echo "...Downloading Chrome"
  mkdir -p $CHROME_DIR
  cd $CHROME_DIR
  wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
  dpkg -x ./google-chrome-stable_current_amd64.deb $CHROME_DIR
  rm ./google-chrome-stable_current_amd64.deb
else
  echo "...Using Chrome from cache"
fi

# Set Chrome path for Puppeteer
echo "export PUPPETEER_EXECUTABLE_PATH=$CHROME_DIR/opt/google/chrome/chrome" >> $HOME/.bashrc
source $HOME/.bashrc

# Install project dependencies
npm ci

# Print Chrome version for debugging
$CHROME_DIR/opt/google/chrome/chrome --version