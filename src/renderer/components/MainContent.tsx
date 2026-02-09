import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';
import FileUploader from './FileUploader';
import FileList from './FileList';
import ToolPanel from './ToolPanel';

export default function MainContent() {
  const { files, activeTool } = useAppStore();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {files.length === 0 ? (
          <motion.div
            key="uploader"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            <FileUploader />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex overflow-hidden"
          >
            <div className="flex-1 overflow-auto scrollbar-thin p-6">
              <FileList />
            </div>

            {activeTool && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-80 border-l border-light-border dark:border-dark-border overflow-auto scrollbar-thin"
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
