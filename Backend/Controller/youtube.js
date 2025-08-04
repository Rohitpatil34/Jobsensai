import axios from "axios";

const YOUTUBE_API_KEY = "AIzaSyAq7owgLQA25uGWQMoiPgtYxC0vEnrCz74";

// Helper function to convert ISO8601 duration to readable format
function convertISO8601ToReadable(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Fetch videos or playlists based on query and type
export const searchYouTube = async (req, res) => {
  const { q, type = "video" } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Missing search query 'q'" });
  }

  if (!["video", "playlist", "channel"].includes(type)) {
    return res.status(400).json({ error: "Invalid type. Must be 'video', 'playlist', or 'channel'." });
  }

  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        key: YOUTUBE_API_KEY,
        q,
        part: "snippet",
        maxResults: 10,
        type,
        regionCode: "IN"
      }
    });

    res.json(response.data.items);
  } catch (error) {
    console.error("YouTube API error:", error.message);
    res.status(500).json({ error: "Failed to fetch YouTube data" });
  }
};

/**
 * GET /api/youtube/playlist/:id
 * Fetch playlist details and videos with durations
 */
export const getPlaylist = async (req, res) => {
  const { id } = req.params;
  try {
    // 1) Fetch playlist metadata
    const listRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlists",
      { params: { key: YOUTUBE_API_KEY, part: "snippet", id } }
    );
    const playlist = listRes.data.items[0];
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    // 2) Fetch playlist items
    const itemsRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      { params: { key: YOUTUBE_API_KEY, part: "snippet", playlistId: id, maxResults: 50 } }
    );

    const videos = itemsRes.data.items.map(item => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
      channelTitle: item.snippet.channelTitle,
      duration: "0:00" // Placeholder for duration
    }));

    // 3) Fetch durations
    const ids = videos.map(v => v.id).join(",");
    const detailsRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      { params: { key: YOUTUBE_API_KEY, part: "contentDetails", id: ids } }
    );

    const durations = detailsRes.data.items;
    const enriched = videos.map(v => {
      const detail = durations.find(d => d.id === v.id);
      return detail
        ? { ...v, duration: convertISO8601ToReadable(detail.contentDetails.duration) }
        : v;
    });

    // Return playlist and videos with durations
    res.json({
      playlist: {
        id: playlist.id,
        title: playlist.snippet.title,
        description: playlist.snippet.description,
        channelTitle: playlist.snippet.channelTitle,
        thumbnail: playlist.snippet.thumbnails.medium?.url
      },
      videos: enriched
    });
  } catch (err) {
    console.error("YouTube API error:", err.message);
    res.status(500).json({ error: "Failed to fetch playlist data" });
  }
};
