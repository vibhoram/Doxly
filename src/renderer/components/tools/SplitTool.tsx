import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { useAppStore } from '@/store';
import { pdfUtils } from '@/utils/pdfUtils';
import toast from 'react-hot-toast';

export default function SplitTool() {
  const { getSelectedFiles } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [splitMode, setSplitMode] = useState<'all' | 'range' | 'custom'>('all');
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(1);

  const handleSplit = async () => {
    const selectedFiles = getSelectedFiles();

    if (selectedFiles.length !== 1) {
      toast.error('Please select exactly 1 PDF file to split');
      return;
    }

    setIsProcessing(true);

    try {
      const file = selectedFiles[0];
      const pdfBuffer = await window.electronAPI.file.read(file.path);
      const pageCount = await pdfUtils.getPageCount(pdfBuffer);

      let ranges: { start: number; end: number }[] = [];

      if (splitMode === 'all') {
        // Split into individual pages
        ranges = Array.from({ length: pageCount }, (_, i) => ({
          start: i,
          end: i
        }));
      } else if (splitMode === 'range') {
        ranges = [{ start: rangeStart - 1, end: rangeEnd - 1 }];
      }

      const splitPdfs = await pdfUtils.splitPDF(pdfBuffer, ranges);

      // Save all split PDFs
      const baseName = file.name.replace('.pdf', '');
      
      for (let i = 0; i < splitPdfs.length; i++) {
        const savePath = await window.electronAPI.file.save({
          defaultPath: `${baseName}_page_${i + 1}.pdf`,
          filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
        });

        if (savePath) {
          await window.electronAPI.file.write(savePath, splitPdfs[i]);
        }
      }

      toast.success(`PDF split into ${splitPdfs.length} file(s)!`);
    } catch (error) {
      console.error('Split error:', error);
      toast.error('Failed to split PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedFiles = getSelectedFiles();
  const selectedFile = selectedFiles[0];

  return (
    <div className="p-6 space-y-4">
      <div>
        <h4 className="font-medium mb-2">Split PDF</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Extract pages from a PDF document
        </p>
      </div>

      {selectedFile && (
        <div className="glass p-4 rounded-lg">
          <div className="text-sm font-medium mb-2">Selected File</div>
          <div className="text-xs truncate" title={selectedFile.name}>
            {selectedFile.name}
          </div>
          {selectedFile.pages && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {selectedFile.pages} pages
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        <div className="text-sm font-medium">Split Mode</div>
        
        <label className="flex items-center gap-3 p-3 glass rounded-lg cursor-pointer hover:glass-strong">
          <input
            type="radio"
            name="splitMode"
            checked={splitMode === 'all'}
            onChange={() => setSplitMode('all')}
            className="w-4 h-4"
          />
          <div>
            <div className="text-sm font-medium">All Pages</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Extract each page as a separate PDF
            </div>
          </div>
        </label>

        <label className="flex items-center gap-3 p-3 glass rounded-lg cursor-pointer hover:glass-strong">
          <input
            type="radio"
            name="splitMode"
            checked={splitMode === 'range'}
            onChange={() => setSplitMode('range')}
            className="w-4 h-4"
          />
          <div className="flex-1">
            <div className="text-sm font-medium mb-2">Page Range</div>
            {splitMode === 'range' && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={selectedFile?.pages || 1}
                  value={rangeStart}
                  onChange={(e) => setRangeStart(Number(e.target.value))}
                  className="input text-sm py-1"
                  placeholder="Start"
                />
                <span className="text-sm">to</span>
                <input
                  type="number"
                  min={rangeStart}
                  max={selectedFile?.pages || 1}
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(Number(e.target.value))}
                  className="input text-sm py-1"
                  placeholder="End"
                />
              </div>
            )}
          </div>
        </label>
      </div>

      {selectedFiles.length !== 1 && (
        <div className="text-sm text-yellow-600 dark:text-yellow-400 p-3 bg-yellow-500/10 rounded-lg">
          ⚠ Select exactly 1 PDF file to split
        </div>
      )}

      <motion.button
        onClick={handleSplit}
        disabled={selectedFiles.length !== 1 || isProcessing}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: selectedFiles.length === 1 ? 1.02 : 1 }}
        whileTap={{ scale: selectedFiles.length === 1 ? 0.98 : 1 }}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Splitting...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            <span>Split & Download</span>
          </div>
        )}
      </motion.button>
    </div>
  );
}
