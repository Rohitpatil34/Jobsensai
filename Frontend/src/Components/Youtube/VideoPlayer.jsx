import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const VideoPlayer = () => {
  const { id } = useParams(); // Get the video ID from URL

  useEffect(() => {
    // You can fetch video details here if you want, or directly use the ID to load the video
  }, [id]);

  return (
    <div className="p-4 max-w-screen-lg mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-2">Now Playing</h2>
      <iframe
        width="100%"
        height="400"
        src={`https://www.youtube.com/embed/${id}`}
        frameBorder="0"
        allowFullScreen
        className="rounded"
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
