import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Bookmark,
  Share2,
  List,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Loader2,
  ChevronLeft,
  Clock,
  BookmarkCheck,
} from "lucide-react";
import { Youtube } from "lucide-react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Slider } from "../ui/slider";

const PlaylistPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const [playlist, setPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [progress, setProgress] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCopied, setShowCopied] = useState(false);

  // Fetch playlist details
  useEffect(() => {
    const fetchPlaylist = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/youtube/playlist/${id}`);
        setPlaylist(response.data.playlist);
        setVideos(response.data.videos);
        
        // Check if bookmarked
        const bookmarks = JSON.parse(localStorage.getItem('yt-bookmarks') || '[]');
        setIsBookmarked(bookmarks.includes(id));
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load playlist');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlaylist();
  }, [id]);

  // Load saved notes
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem(`notes-${id}`) || '[]');
    setNotes(savedNotes);
  }, [id]);

  // Simulate progress tracking
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && progress < 100) {
        setProgress(prev => Math.min(prev + 0.5, 100));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, progress]);

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    const timestamp = Math.floor((progress / 100) * 10) * 60;
    const newNotes = [...notes, { 
      text: newNote, 
      timestamp, 
      videoIndex: currentVideoIndex 
    }];
    
    setNotes(newNotes);
    localStorage.setItem(`notes-${id}`, JSON.stringify(newNotes));
    setNewNote("");
  };

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('yt-bookmarks') || '[]');
    const newBookmarks = isBookmarked 
      ? bookmarks.filter(b => b !== id)
      : [...bookmarks, id];
    
    localStorage.setItem('yt-bookmarks', JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const handleVideoChange = (index) => {
    setCurrentVideoIndex(index);
    setIsPlaying(true);
    setProgress(0);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const handleSpeedChange = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackRate(speeds[nextIndex]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const sharePlaylist = () => {
    if (navigator.share) {
      navigator.share({
        title: playlist?.title || 'YouTube Playlist',
        text: 'Check out this playlist I found!',
        url: window.location.href,
      }).catch(() => {
        navigator.clipboard.writeText(window.location.href);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-lg">Loading playlist...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-screen"
      >
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate(-1)}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  if (!playlist || videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No playlist data</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Could not load playlist data</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate(-1)}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      {/* Main Player Area */}
      <div className="flex-1 p-4 lg:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <Card className="h-full overflow-hidden">
            {/* Player Header */}
            <CardHeader className="flex-row items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="rounded-full"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-lg font-semibold line-clamp-1">
                  {playlist.title}
                </h2>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleBookmark}
                  aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="h-5 w-5 text-primary" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={sharePlaylist}
                  aria-label="Share playlist"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  className="lg:hidden"
                  aria-label="Toggle playlist"
                >
                  <List className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>

            {/* YouTube Player */}
            <CardContent className="p-0">
              <div className="relative pt-[56.25%] bg-black">
                <iframe
                  ref={playerRef}
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videos[currentVideoIndex]?.id}?list=${id}&autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                  title={videos[currentVideoIndex]?.title}
                />
              </div>
            </CardContent>

            {/* Player Controls */}
            <CardFooter className="flex flex-col p-4 space-y-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handlePrevVideo}
                    disabled={currentVideoIndex === 0}
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  
                  <Button 
                    variant="default" 
                    size="icon"
                    onClick={handlePlayPause}
                    className="h-12 w-12"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleNextVideo}
                    disabled={currentVideoIndex === videos.length - 1}
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  
                  <div className="w-24">
                    <Slider 
                      value={[volume]}
                      onValueChange={([val]) => {
                        setVolume(val);
                        setIsMuted(val === 0);
                      }}
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    onClick={handleSpeedChange}
                    className="text-sm"
                  >
                    {playbackRate}x
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full space-y-1">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime((progress / 100) * 600)}</span>
                  <span>Video {currentVideoIndex + 1} of {videos.length}</span>
                  <span>10:00</span>
                </div>
              </div>
            </CardFooter>

            {/* Video Info */}
            <CardContent className="p-4 border-t">
              <h2 className="text-lg font-semibold mb-2">
                {videos[currentVideoIndex]?.title}
              </h2>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {videos[currentVideoIndex]?.description || 'No description available'}
              </p>
            </CardContent>

            {/* Notes Section */}
            <CardContent className="p-4 border-t">
              <div className="flex items-center mb-4">
                <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                <h3 className="font-medium">My Notes</h3>
              </div>
              
              <form onSubmit={handleNoteSubmit} className="mb-4">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note at current timestamp..."
                  />
                  <Button type="submit">Add</Button>
                </div>
              </form>

              <AnimatePresence>
                {notes.filter(note => note.videoIndex === currentVideoIndex).length > 0 ? (
                  <motion.div 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3 max-h-60 overflow-y-auto"
                  >
                    {notes
                      .filter(note => note.videoIndex === currentVideoIndex)
                      .sort((a, b) => a.timestamp - b.timestamp)
                      .map((note, index) => (
                      <motion.div 
                        key={index}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-100 dark:border-yellow-800/50"
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-sm">{note.text}</p>
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(note.timestamp)}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-4 text-muted-foreground text-sm"
                  >
                    No notes yet for this video
                  </motion.p>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Playlist Sidebar */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`lg:w-80 bg-background border-l lg:block`}
          >
            <Card className="h-full rounded-none border-l-0 border-t-0 border-b-0">
              <CardHeader className="border-b p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Youtube className="h-5 w-5 mr-2 text-destructive" />
                    <CardTitle className="text-lg">Playlist</CardTitle>
                  </div>
                  <Badge variant="outline">{videos.length} videos</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto h-[calc(100vh-65px)]">
                <LayoutGroup>
                  {videos.map((video, index) => (
                    <motion.div
                      key={video.id || index}
                      layout
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div 
                        onClick={() => handleVideoChange(index)}
                        className={`p-3 border-b cursor-pointer flex items-center transition-colors ${currentVideoIndex === index ? 'bg-accent' : 'hover:bg-muted/50'}`}
                      >
                        <div className="relative mr-3 flex-shrink-0">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-16 h-10 object-cover rounded"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/160x90?text=No+Thumbnail';
                            }}
                          />
                          <Badge variant="secondary" className="absolute bottom-1 right-1 px-1 text-xs">
                            {video.duration || '0:00'}
                          </Badge>
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="text-sm font-medium truncate">
                            {video.title}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {video.channelTitle}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </LayoutGroup>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simple copied notification */}
      <AnimatePresence>
        {showCopied && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg"
          >
            Link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default PlaylistPlayer;