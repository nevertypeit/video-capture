FROM node:18-bullseye

RUN apt update && apt install -y \
    ffmpeg \
    xvfb \
    x11vnc \
    fluxbox \
    x11-utils \
    wget \
    unzip \
    fonts-liberation \
    libnss3 \
    libxss1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD xvfb-run --server-args="-screen 0 1280x720x24" node index.js
