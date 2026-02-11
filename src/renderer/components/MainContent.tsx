import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';
import FileUploader from './FileUploader';
import FileList from './FileList';
import ToolPanel from './ToolPanel';
import ToolsGrid from './ToolsGrid';

export default function MainContent() {
  const { files, activeTool } = useAppStore();

  return (
    <div className={`flex-1 flex flex-col ${files.length > 0 ? 'overflow-hidden' : 'overflow-auto'}`}>
      <AnimatePresence mode="wait">
        {files.length === 0 ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col w-full"
          >
            {/* Hero Section with Parallax-like Reveal */}
            <section className="min-h-[85vh] flex flex-col items-center justify-center py-20 relative overflow-hidden">
              {/* Premium Background Glows */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[150px] rounded-full pointer-events-none -z-10 animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

              <div className="max-w-4xl w-full px-6 text-center space-y-10 mb-16">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-widest uppercase mb-6 border border-primary/20 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    Ultra Secure Offline Processing
                  </span>
                  
                  <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-b from-gray-900 via-gray-800 to-gray-500 dark:from-white dark:via-gray-100 dark:to-gray-500 bg-clip-text text-transparent leading-[1.1] tracking-tight filter drop-shadow-sm pb-2">
                    NexForge <span className="text-primary italic">Elite</span> <br /> PDF Suite.
                  </h1>
                </motion.div>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-2xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed"
                >
                  Process massive documents with zero data transfer. 
                  Experience the fastest, most private toolkit directly on your hardware.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                <FileUploader />
              </motion.div>
            </section>

            {/* Feature Grid Section with Premium Reveal */}
            <section className="bg-gray-50/30 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/[0.05] relative">
              <ToolsGrid />
              
              {/* Bottom Decorative Element */}
              <div className="py-20 flex justify-center">
                <div className="w-1 h-20 bg-gradient-to-b from-primary/50 to-transparent rounded-full" />
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="workspace"
            initial={{ opacity: 0, scale: 0.995 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.995 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="flex-1 flex overflow-hidden"
          >
            <div className="flex-1 overflow-auto scrollbar-thin p-8 bg-gray-50 dark:bg-black/20">
              <FileList />
            </div>

            {activeTool && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 200 }}
                className="w-[400px] border-l border-gray-200 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-3xl overflow-auto scrollbar-thin shadow-2xl"
              >
                <ToolPanel />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
