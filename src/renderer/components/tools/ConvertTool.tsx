import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import { useAppStore } from '@/store';
import toast from 'react-hot-toast';

export default function ConvertTool() {
  const { getSelectedFiles } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertTo, setConvertTo] = useState<'pdf' | 'docx' | 'xlsx' | 'pptx'>('pdf');

  const handleConvert = async () => {
    const selectedFiles = getSelectedFiles();

    if (selectedFiles.length === 0) {
      toast.error('Please select at least 1 file to convert');
      return;
    }

    setIsProcessing(true);

    try {
      for (const file of selectedFiles) {
        const ext = file.name.split('.').pop()?.toLowerCase();

        // Determine conversion direction
        if (ext === 'pdf' && convertTo !== 'pdf') {
          // PDF to Office
          const outputExt = convertTo;
          const savePath = await window.electronAPI.file.save({
            defaultPath: file.name.replace('.pdf', `.${outputExt}`),
            filters: [{ name: 'Office Files', extensions: [outputExt] }]
          });

          if (savePath) {
            await window.electronAPI.convert.pdfToOffice(file.path, savePath, outputExt);
          }
        } else if (['docx', 'xlsx', 'pptx'].includes(ext || '') && convertTo === 'pdf') {
          // Office to PDF
          const savePath = await window.electronAPI.file.save({
            defaultPath: file.name.replace(`.${ext}`, '.pdf'),
            filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
          });

          if (savePath) {
            await window.electronAPI.convert.officeToPdf(file.path, savePath);
          }
        } else {
          toast.error(`Cannot convert ${ext} to ${convertTo}`);
          continue;
        }
      }

      toast.success(`Converted ${selectedFiles.length} file(s)!`);
    } catch (error: any) {
      console.error('Convert error:', error);
      toast.error(error?.message || 'Failed to convert files');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedFiles = getSelectedFiles();

  return (
    <div className="p-6 space-y-4">
      <div>
        <h4 className="font-medium mb-2">Convert Files</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Convert between PDF and Office formats
        </p>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-medium">Convert To</div>
        
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'pdf', label: 'PDF' },
            { value: 'docx', label: 'Word' },
            { value: 'xlsx', label: 'Excel' },
            { value: 'pptx', label: 'PowerPoint' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setConvertTo(option.value as any)}
              className={`
                p-3 rounded-lg flex flex-col items-center gap-2
                transition-all text-sm
                ${convertTo === option.value ? 'glass-strong ring-2 ring-primary' : 'glass hover:glass-strong'}
              `}
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">{option.label}</span>
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

      <div className="glass p-4 rounded-lg">
        <div className="text-sm font-medium mb-2">Requirements</div>
        <div className="text-xs space-y-1 text-gray-500 dark:text-gray-400">
          <div>• LibreOffice must be installed</div>
          <div>• Supports PDF ↔ DOCX/XLSX/PPTX</div>
          <div>• Batch conversion supported</div>
        </div>
      </div>

      {selectedFiles.length === 0 && (
        <div className="text-sm text-yellow-600 dark:text-yellow-400 p-3 bg-yellow-500/10 rounded-lg">
          ⚠ Select at least 1 file to convert
        </div>
      )}

      <motion.button
        onClick={handleConvert}
        disabled={selectedFiles.length === 0 || isProcessing}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: selectedFiles.length > 0 ? 1.02 : 1 }}
        whileTap={{ scale: selectedFiles.length > 0 ? 0.98 : 1 }}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Converting...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            <span>Convert & Download</span>
          </div>
        )}
      </motion.button>
    </div>
  );
}
