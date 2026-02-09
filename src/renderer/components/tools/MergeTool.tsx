import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { useAppStore } from '@/store';
import { pdfUtils } from '@/utils/pdfUtils';
import toast from 'react-hot-toast';

export default function MergeTool() {
  const { getSelectedFiles } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMerge = async () => {
    const selectedFiles = getSelectedFiles();

    if (selectedFiles.length < 2) {
      toast.error('Please select at least 2 PDF files to merge');
      return;
    }

    setIsProcessing(true);

    try {
      // Read all selected PDF files
      const pdfBuffers = await Promise.all(
        selectedFiles.map((file) => window.electronAPI.file.read(file.path))
      );

      // Merge PDFs
      const mergedPdf = await pdfUtils.mergePDFs(pdfBuffers);

      // Save merged PDF
      const savePath = await window.electronAPI.file.save({
        defaultPath: 'merged.pdf',
        filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
      });

      if (savePath) {
        await window.electronAPI.file.write(savePath, mergedPdf);
        toast.success('PDFs merged successfully!');
        window.electronAPI.file.openInExplorer(savePath);
      }
    } catch (error) {
      console.error('Merge error:', error);
      toast.error('Failed to merge PDFs');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedFiles = getSelectedFiles();

  return (
    <div className="p-6 space-y-4">
      <div>
        <h4 className="font-medium mb-2">Merge PDFs</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Combine multiple PDF files into a single document
        </p>
      </div>

      <div className="glass p-4 rounded-lg space-y-2">
        <div className="text-sm font-medium">Selected Files ({selectedFiles.length})</div>
        <div className="space-y-1 max-h-48 overflow-auto scrollbar-thin">
          {selectedFiles.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="text-xs p-2 bg-white/5 rounded truncate"
              title={file.name}
            >
              {index + 1}. {file.name}
            </motion.div>
          ))}
        </div>
      </div>

      {selectedFiles.length < 2 && (
        <div className="text-sm text-yellow-600 dark:text-yellow-400 p-3 bg-yellow-500/10 rounded-lg">
          ⚠ Select at least 2 PDF files to merge
        </div>
      )}

      <motion.button
        onClick={handleMerge}
        disabled={selectedFiles.length < 2 || isProcessing}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: selectedFiles.length >= 2 ? 1.02 : 1 }}
        whileTap={{ scale: selectedFiles.length >= 2 ? 0.98 : 1 }}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Merging...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            <span>Merge & Download</span>
          </div>
        )}
      </motion.button>

      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <div>• Files will be merged in the order shown</div>
        <div>• All pages from each file will be included</div>
        <div>• You can drag files to reorder them</div>
      </div>
    </div>
  );
}
