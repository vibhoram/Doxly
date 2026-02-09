import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { useAppStore } from '@/store';
import { pdfUtils } from '@/utils/pdfUtils';
import toast from 'react-hot-toast';

export default function CompressTool() {
  const { getSelectedFiles } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState(70);

  const handleCompress = async () => {
    const selectedFiles = getSelectedFiles();

    if (selectedFiles.length === 0) {
      toast.error('Please select at least 1 PDF file to compress');
      return;
    }

    setIsProcessing(true);

    try {
      for (const file of selectedFiles) {
        const pdfBuffer = await window.electronAPI.file.read(file.path);
        const compressedPdf = await pdfUtils.compressPDF(pdfBuffer, quality / 100);

        const savePath = await window.electronAPI.file.save({
          defaultPath: file.name.replace('.pdf', '_compressed.pdf'),
          filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
        });

        if (savePath) {
          await window.electronAPI.file.write(savePath, compressedPdf);
        }
      }

      toast.success(`Compressed ${selectedFiles.length} file(s)!`);
    } catch (error) {
      console.error('Compress error:', error);
      toast.error('Failed to compress PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedFiles = getSelectedFiles();

  return (
    <div className="p-6 space-y-4">
      <div>
        <h4 className="font-medium mb-2">Compress PDF</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Reduce file size while maintaining quality
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Quality</span>
          <span className="text-primary font-semibold">{quality}%</span>
        </div>
        
        <input
          type="range"
          min={10}
          max={100}
          step={10}
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${quality}%, #d1d5db ${quality}%, #d1d5db 100%)`
          }}
        />

        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Smaller</span>
          <span>Larger</span>
        </div>
      </div>

      <div className="glass p-4 rounded-lg space-y-2">
        <div className="text-sm font-medium">Compression Info</div>
        <div className="text-xs space-y-1 text-gray-500 dark:text-gray-400">
          <div>• Higher quality = larger file size</div>
          <div>• Lower quality = smaller file size</div>
          <div>• Recommended: 70% for balanced results</div>
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
          ⚠ Select at least 1 PDF file to compress
        </div>
      )}

      <motion.button
        onClick={handleCompress}
        disabled={selectedFiles.length === 0 || isProcessing}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: selectedFiles.length > 0 ? 1.02 : 1 }}
        whileTap={{ scale: selectedFiles.length > 0 ? 0.98 : 1 }}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Compressing...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            <span>Compress & Download</span>
          </div>
        )}
      </motion.button>
    </div>
  );
}
