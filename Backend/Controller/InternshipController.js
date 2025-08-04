import puppeteer from "puppeteer";
import axios from "axios";

const OPENCAGE_API_KEY = "97b8ff809b234987ae01fe8d7ac25edd"; // Replace with your actual API key

export const FetchInternships = async (req, res) => {
  const { category } = req.query;
  console.log("Requested Category:", category);

  if (!category) return res.status(400).json({ error: "Category is required" });

  const URL = `https://internshala.com/jobs/keywords-${encodeURIComponent(category)}`;

  try {
    console.log(`🚀 Opening category page: ${URL}`);
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: "networkidle2" });
    await page.waitForSelector(".individual_internship");

    const internships = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".individual_internship"))
        .map(el => {
          const title = el.querySelector("h3 a")?.innerText.trim();
          if (!title) return null;

          return {
            title,
            company: el.querySelector(".company_name")?.innerText.trim() || "Unknown Company",
            location: el.querySelector(".locations span a")?.innerText.trim() || "No Location",
            link: el.querySelector("a")?.href || "No Link",
            logo: el.querySelector(".internship_logo img")?.src || "No Logo",
            duration: el.querySelector(".ic-16-briefcase + span")?.innerText.trim() || "Duration Not Specified",
            stipend: el.querySelector(".ic-16-money + span")?.innerText.trim() || "Unpaid",
          };
        })
        .filter(item => item !== null)
        .slice(0, 15);
    });

    await browser.close();

    // Add coordinates using OpenCage
    const enrichedInternships = await Promise.all(
      internships.map(async (internship) => {
        try {
          const response = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
            params: {
              key: OPENCAGE_API_KEY,
              q: internship.location,
              limit: 1,
            },
          });

          const geometry = response.data.results[0]?.geometry;
          return {
            ...internship,
            coordinates: geometry ? { lat: geometry.lat, lng: geometry.lng } : null,
          };
        } catch (err) {
          console.warn(`⚠️ Failed to fetch coordinates for location: ${internship.location}`);
          return { ...internship, coordinates: null };
        }
      })
    );

    res.json(enrichedInternships);
  } catch (error) {
    console.error("🚨 Error fetching internships:", error.message);
    res.status(500).json({ error: "Failed to fetch internships" });
  }
};
