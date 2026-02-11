import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Check, Settings, Shield } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show after a small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto glass border border-light-border dark:border-dark-border rounded-2xl shadow-2xl overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full hidden sm:block">
                  <Cookie className="w-8 h-8 text-primary" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Cookie className="w-6 h-6 text-primary sm:hidden" />
                    We value your privacy
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                    By clicking "Accept All", you consent to our use of cookies.
                  </p>

                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mb-6 space-y-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="font-semibold">Essential</span>
                        </div>
                        <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">Always Active</span>
                      </div>
                      <p className="text-xs text-gray-500">Necessary for the website to function properly.</p>
                      
                      <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="font-semibold">Analytics</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">Help us understand how you use our website.</p>
                    </motion.div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAccept}
                      className="btn-primary px-6 py-2.5 rounded-lg flex-1 sm:flex-none justify-center font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                    >
                      Accept All
                    </button>
                    <button
                      onClick={handleReject}
                      className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-1 sm:flex-none justify-center font-medium"
                    >
                      Reject All
                    </button>
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="px-6 py-2.5 rounded-lg text-primary hover:bg-primary/5 transition-colors flex-1 sm:flex-none justify-center font-medium flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      {showDetails ? 'Hide Preferences' : 'Customize'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
