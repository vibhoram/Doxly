import { motion } from 'framer-motion';
import { Trash2, ExternalLink, FileText, Check } from 'lucide-react';
import { useAppStore } from '@/store';
import { formatFileSize } from '@/utils/formatters';

export default function FileList() {
  const { files, removeFile, toggleFileSelection, clearFiles, selectAll, clearSelection } = useAppStore();
  const selectedCount = files.filter((f) => f.selected).length;

  const handleOpenInExplorer = (path: string) => {
    window.electronAPI.file.openInExplorer(path);
  };

  return (
    <div className="max-w-app mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Files</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {files.length} file(s) • {selectedCount} selected
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedCount > 0 ? (
            <button onClick={clearSelection} className="btn-secondary text-sm">
              Clear Selection
            </button>
          ) : (
            <button onClick={selectAll} className="btn-secondary text-sm">
              Select All
            </button>
          )}
          <button onClick={clearFiles} className="btn-secondary text-sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file, index) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              card relative overflow-hidden cursor-pointer
              ${file.selected ? 'ring-2 ring-primary' : ''}
            `}
            onClick={() => toggleFileSelection(file.id)}
            whileHover={{ scale: 1.02 }}
          >
            {/* Thumbnail */}
            {file.thumbnail ? (
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
                <img
                  src={file.thumbnail}
                  alt={file.name}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-success/20 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-16 h-16 text-gray-400" />
              </div>
            )}

            {/* Selection indicator */}
            {file.selected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center"
              >
                <Check className="w-5 h-5 text-white" />
              </motion.div>
            )}

            {/* File info */}
            <div>
              <h3 className="font-medium text-sm truncate mb-2" title={file.name}>
                {file.name}
              </h3>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{formatFileSize(file.size)}</span>
                {file.pages && <span>{file.pages} pages</span>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenInExplorer(file.path);
                }}
                className="flex-1 btn-secondary text-xs py-2"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Open
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file.id);
                }}
                className="btn-secondary text-xs py-2 px-3 text-red-500"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
