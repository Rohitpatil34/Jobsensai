import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
    FaSpinner,
    FaCheckCircle,
    FaFilePdf,
    FaSearch,
    FaExternalLinkAlt,
    FaRegLightbulb,
    FaRegCheckCircle,
    FaRegTimesCircle,
    FaRegFileAlt
} from "react-icons/fa";
import { FiUpload, FiAlertCircle, FiBriefcase, FiMapPin, FiLayers } from "react-icons/fi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import JobMapView from "../map/Map";

function ATSResume() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState("");
    const [category, setCategory] = useState("React Developer");
    const [jobs, setJobs] = useState([]);
    const [course, setcourse] = useState([]);
    const carouselRef = useRef(null);
    const carouselRef2 = useRef(null);

    // Bubble background effect
    useEffect(() => {
        const createBubble = () => {
            const bubble = document.createElement("div");
            bubble.className = "absolute rounded-full bg-blue-100/30 backdrop-blur-sm";
            
            // Random size between 40px and 120px
            const size = Math.random() * 80 + 40;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            
            // Random position
            bubble.style.left = `${Math.random() * 100}%`;
            bubble.style.top = `${Math.random() * 100}%`;
            
            // Random animation
            const duration = Math.random() * 20 + 10;
            bubble.style.animation = `float ${duration}s linear infinite`;
            bubble.style.opacity = Math.random() * 0.5 + 0.1;
            
            document.getElementById("bubble-container").appendChild(bubble);
        };

        // Create initial bubbles
        for (let i = 0; i < 15; i++) {
            createBubble();
        }

        // Add some bubbles periodically
        const interval = setInterval(createBubble, 3000);
        
        return () => clearInterval(interval);
    }, []);

    // Rest of your existing code remains the same...
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
            setError("");
            setResponse(null);
        }
    };

    const suggestcertificate = async (data) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/course?q=${data}`);
            setcourse(res?.data?.results);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch jobs. Please try again.");
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            setError("Please upload a resume (PDF format).");
            return;
        }

        setLoading(true);
        setError("");
        setResponse(null);
        setJobs([]);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("category", category);

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/resume/analyze`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            setResponse(res.data);

            const jobRes = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/jobs?category=${res?.data?.recommendedjob}`
            );
            suggestcertificate(res?.data?.SuggestedCertification[0])
            setJobs(jobRes.data);
        } catch (err) {
            console.error("Error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const scrollPrev = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        }
    };

    const scrollPrev2 = () => {
        if (carouselRef2.current) {
            carouselRef2.current.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        }
    };

    const scrollNext = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
    };

    const scrollNext2 = () => {
        if (carouselRef2.current) {
            carouselRef2.current.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
    };

    const getMatchColor = (percentage) => {
        if (percentage >= 80) return 'bg-emerald-500';
        if (percentage >= 60) return 'bg-blue-500';
        if (percentage >= 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="min-h-screen bg-white mt-10  py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Bubble Background Container */}
            <div 
                id="bubble-container"
                className="fixed inset-0 w-full h-full pointer-events-none z-0"
            />
            
            {/* Global styles for bubbles - add this to your CSS file or style tag */}
            <style jsx>{`
                @keyframes float {
                    0% {
                        transform: translateY(0) translateX(0) rotate(0deg);
                        opacity: 0.1;
                    }
                    50% {
                        opacity: 0.3;
                    }
                    100% {
                        transform: translateY(-100vh) translateX(20vw) rotate(360deg);
                        opacity: 0;
                    }
                }
            `}</style>

            <div className="max-w-7xl mx-auto relative z-10">
               

                {/* Response Panel */}
                {!response && (
                    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl overflow-hidden mb-8 w-full mx-auto">
                        <div className="p-8 sm:p-10">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Resume ATS Analyzer
                                </h1>
                                <p className="text-lg text-gray-600 mt-3">
                                    Get instant feedback on how well your resume matches job requirements
                                </p>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* File Upload - With gradient border */}
                                <div className="space-y-3">
                                    <label className="block text-lg font-medium text-gray-700 mb-3">
                                        Upload Your Resume (PDF)
                                        <span className="text-sm text-gray-500 ml-2">(up to 5MB)</span>
                                    </label>
                                    <div className="flex justify-center px-8 pt-10 pb-10 border-2 border-dashed rounded-2xl transition-all duration-200 bg-gradient-to-br from-white to-blue-50 hover:border-blue-400 hover:from-white hover:to-blue-100 group">
                                        <div className="space-y-3 text-center w-full">
                                            {file ? (
                                                <div className="flex flex-col items-center justify-center space-y-3">
                                                    <FaFilePdf className="h-16 w-16 text-red-500" />
                                                    <span className="text-lg font-medium text-gray-900 truncate max-w-md">
                                                        {fileName}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFile(null)}
                                                        className="text-md font-medium bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent hover:from-blue-600 hover:to-blue-700 transition-all"
                                                    >
                                                        Change file
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex justify-center">
                                                        <FiUpload className="h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                                    </div>
                                                    <div className="flex flex-col items-center text-md text-gray-600">
                                                        <label
                                                            htmlFor="file-upload"
                                                            className="relative cursor-pointer rounded-md font-medium bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent hover:from-blue-600 hover:to-indigo-700 text-lg transition-all"
                                                        >
                                                            <span>Click to upload</span>
                                                            <input
                                                                id="file-upload"
                                                                name="file-upload"
                                                                type="file"
                                                                accept="application/pdf"
                                                                onChange={handleFileChange}
                                                                className="sr-only"
                                                            />
                                                        </label>
                                                        <p className="text-gray-500 mt-2">or drag and drop here</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Category Input - With gradient focus */}
                                <div className="space-y-3">
                                    <label htmlFor="category" className="block text-lg font-medium text-gray-700 mb-3">
                                        Target Job Category
                                    </label>
                                    <div className="relative rounded-lg">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FaSearch className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            id="category"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 focus:border-transparent block w-full pl-12 pr-5 py-4 border-2 border-gray-200 rounded-lg text-md bg-white focus:bg-gradient-to-r focus:from-blue-50 focus:to-indigo-50 transition-all"
                                            placeholder="e.g. React Developer, Data Scientist, Marketing Manager"
                                        />
                                    </div>
                                </div>

                                {/* Error Display - With gradient border */}
                                {error && (
                                    <div className="rounded-lg bg-gradient-to-br from-red-50 to-pink-50 p-4 border-2 border-transparent bg-origin-border border-gradient-to-r from-red-200 to-pink-200">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <FiAlertCircle className="h-6 w-6 text-red-500" />
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-md font-medium text-red-800">{error}</h3>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button - Gradient background */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading || !file}
                                        className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-sm text-lg font-semibold text-white ${loading || !file ? 'bg-gradient-to-r from-blue-400 to-blue-500 opacity-80 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300'} transition-all duration-200`}
                                    >
                                        {loading ? (
                                            <>
                                                <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <FaSearch className="-ml-1 mr-2 h-5 w-5" />
                                                Analyze Resume & Find Jobs
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Response Panel */}
                {response && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Resume Analysis */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* ATS Match Card */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900">ATS Match Score</h2>
                                    <div className="text-3xl font-bold text-blue-600 bg-white px-4 py-2 rounded-full shadow-sm">
                                        {response.matchPercentage}%
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                    <div
                                        className={`h-3 rounded-full ${getMatchColor(response.matchPercentage)}`}
                                        style={{ width: `${response.matchPercentage}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Your resume matches <strong>{response.matchPercentage}%</strong> of keywords and skills typically sought for <strong>{category}</strong> roles.
                                </p>
                            </div>

                            {/* Strengths Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-green-50 text-green-600">
                                            <FaRegCheckCircle className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Strengths</h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {response.strengths.map((point, idx) => (
                                            <li key={idx} className="flex items-start">
                                                <span className="flex-shrink-0 mt-1 mr-2 text-green-500">
                                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                                <span className="text-gray-700">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Missing Keywords Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-red-50 text-red-600">
                                            <FaRegTimesCircle className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Missing Keywords</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {response.missingKeywords.map((keyword, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200"
                                            >
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-3">
                                        Adding these keywords could improve your match by 10-15%
                                    </p>
                                </div>
                            </div>

                            {/* Suggestions Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                            <FaRegLightbulb className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Suggestions</h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {response.suggestions.map((suggestion, idx) => (
                                            <li key={idx} className="flex items-start">
                                                <span className="flex-shrink-0 mt-1 mr-2 text-blue-500">
                                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                                <span className="text-gray-700">{suggestion}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                                            <FiMapPin className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Job Locations</h3>
                                    </div>
                                    <div className="h-[400px] rounded-lg overflow-hidden">
                                        <h1>{response.recommendedjob}</h1>
                                        <JobMapView jobcategory={response.recommendedjob} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Actionable Items */}
                        <div className="space-y-6">
                            {/* Summary Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                                            <FaRegFileAlt className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{response.summary}</p>
                                </div>
                            </div>

                            {/* Suggested Projects */}
                            {response?.SuggestedProject?.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-yellow-50 text-yellow-600">
                                                <FiLayers className="h-5 w-5" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900">Recommended Projects</h3>
                                        </div>

                                        <div className="space-y-4">
                                            {response.SuggestedProject.map((project, idx) => (
                                                <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                    <div className="flex-shrink-0 mt-1 text-blue-500">
                                                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 font-medium">
                                                            {idx + 1}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">Project Idea {idx + 1}</h4>
                                                        <p className="text-sm text-gray-600 mt-1">{project}</p>

                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Job Map View */}
                            {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                                            <FiMapPin className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Job Locations</h3>
                                    </div>
                                    <div className="h-64 rounded-lg overflow-hidden">
                                        <JobMapView />
                                    </div>
                                </div>
                            </div> */}

                            {/* Job Listings Carousel */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                            <FiBriefcase className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Recommended Jobs</h3>
                                    </div>

                                    <div className="relative">
                                        <button
                                            onClick={scrollPrev2}
                                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-gray-50"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <div ref={carouselRef2} className="flex overflow-x-auto snap-x snap-mandatory space-x-4 scroll-pl-4 scrollbar-none pb-4">
                                            {jobs.map((job, idx) => (
                                                <div key={idx} className="snap-start w-full flex-shrink-0 w-72 bg-white p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                                    <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
                                                    <p className="text-sm text-gray-600 mb-1 flex items-center">
                                                        <FiBriefcase className="mr-2" /> {job.company}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mb-1 flex items-center">
                                                        <FiMapPin className="mr-2" /> {job.location}
                                                    </p>
                                                    <a
                                                        href={job.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                    >
                                                        View  <FaExternalLinkAlt className="ml-1 h-3 w-3" />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={scrollNext2}
                                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-gray-50"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* Job Listings Carousel */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                            <FiBriefcase className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Recommended certification</h3>
                                    </div>

                                    <div className="relative">
                                        <button
                                            onClick={scrollPrev}
                                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-gray-50"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <div ref={carouselRef} className="flex overflow-x-auto snap-x snap-mandatory space-x-4 scroll-pl-4 scrollbar-none pb-4">
                                            {course.map((job, idx) => (
                                                <div
                                                    key={idx}
                                                    className="snap-start flex-shrink-0 w-full bg-white p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                                                >
                                                    {/* <img
                                                  src={job.image}
                                                  alt={job.title}
                                                  className="w-full h-36 object-cover rounded-md mb-3"
                                                /> */}
                                                    <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
                                                    <p className="text-sm text-gray-600 mb-1">🎓 {job.provider}</p>
                                                    {job.rating && (
                                                        <p className="text-sm text-yellow-600 font-medium mb-1">⭐ {job.rating}</p>
                                                    )}
                                                    <p className="text-sm text-gray-600 mb-2">⏱️ {job.duration}</p>

                                                    <a
                                                        href={job.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                    >
                                                        View on Coursera <FaExternalLinkAlt className="ml-1 h-3 w-3" />
                                                    </a>
                                                </div>

                                            ))}
                                        </div>
                                        <button
                                            onClick={scrollNext}
                                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-gray-50"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ATSResume;