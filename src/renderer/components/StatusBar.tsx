import { useAppStore } from '@/store';
import { formatFileSize } from '@/utils/formatters';

export default function StatusBar() {
  const { files, operations } = useAppStore();

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const activeOperations = operations.filter((op) => op.status === 'processing');

  return (
    <div className="h-8 flex items-center justify-between px-4 glass border-t border-light-border dark:border-dark-border text-xs">
      <div className="flex items-center gap-4">
        <span className="text-gray-500 dark:text-gray-400">
          {files.length} file(s)
        </span>
        {totalSize > 0 && (
          <>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span className="text-gray-500 dark:text-gray-400">
              Total: {formatFileSize(totalSize)}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {activeOperations.length > 0 && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-primary">
                Processing {activeOperations.length} operation(s)
              </span>
            </div>
          </>
        )}
        <span className="text-gray-500 dark:text-gray-400">
          PDF ProForge v1.0.0
        </span>
      </div>
    </div>
  );
}
