import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Merge, Split, Trash2, FileOutput, LayoutGrid, Scan, 
  Zap, Wrench, Languages, 
  FileImage, FileType, FileSpreadsheet, Globe,
  Type, Hash, Stamp, Crop, Edit3,
  Unlock, Lock, PenTool, Eraser, Columns,
  ChevronRight, Search, Star, Rocket, ShieldCheck, Compass
} from 'lucide-react';
import { useAppStore } from '@/store';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  isPopular?: boolean;
  tag?: string;
}

interface Category {
  id: string;
  name: string;
  tools: Tool[];
  icon: any;
}

const categories: Category[] = [
  {
    id: 'favs',
    name: 'The Vanguard Power-Core',
    icon: Rocket,
    tools: [
      { id: 'merge', name: 'Merge PDF', description: 'Combine multiple PDFs into one document.', icon: Merge, color: 'text-orange-500', isPopular: true, tag: 'Most Used' },
      { id: 'split', name: 'Split PDF', description: 'Extract pages or split into separate files.', icon: Split, color: 'text-blue-500', isPopular: true, tag: 'Fast' },
      { id: 'compress', name: 'Compress PDF', description: 'Reduce file size while keeping quality.', icon: Zap, color: 'text-green-500', isPopular: true, tag: 'Optimized' },
      { id: 'word-to-pdf', name: 'Word to PDF', description: 'Convert DOCX files to clean PDFs.', icon: FileType, color: 'text-blue-600', isPopular: true, tag: 'Popular' },
    ]
  },
  {
    id: 'edit',
    name: 'Precision Forge',
    icon: Wrench,
    tools: [
      { id: 'edit-text', name: 'Edit PDF', description: 'Add or modify text in your document.', icon: Type, color: 'text-purple-400' },
      { id: 'rotate', name: 'Rotate PDF', description: 'Rotate pages to correct orientation.', icon: Edit3, color: 'text-purple-500' },
      { id: 'page-numbers', name: 'Add Page Numbers', description: 'Insert page numbers with custom styles.', icon: Hash, color: 'text-purple-400' },
      { id: 'watermark', name: 'Add Watermark', description: 'Stamp images or text over your PDF.', icon: Stamp, color: 'text-purple-600' },
      { id: 'crop', name: 'Crop PDF', description: 'Trim page margins or specific areas.', icon: Crop, color: 'text-purple-500' },
    ]
  },
  {
    id: 'security',
    name: 'Sentinel Fortress',
    icon: ShieldCheck,
    tools: [
      { id: 'unlock', name: 'Unlock PDF', description: 'Remove passwords and restrictions.', icon: Unlock, color: 'text-blue-600' },
      { id: 'protect', name: 'Protect PDF', description: 'Encrypt your PDF with a password.', icon: Lock, color: 'text-blue-500' },
      { id: 'sign', name: 'Sign PDF', description: 'Add your signature to any document.', icon: PenTool, color: 'text-blue-700' },
      { id: 'redact', name: 'Redact PDF', description: 'Permanently hide sensitive info.', icon: Eraser, color: 'text-gray-600' },
      { id: 'compare', name: 'Compare PDF', description: 'Find differences between two versions.', icon: Columns, color: 'text-blue-400' },
    ]
  },
  {
    id: 'everything',
    name: 'The Lab discovery',
    icon: Compass,
    tools: [
      { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert images to PDF documents.', icon: FileImage, color: 'text-yellow-500' },
      { id: 'excel-to-pdf', name: 'Excel to PDF', description: 'Convert spreadsheets to PDF tables.', icon: FileSpreadsheet, color: 'text-green-600' },
      { id: 'html-to-pdf', name: 'HTML to PDF', description: 'Convert web pages to PDF docs.', icon: Globe, color: 'text-blue-400' },
      { id: 'remove', name: 'Remove Pages', description: 'Delete unwanted pages from your PDF.', icon: Trash2, color: 'text-red-500' },
      { id: 'extract', name: 'Extract Pages', description: 'Get specific pages as a new PDF.', icon: FileOutput, color: 'text-orange-600' },
      { id: 'organize-tool', name: 'Organize PDF', description: 'Reorder, rotate, or delete pages.', icon: LayoutGrid, color: 'text-orange-500' },
      { id: 'scan', name: 'Scan to PDF', description: 'Convert paper docs into high-quality PDFs.', icon: Scan, color: 'text-orange-400' },
    ]
  }
];

export default function ToolsGrid() {
  const { setActiveTool } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.map(cat => ({
    ...cat,
    tools: cat.tools.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.tools.length > 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-24 space-y-32">
      {/* Dynamic Search Header */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex flex-col md:flex-row items-center justify-between gap-10"
      >
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-5xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">
            Elite <span className="text-primary italic">NexForge</span> Ecosystem
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl">
            Hyper-organized tools for hyper-efficient document management.
          </p>
        </div>
        
        <div className="relative w-full md:w-[450px] group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-primary transition-colors duration-500" />
          <input 
            type="text"
            placeholder="Search for an elite tool..."
            className="w-full pl-14 pr-6 py-5 bg-white dark:bg-gray-900/40 backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-[2rem] focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all outline-none shadow-2xl font-bold text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Strategic Grid Sections */}
      <div className="space-y-32">
        {filteredCategories.map((category, catIdx) => (
          <div key={category.id} className="space-y-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="p-3 bg-primary/10 rounded-2xl shadow-inner">
                  <category.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-gray-100 uppercase tracking-[0.25em] italic">
                  {category.name}
                </h3>
              </div>
              <div className="hidden lg:block h-[1px] flex-1 bg-gradient-to-r from-primary/20 to-transparent ml-12" />
            </div>
            
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10`}>
              {category.tools.map((tool, idx) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  whileHover={{ 
                    y: -15,
                    scale: 1.03,
                    rotate: tool.isPopular ? 1 : 0
                  }}
                  onClick={() => setActiveTool(tool.id)}
                  className={`
                    group p-10 bg-white dark:bg-gray-900/60 backdrop-blur-3xl rounded-[3rem] border transition-all cursor-pointer relative overflow-hidden
                    ${tool.isPopular 
                      ? 'border-primary/40 ring-1 ring-primary/20 shadow-[-20px_20px_60px_-15px_rgba(82,39,255,0.1)] min-h-[300px]' 
                      : 'border-gray-200 dark:border-white/5 hover:border-primary/40'
                    }
                  `}
                >
                  {tool.tag && (
                    <div className="absolute top-8 right-8 px-4 py-1.5 bg-primary rounded-full shadow-lg shadow-primary/20">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">{tool.tag}</span>
                    </div>
                  )}

                  <div className={`w-20 h-20 rounded-[2rem] bg-gray-50 dark:bg-white/[0.03] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary transition-all duration-700`}>
                    <tool.icon className={`w-10 h-10 ${tool.color} group-hover:text-white transition-all duration-700`} strokeWidth={2.5} />
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-2xl font-black text-gray-900 dark:text-white flex items-center justify-between leading-none">
                      {tool.name}
                      <Star className={`w-5 h-5 ${tool.isPopular ? 'text-primary fill-primary' : 'opacity-0'} transition-all`} />
                    </h4>
                    <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                      {tool.description}
                    </p>
                  </div>
                  
                  {/* Glass Interactive Decor */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
