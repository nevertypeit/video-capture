const express = require('express');
const puppeteer = require('puppeteer-core');
const { exec } = require('child_process');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

app.get('/record', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('Missing URL');

  const id = uuidv4();
  const videoPath = `/tmp/${id}.mp4`;

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--kiosk',
        '--start-fullscreen',
        '--window-size=1280,720',
        `--app=${targetUrl}`
      ]
    });

    // Optional: wait a few seconds to ensure page loads before recording
    await new Promise(resolve => setTimeout(resolve, 3000));

    const ffmpeg = exec(`ffmpeg -y -video_size 1280x720 -f x11grab -i :99 -t 60 ${videoPath}`);

    ffmpeg.on('exit', async () => {
      await browser.close();
      res.download(videoPath, `${id}.mp4`, () => {
        fs.unlinkSync(videoPath);
      });
    });

  } catch (err) {
    if (browser) await browser.close();
    console.error('Recording failed:', err);
    res.status(500).send('Failed to record the page.');
  }
});

app.listen(port, () => console.log(`Recorder running on ${port}`));
