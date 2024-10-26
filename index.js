import express from 'express';
import puppeteer from 'puppeteer-core';


const url = process.env.PRODUCT_URL || 'https://www.popmart.com/us/products/675/the-monsters-exciting-macaron-vinyl-face-blind-box';

const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL; //webhook go here


const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Stock checker is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  // Start the initial check
  checkStock(url);
});


async function checkStock(productUrl) {
  let browser;
  try {
    console.log(`Checking stock for: ${productUrl}`);
    // Launch a new browser instance
    console.log('Chrome path:', process.env.PUPPETEER_EXECUTABLE_PATH);
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      headless: 'new',
    });
    const page = await browser.newPage();
    
    // Navigate to the product page
    await page.goto(productUrl, {
      waitUntil: 'networkidle2',
      timeout: 0
    });

  
    // Wait for the page content to load
    await page.waitForSelector('body');

    // Check if the button says "Add to Bag" or "Notify Me When Available"
    const buttonText = await page.evaluate(() => {
        const buttonDiv = document.querySelector('.index_usBtn__2KlEx.index_red__kx6Ql.index_btnFull__F7k90');
        return buttonDiv ? buttonDiv.innerText : 'Button not found';
    });

    // Determine if the product is in stock based on button text
    const isInStock = buttonText.includes('ADD TO BAG');

    if (isInStock) {
        console.log('The product is in stock!');
        sendDiscordMessage(`The product at ${productUrl} is in stock!`, productUrl);
    } else {
        console.log('The product is out of stock.');
    }

    console.log(`Stock check completed for: ${productUrl}`);
  } catch (error) {
    console.error('Error checking stock:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  setTimeout(() => checkStock(productUrl), 120000);
}

async function sendDiscordMessage(message, productUrl) {
  try {
    const response = await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [
          {
            title: 'Product In Stock!',
            description: message,
            color: 5814783,
            fields: [
              {
                name: 'Product URL',
                value: productUrl,
              },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Discord message sent successfully');
  } catch (error) {
    console.error('Error sending Discord message:', error);
  }
}