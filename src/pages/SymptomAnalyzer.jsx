import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope,
  AlertCircle,
  Loader2,
  Brain,
  Heart,
  ClipboardList,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { analyzeSymptoms } from "../lib/analyzeSymptoms";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const SymptomAnalyzer = () => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError("Please describe your symptoms before analyzing.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis("");
    setIsExpanded(true);

    try {
      const analysisOptions = {
        symptoms,
        includeConditions: true,
        includePrecautions: true,
        includeMedicalAttention: true,
        includeLifestyleRecommendations: true,
      };

      const result = await analyzeSymptoms(analysisOptions);
      setAnalysis(result);
    } catch (err) {
      setError(err?.message || "An error occurred while analyzing symptoms");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-gray-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#3b82f620,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_0%_800px,#0ea5e920,transparent)]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-3 group"
              onClick={() => navigate('/')}
            >
              <div className="relative">
                <Brain className="w-8 h-8 text-blue-500 transition-transform duration-300 group-hover:scale-110" />
                <motion.div
                  className="absolute -inset-1 bg-blue-500/20 rounded-full blur"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
               Symptoms Analyzer 
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/80 transition-all duration-300"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Section */}
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center justify-center space-x-4">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="relative"
              >
                <Stethoscope className="w-12 h-12 text-blue-400" />
                <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-lg" />
              </motion.div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Symptom Analyzer
              </h1>
            </div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Describe your symptoms in detail and receive AI-powered analysis to better understand your health concerns.
            </p>
          </motion.div>

          {/* Analysis Form */}
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 shadow-xl overflow-hidden transition-all duration-300 hover:border-gray-700/50"
          >
            <div className="p-6 sm:p-8 space-y-8">
              <form onSubmit={handleAnalyze} className="space-y-6">
                <div className="space-y-4">
                  <label
                    htmlFor="symptoms"
                    className="block text-lg font-medium text-gray-200 flex items-center space-x-2"
                  >
                    <ClipboardList className="w-5 h-5 text-blue-400" />
                    <span>What symptoms are you experiencing?</span>
                  </label>
                  <div className="relative group">
                    <textarea
                      id="symptoms"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      className="w-full h-40 px-4 py-3 bg-black/30 border border-gray-700/50 rounded-xl
                               text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50
                               focus:border-blue-500/50 transition-all duration-300 resize-none
                               group-hover:border-gray-600/50"
                      placeholder="Please describe your symptoms in detail..."
                    />
                    <motion.div
                      animate={{ opacity: symptoms ? 1 : 0.5 }}
                      className="absolute right-3 top-3"
                    >
                      <Brain className="text-gray-600 w-5 h-5" />
                    </motion.div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white
                           rounded-xl font-medium disabled:opacity-50 transition-all duration-300
                           flex items-center justify-center space-x-3 hover:from-blue-500 hover:to-cyan-400
                           shadow-lg shadow-blue-500/20 relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center justify-center space-x-3">
                    {loading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-6 h-6" />
                        <span>Analyze Symptoms</span>
                      </>
                    )}
                  </div>
                </motion.button>
              </form>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl
                             text-red-200 text-center flex items-center justify-center"
                  >
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {analysis && (
                  <motion.div
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-4"
                  >
                    <motion.div
                      className="p-6 bg-black/30 rounded-xl border border-gray-800/50 overflow-hidden"
                      initial={false}
                      animate={{ height: isExpanded ? "auto" : "100px" }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-blue-400 flex items-center">
                          <Brain className="w-6 h-6 mr-2" />
                          Analysis Results
                        </h2>
                        <motion.button
                          onClick={() => setIsExpanded(!isExpanded)}
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors duration-300"
                        >
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </motion.button>
                      </div>
                      <div className={`prose prose-lg max-w-none ${!isExpanded && "line-clamp-2"}`}>
                        <ReactMarkdown>{analysis}</ReactMarkdown>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="text-center"
          >
            <div className="inline-block">
              <p className="text-sm text-gray-400 flex items-center justify-center bg-black/20 rounded-lg px-6 py-4 backdrop-blur-sm border border-gray-800/50">
                <AlertCircle className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0" />
                <span>
                  This AI-powered analysis is for informational purposes only and should not replace
                  professional medical advice. Always consult with a qualified healthcare provider.
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SymptomAnalyzer;