FROM node:18-bullseye

# Install Chromium-Browser and dependencies
RUN apt-get update && apt-get install -y \
    chromium-browser \
    ffmpeg \
    xvfb \
    libgtk-3-0 \
    libnss3 \
    libxss1 \
    libasound2 \
    libx11-xcb1 \
    fonts-liberation \
    x11-utils \
    x11vnc \
    fluxbox \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Tell Puppeteer to use system Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_DOWNLOAD=true

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000

CMD xvfb-run --server-args="-screen 0 1280x720x24" node index.js
