import puppeteer from "puppeteer";
import axios from "axios";

const OPENCAGE_API_KEY = "97b8ff809b234987ae01fe8d7ac25edd";

const geocodeLocation = async (location) => {
  try {
    const response = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
      params: {
        key: OPENCAGE_API_KEY,
        q: location,
        limit: 1,
      },
    });

    const result = response.data.results[0];
    if (result) {
      return {
        lat: result.geometry.lat,
        lng: result.geometry.lng,
      };
    } else {
      return { lat: null, lng: null };
    }
  } catch (error) {
    console.error("❌ Geocoding error for location:", location, error.message);
    return { lat: null, lng: null };
  }
};

export const fetchjob = async (req, res) => {
  const { category } = req.query;
  if (!category) return res.status(400).json({ error: "Category is required" });

  const encodedCategory = encodeURIComponent(category.trim());
  const URL = `https://apna.co/jobs?search=true&text=${encodedCategory}`;

  try {
    console.log(`🚀 Opening category page: ${URL}`);
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    await page.goto(URL, { waitUntil: "networkidle2", timeout: 0 });
    await page.waitForSelector('[data-testid="job-card"]');

    const scrapedJobs = await page.evaluate(() => {
      function extractJobData(jobCard) {
        try {
          const title = jobCard.querySelector('[data-testid="job-title"]')?.textContent.trim() || "No Title";
          const company = jobCard.querySelector('[data-testid="company-title"]')?.textContent.trim() || "Unknown";
          const location = jobCard.querySelector('[data-testid="job-location"]')?.textContent.trim() || "N/A";
          const salary = jobCard.querySelector('[data-testid="job-salary"]')?.textContent.trim() || "N/A";

          let logo = "";
          const img = jobCard.querySelector('img[alt="company-logo"]');
          if (img && img.src && !img.src.includes("base64")) {
            logo = img.src;
          }

          return {
            title,
            company,
            location,
            link: "https://apna.co" + (jobCard.querySelector("a")?.getAttribute("href") || ""),
            logo,
            duration: "Not Specified", // Apna doesn't show duration
            stipend: salary || "Unpaid",
          };
        } catch (e) {
          console.error("❌ Error parsing job card:", e);
          return null;
        }
      }

      const jobCards = document.querySelectorAll('[data-testid="job-card"]');
      const jobs = [];

      jobCards.forEach(card => {
        const jobData = extractJobData(card);
        if (jobData) jobs.push(jobData);
      });

      return jobs.slice(0, 15);
    });

    await browser.close();

    const jobsWithCoordinates = await Promise.all(
      scrapedJobs.map(async (job) => {
        const coords = await geocodeLocation(job.location);
        return { ...job, coordinates: coords };
      })
    );

    res.json(jobsWithCoordinates);
  } catch (error) {
    console.error("🚨 Error fetching jobs from Apna.co:", error.message);
    res.status(500).json({ error: "Failed to fetch jobs", details: error.message });
  }
};
