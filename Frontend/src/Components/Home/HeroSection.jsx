import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ReactTyped } from "react-typed";
import curveImg from "../assets/curve.png";
import hero from "../assets/hero.png";
import { Link } from "react-router-dom";

// Floating Bubble animation
const Bubble = ({ left, size, delay }) => (
    <motion.div
        className="absolute bottom-0 rounded-full bg-white opacity-10"
        style={{
            left: `${left}%`,
            width: size,
            height: size,
        }}
        initial={{ y: 0 }}
        animate={{ y: -1000 }}
        transition={{
            duration: 20 + Math.random() * 10,
            delay,
            repeat: Infinity,
            ease: "linear",
        }}
    />
);

// Custom Floating Elements
const FloatingElement = ({ top, left, size, color, blur, delay, rotate, shape }) => (
    <motion.div
        className={`absolute ${shape === 'square' ? 'rounded-lg' : 'rounded-full'} ${blur ? "backdrop-blur-md" : ""}`}
        style={{
            top,
            left,
            width: size,
            height: size,
            background: color,
            filter: blur ? "blur(20px)" : "none",
            opacity: 0.3,
        }}
        initial={{ y: 0, rotate: 0 }}
        animate={{
            y: [0, -30, 0],
            rotate: rotate ? [0, 360, 0] : 0,
            scale: [1, 1.1, 1]
        }}
        transition={{
            duration: 8 + Math.random() * 4,
            ease: "easeInOut",
            repeat: Infinity,
            delay: delay || 0,
        }}
    />
);

const HeroSection = () => {
    const parallaxRef = useRef(null);

    const floatingElements = [
        { top: "10%", left: "5%", size: "60px", color: "#4f46e5", blur: true, delay: 0, rotate: true },
        { top: "70%", left: "80%", size: "100px", color: "#10b981", blur: false, delay: 0.5 },
        { top: "20%", left: "75%", size: "80px", color: "#f59e0b", blur: true, delay: 1, shape: 'square' },
        { top: "60%", left: "15%", size: "120px", color: "#ec4899", blur: false, delay: 1.5, rotate: true },
        { top: "30%", left: "50%", size: "50px", color: "#3b82f6", blur: true, delay: 2 },
    ];

    const features = [
        {
            icon: (
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ),
            title: "Smart Job Matching",
            description: "Our AI analyzes your profile to find the perfect job matches."
        },
        {
            icon: (
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            title: "Practice",
            description: "Practice your skill with according to job description."
        },
        {
            icon: (
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            title: "Career Growth",
            description: "Get personalized recommendations to advance your career."
        },
    ];

    return (
        <section className="pt-20 lg:pt-32 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden z-10" ref={parallaxRef}>

            {/* Background Bubble Animation */}
            <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
                {[...Array(10)].map((_, i) => (
                    <Bubble key={i} left={Math.random() * 100} size={`${20 + Math.random() * 40}px`} delay={i * 2} />
                ))}
            </div>

            {/* Floating Elements */}
            {floatingElements.map((element, index) => (
                <FloatingElement key={index} {...element} />
            ))}

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Hero Content */}
                <div className="text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="border border-indigo-600 p-1 w-60 mx-auto rounded-full flex items-center justify-between mb-4 bg-white/80 backdrop-blur-sm">
                            <span className="font-inter text-xs font-medium text-gray-900 ml-3">Find your dream career path</span>
                            <motion.a href="#" className="w-8 h-8 rounded-full flex justify-center items-center bg-indigo-600" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.83398 8.00019L12.9081 8.00019M9.75991 11.778L13.0925 8.44541C13.3023 8.23553 13.4073 8.13059 13.4073 8.00019C13.4073 7.86979 13.3023 7.76485 13.0925 7.55497L9.75991 4.22241" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </motion.a>
                        </div>
                    </motion.div>

                    <motion.h1 className="max-w-2xl mx-auto text-center font-manrope font-bold text-4xl text-gray-900 mb-5 md:text-5xl leading-[50px]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                        Discover Your Next Career Move with{" "}
                        <span className="text-indigo-600 relative">
                            <span className="relative z-10">JobSensie</span>
                            <motion.img src={curveImg} alt="" className="absolute -bottom-2 left-0 w-full" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.5 }} />
                        </span>
                    </motion.h1>

                    <motion.p className="max-w-md mx-auto text-center text-base font-normal leading-7 text-gray-600 mb-9" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
                        <ReactTyped strings={[
                            "AI-powered job matching tailored to your skills.",
                            "Personalized career recommendations for your growth.",
                            "Smart tools to track and optimize your job search."
                        ]} typeSpeed={40} backSpeed={30} loop />
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-col sm:flex-row justify-center gap-4 mb-14">
                        <Link to="/resume">

                            <motion.a href="#" className="w-full md:w-auto inline-flex items-center justify-center py-3 px-7 text-base font-semibold text-center text-white rounded-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-300" whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(79, 70, 229, 0.4)" }} whileTap={{ scale: 0.95 }}>
                                Get Started
                                <svg className="ml-2" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.5 15L11.0858 11.4142C11.7525 10.7475 12.0858 10.4142 12.0858 10C12.0858 9.58579 11.7525 9.25245 11.0858 8.58579L7.5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>

                            </motion.a>

                        </Link>
                    </motion.div>

                    <motion.div className="flex justify-center mb-20" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.8 }}>
                        <img src={hero} alt="JobSensie dashboard showing job matches and career insights" className="rounded-3xl h-auto object-cover" />
                    </motion.div>
                </div>

                {/* Features Section */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose JobSensie</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ y: -5 }} viewport={{ once: true }}>
                                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                {/* <motion.div className="bg-indigo-600 rounded-2xl p-8 md:p-12 text-center text-white mb-20" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Career?</h2>
                    <p className="max-w-2xl mx-auto mb-6 text-indigo-100">
                        Join thousands of professionals who found their dream jobs through JobSensie's intelligent platform.
                    </p>
                    <motion.a href="#" className="inline-flex items-center justify-center py-3 px-8 text-base font-semibold text-center text-indigo-600 rounded-full bg-white hover:bg-gray-100 transition-all duration-300" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        Get Started
                        <svg className="ml-2" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 15L11.0858 11.4142C11.7525 10.7475 12.0858 10.4142 12.0858 10C12.0858 9.58579 11.7525 9.25245 11.0858 8.58579L7.5 5" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </motion.a>
                </motion.div> */}
            </div>
        </section>
    );
};

export default HeroSection;
