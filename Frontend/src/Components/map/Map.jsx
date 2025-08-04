import { useState, useEffect } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen";
import { FaExternalLinkAlt } from "react-icons/fa";

// Fix Leaflet icon path
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Fullscreen control
const FullscreenControl = () => {
  const map = useMap();
  useEffect(() => {
    const fullscreenControl = L.control.fullscreen({ position: "topright" });
    fullscreenControl.addTo(map);
    return () => fullscreenControl.remove();
  }, [map]);
  return null;
};

const JobMapView = ({ jobcategory }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mapReady, setMapReady] = useState(false);

  // Group jobs by location
  const groupJobsByLocation = (jobs) => {
    const grouped = {};
    jobs.forEach(job => {
      const key = `${job.coordinates.lat},${job.coordinates.lng}`;
      if (!grouped[key]) {
        grouped[key] = {
          coordinates: job.coordinates,
          jobs: []
        };
      }
      grouped[key].jobs.push(job);
    });
    return Object.values(grouped);
  };

  // Fetch jobs based on jobcategory
  useEffect(() => {
    const fetchJobs = async () => {
      if (!jobcategory) return;
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/jobs?category=${encodeURIComponent(jobcategory)}`
        );
        // Filter out jobs without valid coordinates or work from home jobs
        const validJobs = res.data.filter(job => 
          job.coordinates && 
          typeof job.coordinates.lat === 'number' && 
          typeof job.coordinates.lng === 'number' &&
          !job.location.toLowerCase().includes('work from home') &&
          !job.location.toLowerCase().includes('remote') &&
          !job.location.toLowerCase().includes('wfh')
        );
        setJobs(validJobs);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch jobs. Please try again.");
      } finally {
        setLoading(false);
        setMapReady(true);
      }
    };

    fetchJobs();
  }, [jobcategory]);

  // Calculate center based on jobs if available
  const calculateCenter = () => {
    if (jobs.length > 0) {
      const lats = jobs.map(job => job.coordinates.lat);
      const lngs = jobs.map(job => job.coordinates.lng);
      return [
        (Math.max(...lats) + Math.min(...lats)) / 2,
        (Math.max(...lngs) + Math.min(...lngs)) / 2
      ];
    }
    return [22.9734, 78.6569]; // Default to India center
  };

  const locationGroups = groupJobsByLocation(jobs);

  return (
    <div className="min-h-screen px-4 py-8 space-y-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">
        {jobcategory ? `${jobcategory} Jobs` : "All Jobs"} Map View
      </h2>

      {loading && (
        <div className="text-center text-blue-600">Loading jobs...</div>
      )}

      {error && <div className="text-center text-red-600">{error}</div>}

      {!loading && jobs.length === 0 && !error && (
        <div className="text-center text-gray-600">
          No location-based jobs found for this category.
        </div>
      )}

      <div className="w-full max-w-6xl h-[400px] rounded-lg overflow-hidden shadow-lg">
        {mapReady && (
          <MapContainer
            center={calculateCenter()}
            zoom={jobs.length > 0 ? 5 : 4}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
            key={JSON.stringify(jobs)}
          >
            <FullscreenControl />
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locationGroups.map((group, index) => (
              <Marker
                key={`${group.coordinates.lat}-${group.coordinates.lng}-${index}`}
                position={[group.coordinates.lat, group.coordinates.lng]}
              >
                <Popup minWidth={300}>
                  <div className="max-h-64 overflow-y-auto">
                    <h3 className="font-semibold mb-2">
                      {group.jobs.length} {group.jobs.length === 1 ? 'Job' : 'Jobs'} at this location
                    </h3>
                    {group.jobs.map((job, jobIndex) => (
                      <div key={`${job.id || job.title}-${jobIndex}`} className="mb-3 pb-3 border-b last:border-b-0">
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-gray-600 mb-1">🏢 {job.company}</p>
                        <p className="text-sm text-gray-600 mb-1">📍 {job.location}</p>
                        {job.link && (
                          <a
                            href={job.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline inline-flex items-center text-sm"
                          >
                            View Job&nbsp;
                            <FaExternalLinkAlt className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default JobMapView;