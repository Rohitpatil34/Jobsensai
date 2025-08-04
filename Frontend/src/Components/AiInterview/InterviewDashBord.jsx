import { setUserInterviews } from "../../Features/Auth/interviewSlice";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";
import { Button } from "../ui/button";

export default function InterviewDashBord() {
    const dispatch = useDispatch();
    const userInterviewList = useSelector((state) => state.interview.userInterviews);

    useEffect(() => {
        const fetchAllInterview = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/aiinterview/getUserInterviews`);
                dispatch(setUserInterviews(response.data));
            } catch (error) {
                console.log(error);
            }
        };
        fetchAllInterview();
    }, [dispatch]);

    const handleDeleteInterview = async (interviewId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/aiinterview/interview/${interviewId}`);
            dispatch(setUserInterviews(userInterviewList?.filter(i => i._id !== interviewId)));
            toast.success("Interview deleted successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete interview.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-yellow-100 p-6">
            <motion.h1
                className="text-4xl font-extrabold text-center bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-500 bg-clip-text text-transparent mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                🎯 Your Interview Dashboard
            </motion.h1>

            <div className="flex justify-center mb-8">
                <Link to="/AIJobForm">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transition"
                    >
                        + Start New Interview
                    </motion.button>
                </Link>
            </div>

            <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text">
                    📝 Interview List
                </h2>

                {userInterviewList?.length === 0 ? (
                    <p className="text-center text-gray-500">No interviews found. Start your first interview now!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userInterviewList?.map((interview) => (
                            <motion.div
                                key={interview._id}
                                whileHover={{ scale: 1.03 }}
                                className="relative bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-200 transition-all"
                            >
                                <Button
                                    variant="ghost"
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                    onClick={() => handleDeleteInterview(interview._id)}
                                >
                                    <FiTrash2 size={20} />
                                </Button>

                                <h3 className="text-xl font-bold text-gray-800 mb-2">{interview?.jobRole}</h3>
                                <p className="text-sm text-gray-600">📅 {interview?.updatedAt?.split("T")[0]}</p>

                                <div className="mt-6 flex flex-wrap justify-center gap-3">
                                    <Link to={`/AI-Interivew/${interview?._id}`}>
                                        <button className="bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white px-4 py-2 rounded-full shadow-md transition">
                                            🚀 Start
                                        </button>
                                    </Link>
                                    <Link to={`/AI-Interivew/${interview?._id}/score`}>
                                        <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-4 py-2 rounded-full shadow-md transition">
                                            🧠 Feedback
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
