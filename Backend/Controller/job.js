// controllers/jobController.js
import axios from "axios";

const fetchJobsFromAdzuna = async (req, res) => {
  try {
    const { what = 'Web Developer', where = 'Maharashtra' } = req.query;

    // Fetch jobs from Adzuna
    const { data } = await axios.get(
      'https://api.adzuna.com/v1/api/jobs/in/search/1',
      {
        params: {
          app_id: '1c45eb45',
          app_key: '6d601994591925b14a47f8f3fa74c12a',
          what,
          where
        }
      }
    );

    const jobResults = data.results;

    // Fetch coordinates for each job location
    const jobsWithCoordinates = await Promise.all(
      jobResults.map(async (job) => {
        const location = job.location?.area?.slice(-1)[0] || 'N/A';

        let coordinates = { lat: null, lng: null };

        if (location !== 'N/A') {
          try {
            const geoRes = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
              params: {
                key: '97b8ff809b234987ae01fe8d7ac25edd',  // <-- Replace with your actual key
                q: location,
                countrycode: 'in',
                limit: 1
              }
            });

            const geometry = geoRes.data.results[0]?.geometry;
            if (geometry) {
              coordinates = { lat: geometry.lat, lng: geometry.lng };
            }
          } catch (geoError) {
            console.warn(`Failed to get coordinates for ${location}:`, geoError.message);
          }
        }

        return {
          title: job.title || 'N/A',
          company: job.company?.display_name || 'N/A',
          location,
          link: job.redirect_url,
          logo: 'https://internshala.com/static/images/search/placeholder_logo.svg',
          coordinates
        };
      })
    );

    res.json(jobsWithCoordinates);
  } catch (error) {
    console.error('Error fetching jobs from Adzuna:', error.message);
    res.status(500).json({ error: 'Failed to fetch jobs from Adzuna' });
  }
};

export { fetchJobsFromAdzuna };
