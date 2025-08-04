import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkAuth, logoutUser } from "../../Features/Auth/AuthSlice";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu, User, LogIn, ChevronDown } from "lucide-react";

const Header = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        dispatch(checkAuth());
        
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <header className={`fixed top-0 left-0 w-full backdrop-blur-md border-b border-gray-200/30 dark:border-gray-800/30 z-50 transition-all duration-300 ${isScrolled ? "bg-gray-900/90 shadow-lg" : "bg-gray-900/95"}`}>
            <div className="container flex items-center justify-between px-4 py-3 mx-auto sm:px-6">
                {/* Logo Section */}
                <Link 
                    className="flex items-center gap-2 group" 
                    to="/"
                >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 group-hover:bg-indigo-700 transition-colors">
                        <span className="text-white font-bold text-lg">Js</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">
                        <span className="text-white">Job</span>
                        <span className="text-indigo-400">Sensie</span>
                    </h1>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center justify-center flex-grow gap-1 mx-8">
                    <Link 
                        className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg transition-all hover:bg-gray-800/50"
                        to="/resume"
                    >
                        Skill Analysis
                    </Link>
                    <Link 
                        className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg transition-all hover:bg-gray-800/50"
                        to="/chat"
                    >
                        AI Guide
                    </Link>
                    <Link 
                        className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg transition-all hover:bg-gray-800/50"
                        to="/ainterview"
                    >
                        Practice
                    </Link>
                    <Link 
                        className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg transition-all hover:bg-gray-800/50"
                        to="/youtube"
                    >
                        Courses
                    </Link>
                    <Link 
                        className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg transition-all hover:bg-gray-800/50"
                        to="/course"
                    >
                        Certification
                    </Link>
                    <Link 
                        className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg transition-all hover:bg-gray-800/50"
                        to="/job"
                    >
                        Jobs
                    </Link>
                </nav>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {/* Desktop User/Login */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        className="p-0 rounded-full hover:bg-gray-800/50"
                                    >
                                        {user.profilePic?.url ? (
                                            <img 
                                                src={user.profilePic.url} 
                                                alt="Profile" 
                                                className="w-9 h-9 rounded-full border-2 border-gray-700/50 object-cover hover:scale-105 transition-all duration-200" 
                                            />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full border-2 border-gray-700/50 flex items-center justify-center bg-gray-800">
                                                <User className="w-4 h-4 text-gray-300" />
                                            </div>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent 
                                    className="w-56 p-2 bg-gray-900 shadow-xl rounded-xl border border-gray-800"
                                    align="end"
                                >
                                    <div className="text-center p-2">
                                        <p className="text-sm font-semibold text-white">{user.name}</p>
                                        <p className="text-xs text-gray-400">{user.email}</p>
                                    </div>
                                    <hr className="my-1 border-gray-800" />
                                    <div className="flex flex-col gap-1 p-1">
                                        
                                        <Button 
                                            onClick={handleLogout} 
                                            variant="destructive" 
                                            size="sm"
                                            className="w-full mt-1 hover:opacity-90 transition"
                                        >
                                            Log Out
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        ) : (
                            <Link to="/login">
                                <Button className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-medium px-4 py-1.5 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center">
                                    <LogIn className="w-4 h-4 mr-2" />
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-gray-300 hover:text-white"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent 
                                side="right" 
                                className="w-[280px] sm:w-[320px] bg-gray-900/95 border-l border-gray-800/50"
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-800/50">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600">
                                            <span className="text-white font-bold text-lg">Js</span>
                                        </div>
                                        <h1 className="text-xl font-bold tracking-tight">
                                            <span className="text-white">Job</span>
                                            <span className="text-indigo-400">Sensie</span>
                                        </h1>
                                    </div>
                                    
                                    <nav className="flex flex-col gap-1 flex-1">
                                        <Link 
                                            className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-white rounded-lg transition-all hover:bg-gray-800/50"
                                            to="/resume"
                                        >
                                            Skill Analysis
                                        </Link>
                                        <Link 
                                            className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-white rounded-lg transition-all hover:bg-gray-800/50"
                                            to="/chat"
                                        >
                                            AI Guide
                                        </Link>
                                        <Link 
                                            className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-white rounded-lg transition-all hover:bg-gray-800/50"
                                            to="/ainterview"
                                        >
                                            Practice
                                        </Link>
                                        <Link 
                                            className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-white rounded-lg transition-all hover:bg-gray-800/50"
                                            to="/youtube"
                                        >
                                            Courses
                                        </Link>
                                        <Link 
                                            className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-white rounded-lg transition-all hover:bg-gray-800/50"
                                            to="/course"
                                        >
                                            Certification
                                        </Link>
                                    </nav>

                                    {user ? (
                                        <div className="mt-auto pt-4 border-t border-gray-800/50">
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 mb-3">
                                                {user.profilePic?.url ? (
                                                    <img 
                                                        src={user.profilePic.url} 
                                                        alt="Profile" 
                                                        className="w-9 h-9 rounded-full border-2 border-gray-700/50 object-cover" 
                                                    />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-full border-2 border-gray-700/50 flex items-center justify-center bg-gray-700">
                                                        <User className="w-4 h-4 text-gray-300" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-white">{user.name}</p>
                                                    <p className="text-xs text-gray-400">{user.email}</p>
                                                </div>
                                            </div>
                                            <Button 
                                                onClick={handleLogout} 
                                                variant="destructive" 
                                                size="sm"
                                                className="w-full"
                                            >
                                                Log Out
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="mt-auto pt-4 border-t border-gray-800/50">
                                            <Link to="/login" className="w-full">
                                                <Button className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-medium w-full shadow-sm hover:shadow-md">
                                                    <LogIn className="w-4 h-4 mr-2" />
                                                    Login
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;