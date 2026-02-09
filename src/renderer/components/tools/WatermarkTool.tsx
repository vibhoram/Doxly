import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { useAppStore } from '@/store';
import { pdfUtils } from '@/utils/pdfUtils';
import toast from 'react-hot-toast';

export default function WatermarkTool() {
  const { getSelectedFiles } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(30);
  const [fontSize, setFontSize] = useState(60);

  const handleWatermark = async () => {
    const selectedFiles = getSelectedFiles();

    if (selectedFiles.length === 0) {
      toast.error('Please select at least 1 PDF file');
      return;
    }

    if (!watermarkText.trim()) {
      toast.error('Please enter watermark text');
      return;
    }

    setIsProcessing(true);

    try {
      for (const file of selectedFiles) {
        const pdfBuffer = await window.electronAPI.file.read(file.path);
        const watermarkedPdf = await pdfUtils.addWatermark(pdfBuffer, watermarkText, {
          opacity: opacity / 100,
          size: fontSize,
          rotation: 45
        });

        const savePath = await window.electronAPI.file.save({
          defaultPath: file.name.replace('.pdf', '_watermarked.pdf'),
          filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
        });

        if (savePath) {
          await window.electronAPI.file.write(savePath, watermarkedPdf);
        }
      }

      toast.success(`Watermarked ${selectedFiles.length} file(s)!`);
    } catch (error) {
      console.error('Watermark error:', error);
      toast.error('Failed to add watermark');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedFiles = getSelectedFiles();

  return (
    <div className="p-6 space-y-4">
      <div>
        <h4 className="font-medium mb-2">Add Watermark</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add text watermark to your PDFs
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium block mb-2">Watermark Text</label>
          <input
            type="text"
            value={watermarkText}
            onChange={(e) => setWatermarkText(e.target.value)}
            placeholder="Enter watermark text"
            className="input"
            maxLength={50}
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <label className="font-medium">Opacity</label>
            <span className="text-primary font-semibold">{opacity}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={10}
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <label className="font-medium">Font Size</label>
            <span className="text-primary font-semibold">{fontSize}px</span>
          </div>
          <input
            type="range"
            min={20}
            max={100}
            step={10}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className="glass p-4 rounded-lg">
        <div className="text-sm font-medium mb-3">Preview</div>
        <div className="bg-white dark:bg-gray-800 aspect-[3/4] rounded-lg flex items-center justify-center relative overflow-hidden">
          <div
            className="absolute text-gray-400 dark:text-gray-600 font-bold select-none"
            style={{
              opacity: opacity / 100,
              fontSize: `${fontSize / 4}px`,
              transform: 'rotate(45deg)'
            }}
          >
            {watermarkText || 'WATERMARK'}
          </div>
          <div className="text-xs text-gray-400">Document Preview</div>
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
          ⚠ Select at least 1 PDF file
        </div>
      )}

      <motion.button
        onClick={handleWatermark}
        disabled={selectedFiles.length === 0 || !watermarkText.trim() || isProcessing}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: selectedFiles.length > 0 && watermarkText.trim() ? 1.02 : 1 }}
        whileTap={{ scale: selectedFiles.length > 0 && watermarkText.trim() ? 0.98 : 1 }}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Adding Watermark...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            <span>Add Watermark & Download</span>
          </div>
        )}
      </motion.button>
    </div>
  );
}
