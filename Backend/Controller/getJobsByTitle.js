import axios from "axios";

const RAPID_API_KEY = "0bb63597d7msh446c880aa41dba0p1ab359jsn3d8b2e692a6f";
const RAPID_API_HOST = "active-jobs-db.p.rapidapi.com";

export const getJobsByTitle = async (req, res) => {
  const { title = "Data Engineer", location = "United States" } = req.query;

  try {
    const response = await axios.get("https://active-jobs-db.p.rapidapi.com/active-ats-7d", {
      params: {
        limit: 10,
        offset: 0,
        title_filter: `"${title}"`,
        location_filter: `"${location}"`,
        description_type: "text"
      },
      headers: {
        "x-rapidapi-host": RAPID_API_HOST,
        "x-rapidapi-key": RAPID_API_KEY
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Job API error:", error.message);
    res.status(500).json({ error: "Failed to fetch jobs from RapidAPI" });
  }
};
