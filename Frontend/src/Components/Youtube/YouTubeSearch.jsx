import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const YouTubeSearch = () => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("video");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [defaultContent, setDefaultContent] = useState([]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Fetch default content on component mount
  useEffect(() => {
    const fetchDefaultContent = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/youtube`, {
          params: { q: "Tech", type: "playlist", maxResults: 6 },
        });
        setDefaultContent(res.data);
      } catch (err) {
        console.error(err.message);
        setError("Failed to load trending content");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDefaultContent();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/youtube`, {
        params: { q: query, type },
      });
      setResults(res.data);
    } catch (err) {
      setError("Failed to fetch results. Please try again.");
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderCard = (item) => {
    const { snippet } = item;
    const id = item.id.videoId || item.id.playlistId || item.id.channelId;
    
    return (
      <motion.div 
        key={id}
        variants={itemVariants}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="h-full"
      >
        <Card className="h-full flex flex-col overflow-hidden border-border hover:shadow-lg transition-shadow">
          <div className="relative aspect-video overflow-hidden">
            <img
              src={snippet.thumbnails.high?.url || snippet.thumbnails.default.url}
              alt={snippet.title}
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
            />
          </div>
          <CardHeader className="flex-1 p-4">
            <h3 className="font-semibold line-clamp-2">{snippet.title}</h3>
            <p className="text-sm text-muted-foreground">{snippet.channelTitle}</p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {snippet.description}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            {type === "video" && (
              <Button asChild variant="link" className="p-0 h-auto">
                <Link to={`video/${id}`} className="text-primary">
                  Watch Video →
                </Link>
              </Button>
            )}
            {type === "playlist" && (
              <Button asChild variant="link" className="p-0 h-auto">
                <Link to={`playlist/${id}`} className="text-primary">
                  View Playlist →
                </Link>
              </Button>
            )}
            {type === "channel" && (
              <Button asChild variant="link" className="p-0 h-auto">
                <a
                  href={`https://www.youtube.com/channel/${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary"
                >
                  View Channel →
                </a>
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    );
  };

  const renderSkeleton = () => (
    <motion.div variants={itemVariants} className="h-full">
      <Card className="h-full overflow-hidden">
        <Skeleton className="aspect-video w-full" />
        <CardHeader className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-4 w-24" />
        </CardFooter>
      </Card>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto mb-12"
      >
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          YouTube Explorer
        </h1>
        <p className="text-muted-foreground text-center mb-6">
          Discover videos, playlists, and channels
        </p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search YouTube..."
              className="pl-9"
            />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="playlist">Playlists</SelectItem>
              <SelectItem value="channel">Channels</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Search
          </Button>
        </form>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 max-w-3xl mx-auto"
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <React.Fragment key={i}>{renderSkeleton()}</React.Fragment>
          ))
        ) : results.length > 0 ? (
          results.map(renderCard)
        ) : (
          defaultContent.map(renderCard)
        )}
      </motion.div>

      {!loading && results.length === 0 && defaultContent.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center text-muted-foreground"
        >
          <p>Showing trending videos. Try searching for something else!</p>
        </motion.div>
      )}
    </div>
  );
};

export default YouTubeSearch;