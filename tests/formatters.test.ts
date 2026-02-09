import { describe, it, expect } from 'vitest';
import { formatFileSize, truncateText } from '../src/renderer/utils/formatters';

describe('Formatters', () => {
  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(1024)).toBe('1.00 KB');
      expect(formatFileSize(1048576)).toBe('1.00 MB');
      expect(formatFileSize(1073741824)).toBe('1.00 GB');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that needs to be truncated';
      expect(truncateText(longText, 10)).toBe('This is a ...');
    });

    it('should not truncate short text', () => {
      const shortText = 'Short';
      expect(truncateText(shortText, 10)).toBe('Short');
    });
  });
});
