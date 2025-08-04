import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './App/Store';
import "react-toastify/dist/ReactToastify.css";
import LandingPage from './Pages/LandingPage';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import Layout from './Pages/Layout';
import { ToastContainer } from 'react-toastify';
import InterviewDashBord from './Components/AiInterview/InterviewDashBord';
import JobForm from './Components/AiInterview/JobForm';
import AiInterview from './Components/AiInterview/AiInterview';
import AIQuestionsPage from './Components/AiInterview/AIQuestionspage';
import ScorePage from './Components/AiInterview/ScorePage';
import ATSResume from './Components/chat/ATSResume';
import ChatGemini from './Components/Chatwithgemini/ChatGemini';

import YouTubeSearch from './Components/Youtube/YouTubeSearch';
import PlaylistPlayer from './Components/Youtube/PlaylistPlayer';
import VideoPlayer from './Components/Youtube/VideoPlayer';
import CourseSearch from './Components/Youtube/CourseSearch';
import JobSearch from './Components/Youtube/JobSearch';
import JobMapView from './Components/map/Map';


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />}>
            {/* Main Pages */}
            <Route index element={<LandingPage />} />
            <Route path="login" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="ainterview" element={<InterviewDashBord />} />
            <Route path="AIJobForm" element={<JobForm />} />
            <Route path="resume" element={<ATSResume />} />
            <Route path="AI-Interivew/:interviewId" element={<AiInterview />} />
            <Route path="AI-Interivew/:interviewId/start" element={<AIQuestionsPage />} />
            <Route path="AI-Interivew/:interviewId/score" element={<ScorePage />} />
            <Route path="chat" element={<ChatGemini />} />
            <Route path="map" element={<JobMapView />} />
            <Route path="course" element={<CourseSearch />} />
            <Route path="job" element={<JobSearch />} />
            <Route path="youtube" element={<YouTubeSearch />} />
            <Route path="youtube/video/:id" element={<VideoPlayer />}  />
            <Route path="youtube/playlist/:id" element={<PlaylistPlayer />} />

        </Route>
    )
);

const App = () => {
    return (
        <Provider store={store}>
            <RouterProvider router={router} />
            <ToastContainer position="top-right" autoClose={3000} />
        </Provider>
    );
};

export default App;
