import puppeteer from 'puppeteer';

export const scrapeCourseraCourses = async (req, res) => {
  const keyword = req.query.q || 'java';
  const url = `https://www.coursera.org/search?query=${encodeURIComponent(keyword)}`;

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('[data-testid="product-card-cds"]');

    const data = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[data-testid="product-card-cds"]'));
      return cards.map(card => {
        const image = card.querySelector('img')?.src || '';
        const title = card.querySelector('h3')?.innerText || '';
        const provider = card.querySelector('.cds-ProductCard-partnerNames')?.innerText || '';
        const rating = card.querySelector('[role="meter"] span')?.innerText || '';
        const reviews = card.querySelector('[role="meter"]')?.nextElementSibling?.innerText || '';
        const duration = card.querySelector('.cds-CommonCard-metadata p')?.innerText || '';
        const link = card.querySelector('a')?.href
          ? `https://www.coursera.org${card.querySelector('a').getAttribute('href')}`
          : '';

        return { title, provider, rating, reviews, duration, link ,image };
      });
    });

    await browser.close();
    res.json({ keyword, results: data });
  } catch (err) {
    console.error('Scraping error:', err);
    res.status(500).json({ error: 'Failed to scrape Coursera courses.' });
  }
};
