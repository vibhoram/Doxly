import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, RotateCw } from 'lucide-react';
import { useAppStore } from '@/store';
import { pdfUtils } from '@/utils/pdfUtils';
import toast from 'react-hot-toast';

export default function RotateTool() {
  const { getSelectedFiles } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [rotation, setRotation] = useState<90 | 180 | 270>(90);

  const handleRotate = async () => {
    const selectedFiles = getSelectedFiles();

    if (selectedFiles.length === 0) {
      toast.error('Please select at least 1 PDF file to rotate');
      return;
    }

    setIsProcessing(true);

    try {
      for (const file of selectedFiles) {
        const pdfBuffer = await window.electronAPI.file.read(file.path);
        const rotatedPdf = await pdfUtils.rotatePDF(pdfBuffer, rotation);

        const savePath = await window.electronAPI.file.save({
          defaultPath: file.name.replace('.pdf', `_rotated_${rotation}.pdf`),
          filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
        });

        if (savePath) {
          await window.electronAPI.file.write(savePath, rotatedPdf);
        }
      }

      toast.success(`Rotated ${selectedFiles.length} file(s)!`);
    } catch (error) {
      console.error('Rotate error:', error);
      toast.error('Failed to rotate PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedFiles = getSelectedFiles();

  return (
    <div className="p-6 space-y-4">
      <div>
        <h4 className="font-medium mb-2">Rotate PDF</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Rotate all pages in the selected PDFs
        </p>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-medium">Rotation Angle</div>
        
        <div className="grid grid-cols-3 gap-2">
          {[90, 180, 270].map((angle) => (
            <button
              key={angle}
              onClick={() => setRotation(angle as 90 | 180 | 270)}
              className={`
                p-4 rounded-lg flex flex-col items-center gap-2
                transition-all
                ${rotation === angle ? 'glass-strong ring-2 ring-primary' : 'glass hover:glass-strong'}
              `}
            >
              <RotateCw
                className="w-6 h-6"
                style={{ transform: `rotate(${angle}deg)` }}
              />
              <span className="text-xs font-medium">{angle}°</span>
            </button>
          ))}
        </div>
      </div>

      <div className="glass p-4 rounded-lg">
        <div className="text-sm font-medium mb-2">
          Selected Files ({selectedFiles.length})
        </div>
        {selectedFiles.length === 0 ? (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            No files selected
          </div>
        ) : (
          <div className="space-y-1 max-h-32 overflow-auto scrollbar-thin">
            {selectedFiles.map((file) => (
              <div key={file.id} className="text-xs truncate" title={file.name}>
                {file.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedFiles.length === 0 && (
        <div className="text-sm text-yellow-600 dark:text-yellow-400 p-3 bg-yellow-500/10 rounded-lg">
          ⚠ Select at least 1 PDF file to rotate
        </div>
      )}

      <motion.button
        onClick={handleRotate}
        disabled={selectedFiles.length === 0 || isProcessing}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: selectedFiles.length > 0 ? 1.02 : 1 }}
        whileTap={{ scale: selectedFiles.length > 0 ? 0.98 : 1 }}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Rotating...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            <span>Rotate & Download</span>
          </div>
        )}
      </motion.button>
    </div>
  );
}
