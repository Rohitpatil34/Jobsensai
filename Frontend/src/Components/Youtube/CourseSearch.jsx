import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../ui/card';

import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Search, Star, Clock, ExternalLink, ChevronRight, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../ui/input';

const CourseSearch = () => {
  const [query, setQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/course?q=${query}`);
      setCourses(response.data.results);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch popular courses on initial load
    if (!query) {
      const fetchPopularCourses = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/course?q=programming`);
          setCourses(response.data.results.slice(0, 6));
        } catch (err) {
          console.error("Error fetching popular courses:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchPopularCourses();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const getDifficultyColor = (level) => {
    if (level.includes('Beginner')) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
    if (level.includes('Intermediate')) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
    if (level.includes('Advanced')) return 'bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-400';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const getDurationIcon = (duration) => {
    if (duration.includes('Week')) return <Clock className="h-4 w-4 mr-1" />;
    if (duration.includes('Month')) return <Clock className="h-4 w-4 mr-1" />;
    return <Clock className="h-4 w-4 mr-1" />;
  };

  return (
    <div className="container mx-auto px-4  mt-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Discover Your Next Certification
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find professional certification courses from top universities and companies worldwide
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-2xl mx-auto mb-16"
      >
        <form onSubmit={handleSubmit} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for courses (e.g. Java, Python, AWS, Machine Learning)"
            className="pl-10 pr-24 py-6 text-lg border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800/50"
          />
          <Button 
            type="submit" 
            size="lg" 
            className="absolute right-2 top-2 h-10 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Rocket className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setQuery('Java')}
            className="text-sm"
          >
            Java
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setQuery('Python')}
            className="text-sm"
          >
            Python
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setQuery('AWS')}
            className="text-sm"
          >
            AWS
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setQuery('Data Science')}
            className="text-sm"
          >
            Data Science
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setQuery('Machine Learning')}
            className="text-sm"
          >
            Machine Learning
          </Button>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto p-4 mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200"
        >
          {error}
        </motion.div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full rounded-md" />
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card className="h-full flex flex-col border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-300 group">
                  <div className="relative pt-[56.25%] overflow-hidden rounded-t-lg">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <Button 
                        asChild 
                        size="sm" 
                        className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                      >
                        <a 
                          href={course.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          Enroll Now <ChevronRight className="h-4 w-4 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span className="text-sm font-medium">{course.provider}</span>
                      {course.rating && (
                        <span className="flex items-center text-amber-500">
                          <Star className="h-4 w-4 fill-current mr-1" />
                          {course.rating}
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {course.duration.split('·').map((item, i) => (
                        <Badge 
                          key={i} 
                          variant="outline"
                          className={`inline-flex items-center ${i === 0 ? getDifficultyColor(item.trim()) : 'bg-gray-100 dark:bg-gray-800'}`}
                        >
                          {i === 1 && getDurationIcon(item.trim())}
                          {item.trim()}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button 
                      asChild 
                      className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300"
                      variant="outline"
                    >
                      <a 
                        href={course.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Details
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {!loading && courses.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl mx-auto text-center py-16"
        >
          <div className="mx-auto w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
            <Search className="h-12 w-12 text-blue-500 dark:text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold mb-3">No courses found</h3>
          <p className="text-muted-foreground mb-6">
            Try searching for a different topic or browse our popular categories
          </p>
          <Button 
            variant="outline" 
            onClick={() => setQuery('Programming')}
            className="border-blue-500 text-blue-600 dark:text-blue-400"
          >
            <Rocket className="h-4 w-4 mr-2" />
            Browse Popular Courses
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default CourseSearch;