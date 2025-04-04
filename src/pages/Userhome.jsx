import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  Menu,
  Hospital,
  X,
  Stethoscope,
  Brain,
  Apple,
  Pill,
  User,
  LogOut,
  Home,
  Settings,
  Bell,
  HelpCircle,
  Activity,
  Calendar,
  Heart,
  ChevronRight,
  Users,
  FileText,
  BarChart,
} from "lucide-react";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarItems = [
    { icon: <Home className="sidebar-icon" />, label: "Dashboard", category: "main" },
    { icon: <Bell className="sidebar-icon" />, label: "Notifications", category: "main" },
    { icon: <Calendar className="sidebar-icon" />, label: "Appointments", category: "main" },
    { icon: <Users className="sidebar-icon" />, label: "Doctors", category: "health" },
    { icon: <FileText className="sidebar-icon" />, label: "Records", category: "health" },
    { icon: <BarChart className="sidebar-icon" />, label: "Analytics", category: "health" },
    { icon: <Settings className="sidebar-icon" />, label: "Settings", category: "other" },
    { icon: <HelpCircle className="sidebar-icon" />, label: "Help", category: "other" },
  ];

  const features = [
    {
      title: "Analyse your reports",
      icon: <Stethoscope className="w-8 h-8 md:w-12 md:h-12 text-blue-400" />,
      description: "Get instant consultation with certified doctors",
      bgGradient: "from-gray-800 to-gray-700",
      path: "/s",
    },
    {
      title: "Symptoms Detector",
      icon: <Brain className="w-8 h-8 md:w-12 md:h-12 text-purple-400" />,
      description: "Check your symptoms and get instant analysis",
      bgGradient: "from-gray-800 to-gray-700",
      path: "/symptoms",
    },
    {
      title: "Find out the medicine",
      icon: <Hospital className="w-8 h-8 md:w-12 md:h-12 text-green-400" />,
      description: "Unable to find the medicine? Scan it now!",
      bgGradient: "from-gray-800 to-gray-700",
      path: "/medicine",
    },
    {
      title: "Prescription Check",
      icon: <Pill className="w-8 h-8 md:w-12 md:h-12 text-red-400" />,
      description: "Verify and manage your prescriptions",
      bgGradient: "from-gray-800 to-gray-700",
      path: "/prescription",
    },
  ];

  const handleLogOutClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const Overlay = () => (
    <div
      className={`fixed inset-0 bg-black/50 z-10 transition-opacity ${
        isSidebarOpen && isMobile ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setSidebarOpen(false)}
    />
  );

  const handleFeatureClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <Overlay />
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full transition-all duration-300 z-20 bg-gray-900/90 backdrop-blur-lg border-r border-gray-700/50
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isSidebarOpen ? "w-72" : "w-fit"} ${isMobile ? "w-72" : ""}`}
      >
        <div className="p-4 md:p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center space-x-3 ${
                !isSidebarOpen && !isMobile ? "hidden" : ""
              }`}
            >
              <img src="./asselogo.png" alt="Logo" className="w-8 h-8 md:w-10 md:h-10" />
              <h1 className="font-bold text-lg md:text-xl text-blue-400 neon-glow">
                mediverse
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors text-gray-300"
            >
              {isSidebarOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        <div className="px-2 md:px-4 mt-4 md:mt-6">
          {Object.entries(
            sidebarItems.reduce((acc, item) => {
              if (!acc[item.category]) acc[item.category] = [];
              acc[item.category].push(item);
              return acc;
            }, {})
          ).map(([category, items]) => (
            <div key={category} className="mb-6 md:mb-8">
              {(isSidebarOpen || isMobile) && (
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 md:mb-4 px-2">
                  {category}
                </h2>
              )}
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveItem(item.label);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={`w-full px-4 md:px-6 py-3 md:py-4 text-left transition-all duration-300 flex items-center rounded-lg mb-1
                    ${
                      activeItem === item.label
                        ? "bg-blue-500/20 text-blue-400"
                        : "text-gray-300 hover:bg-gray-700/30"
                    }`}
                >
                  <div className="flex items-center w-full">
                    <div className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-center">
                      {item.icon}
                    </div>
                    {(isSidebarOpen || isMobile) && (
                      <>
                        <span className="ml-3 md:ml-4 font-medium text-sm md:text-base">
                          {item.label}
                        </span>
                        <ChevronRight
                          className={`ml-auto w-4 h-4 transition-transform duration-200 
                            ${activeItem === item.label ? "opacity-100" : "opacity-0"}
                            ${activeItem === item.label ? "translate-x-0" : "-translate-x-2"}`}
                        />
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen && !isMobile ? "ml-72" : "ml-0 md:ml-20"}`}>
        <header className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/50">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center">
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 mr-2 rounded-lg hover:bg-gray-700/50 transition-colors text-gray-300"
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}
              <span className="text-base md:text-lg font-semibold text-gray-100 ml-5">
                Health Dashboard
              </span>
            </div>
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700/50 transition-all"
              >
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3"
                  alt="Profile"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full ring-2 ring-gray-700"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-100">John Doe</p>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-xl py-2 z-10 border border-gray-700/50">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-700/50 transition-colors flex items-center text-gray-300">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogOutClick}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700/50 transition-colors flex items-center text-red-400"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-8 mb-6 md:mb-8 border border-gray-700/50 transform hover:scale-[1.01] transition-all">
            <h1 className="text-2xl md:text-4xl font-bold text-blue-400 neon-glow mb-2 md:mb-4">
              Welcome Back, John!
            </h1>
            <p className="text-sm md:text-base text-gray-300">
              Your health journey continues. Here's your daily overview.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group cursor-pointer" onClick={() => handleFeatureClick(feature.path)}>
                <div
                  className={`h-full bg-gradient-to-br ${feature.bgGradient} p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-700/50 
                  transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10`}
                >
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="p-2 md:p-3 bg-gray-900/50 rounded-lg md:rounded-xl shadow-md transform transition-transform group-hover:scale-110">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-100 mb-1 md:mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm md:text-base text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 md:mt-8 bg-gray-800/50 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-700/50 transform hover:scale-[1.01] transition-all">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-100 mb-4 md:mb-6 flex items-center">
              <Heart className="w-5 h-5 md:w-6 md:h-6 text-red-400 mr-2 animate-float" />
              Your Health Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  label: "Appointments",
                  value: "3 Upcoming",
                  icon: <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />,
                },
                {
                  label: "Prescriptions",
                  value: "2 Active",
                  icon: <Pill className="w-5 h-5 md:w-6 md:h-6 text-green-400" />,
                },
                {
                  label: "Health Score",
                  value: "85/100",
                  icon: <Activity className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />,
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-gray-900/50 rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-700/50
                    transform transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm md:text-base text-gray-300">{stat.label}</p>
                    {stat.icon}
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-blue-400 neon-glow">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
