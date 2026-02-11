import { useState, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import { 
  Layout, Scissors, Minimize2, RotateCw, 
  FileText, Droplet, Files, Shield, Lock,
  Zap, Download, Github, Globe, Trash, ArrowLeft, ArrowRight, X,
  Image as ImageIcon, Table, Presentation, FileCode, CheckCircle2, ShieldCheck, AlertCircle,
  Layers, ScanLine
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import CompressTool from './components/tools/CompressTool';
import MergeTool from './components/tools/MergeTool';
import SplitTool from './components/tools/SplitTool';
import RotateTool from './components/tools/RotateTool';
import ConvertTool from './components/tools/ConvertTool';
import WatermarkTool from './components/tools/WatermarkTool';
import JpgToPdfTool from './components/tools/JpgToPdfTool';
import OrganizeTool from './components/tools/OrganizeTool';
import OcrTool from './components/tools/OcrTool';
import Logo from './components/Logo';
import Particles from './components/animations/Particles';
import ScrollToTop from './components/ScrollToTop';
import { useAppStore } from './store';
import toast from 'react-hot-toast';
import * as Static from './components/StaticPages';

type ToolType = string | null;

interface Tool {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  category: 'Organize' | 'Optimize' | 'Edit' | 'Convert To PDF' | 'Convert From PDF';
}

const ALL_TOOLS: Tool[] = [
  // Core Tools (All FREE and WORKING)
  { id: 'compress', name: 'Compress PDF', icon: Minimize2, color: '#27ae60', description: 'Reduce size', category: 'Optimize' },
  { id: 'merge', name: 'Merge PDF', icon: Layout, color: '#e74c3c', description: 'Combine multiple PDFs', category: 'Organize' },
  { id: 'split', name: 'Split PDF', icon: Scissors, color: '#e67e22', description: 'Separate pages', category: 'Organize' },
  { id: 'organize', name: 'Organize PDF', icon: Layers, color: '#3498db', description: 'Reorder pages', category: 'Organize' },
  { id: 'rotate', name: 'Rotate PDF', icon: RotateCw, color: '#9b59b6', description: 'Rotate pages', category: 'Edit' },
  { id: 'watermark', name: 'Watermark', icon: Droplet, color: '#8e44ad', description: 'Stamp docs', category: 'Edit' },
  { id: 'ocr', name: 'OCR PDF', icon: ScanLine, color: '#f1c40f', description: 'Recognize text', category: 'Optimize' },
  
  // Convert To PDF (FREE - some need LibreOffice)
  { id: 'jpg-to-pdf', name: 'JPG to PDF', icon: ImageIcon, color: '#f1c40f', description: 'Images to PDF', category: 'Convert To PDF' },
  { id: 'word-to-pdf', name: 'Word to PDF', icon: FileText, color: '#2563eb', description: 'DOCX to PDF', category: 'Convert To PDF' },
  { id: 'ppt-to-pdf', name: 'PowerPoint to PDF', icon: Presentation, color: '#ea580c', description: 'PPTX to PDF', category: 'Convert To PDF' },
  { id: 'excel-to-pdf', name: 'Excel to PDF', icon: Table, color: '#16a34a', description: 'XLSX to PDF', category: 'Convert To PDF' },
  { id: 'html-to-pdf', name: 'HTML to PDF', icon: Globe, color: '#7c3aed', description: 'Web to PDF', category: 'Convert To PDF' },
  
  // Convert From PDF (FREE - some need LibreOffice)
  { id: 'pdf-to-jpg', name: 'PDF to JPG', icon: ImageIcon, color: '#16a34a', description: 'PDF to images', category: 'Convert From PDF' },
  { id: 'pdf-to-word', name: 'PDF to Word', icon: FileText, color: '#2563eb', description: 'PDF to DOCX', category: 'Convert From PDF' },
  { id: 'pdf-to-ppt', name: 'PDF to PowerPoint', icon: Presentation, color: '#ea580c', description: 'PDF to PPTX', category: 'Convert From PDF' },
  { id: 'pdf-to-excel', name: 'PDF to Excel', icon: Table, color: '#16a34a', description: 'PDF to XLSX', category: 'Convert From PDF' },
];

function ToolUnavailable({ name, onClose }: { name: string, onClose: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-500/10 border-2 border-green-500 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
                <Download className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">{name} Setup Required</h3>
            <p className="text-slate-600 font-medium max-w-lg mb-8 leading-relaxed">
                <b>{name}</b> requires <b className="text-green-600">LibreOffice</b> — a free, open-source office suite.
                <br/><br/>
                <span className="text-sm">LibreOffice is 100% FREE and handles Word, Excel, PowerPoint conversions locally on your machine.</span>
            </p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-md mb-8">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Quick Setup (5 minutes)</h4>
                <ol className="text-left text-sm text-slate-700 space-y-3 font-medium">
                    <li className="flex gap-3">
                        <span className="font-black text-primary shrink-0">1.</span>
                        <span>Download <a href="https://www.libreoffice.org/download/download/" target="_blank" rel="noopener noreferrer" className="text-primary underline font-bold">LibreOffice (Free)</a></span>
                    </li>
                    <li className="flex gap-3">
                        <span className="font-black text-primary shrink-0">2.</span>
                        <span>Install it (just like any app)</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="font-black text-primary shrink-0">3.</span>
                        <span>Restart Doxly — conversions will work!</span>
                    </li>
                </ol>
            </div>
            
            <div className="flex gap-4 w-full max-w-md">
                <a 
                  href="https://www.libreoffice.org/download/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 btn btn-primary py-4 text-xs uppercase font-black tracking-widest flex items-center justify-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    Download LibreOffice (Free)
                </a>
                <button 
                   onClick={onClose}
                   className="flex-1 btn btn-primary-ghost py-4 text-xs uppercase font-black tracking-widest"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}

function Home() {
  const [selectedTool, setSelectedTool] = useState<ToolType>(null);
  const { files, removeFile, clearFiles } = useAppStore();
  
  const handleToolClick = (toolId: string) => {
    // Only these tools don't need pre-uploaded files
    const noFileTools = ['jpg-to-pdf', 'html-to-pdf'];
    
    if (files.length === 0 && !noFileTools.includes(toolId)) {
      toast.error('Secure your documents first');
      return;
    }
    setSelectedTool(toolId);
  };

  const currentTool = useMemo(() => 
    ALL_TOOLS.find(t => t.id === selectedTool), 
  [selectedTool]);

  const renderToolContent = () => {
    if (!selectedTool) return null;
    switch (selectedTool) {
      case 'compress': return <CompressTool onClose={() => setSelectedTool(null)} />;
      case 'merge': return <MergeTool onClose={() => setSelectedTool(null)} />;
      case 'split': return <SplitTool onClose={() => setSelectedTool(null)} />;
      case 'rotate': return <RotateTool onClose={() => setSelectedTool(null)} />;
      case 'pdf-to-jpg': return <ConvertTool onClose={() => setSelectedTool(null)} />;
      case 'watermark': return <WatermarkTool onClose={() => setSelectedTool(null)} />;
      case 'jpg-to-pdf': return <JpgToPdfTool onClose={() => setSelectedTool(null)} />;
      case 'organize': return <OrganizeTool onClose={() => setSelectedTool(null)} />;
      case 'ocr': return <OcrTool onClose={() => setSelectedTool(null)} />;
      default: return <ToolUnavailable name={currentTool?.name || 'Unknown'} onClose={() => setSelectedTool(null)} />;
    }
  };

  const categorizedTools = useMemo(() => {
    return {
      'Convert To PDF': ALL_TOOLS.filter(t => t.category === 'Convert To PDF'),
      'Convert From PDF': ALL_TOOLS.filter(t => t.category === 'Convert From PDF'),
      'Standard Tools': ALL_TOOLS.filter(t => !t.category.startsWith('Convert'))
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!selectedTool ? (
        <motion.div 
          key="landing"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="space-y-16 mt-8 mb-24 px-4"
        >
          <div className="text-center max-w-5xl mx-auto space-y-6 px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-500 text-[9px] font-black tracking-[0.2em] uppercase"
            >
              <Shield className="w-3 h-3" /> End-to-End Local Privacy
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight px-4">
              Elite Document <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">Processing Arsenal.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed px-4">
              Precision PDF manipulation with zero cloud dependency. <br/>
              Absolute Privacy. Extreme Speed. Doxly.
            </p>
          </div>

          <div className="content-wrapper shadow-xl relative transition-all duration-500 max-w-6xl mx-auto">
            <div className="max-w-2xl mx-auto mb-12">
              <FileUpload />
            </div>

            {files.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-16 pt-8 border-t border-slate-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                      <Files className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Secure Vault</h3>
                      <div className="text-sm font-bold text-slate-900">{files.length} Protected Item(s)</div>
                    </div>
                  </div>
                  <button onClick={clearFiles} className="btn btn-primary-ghost py-1.5 px-3 text-[10px] uppercase font-black tracking-widest flex items-center gap-2 border border-slate-200">
                    <Trash className="w-3 h-3" /> Purge Workspace
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.map(file => (
                    <motion.div layout key={file.id} className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-lg transition-all">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border shadow-sm shrink-0">
                        {file.thumbnail ? <img src={file.thumbnail} className="w-full h-full object-cover rounded-xl" /> : <FileText className="w-6 h-6 text-slate-300" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold truncate text-slate-800 mb-1">{file.name}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase">{(file.size / 1024).toFixed(0)} KB</div>
                      </div>
                      <button onClick={() => removeFile(file.id)} className="w-9 h-9 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-500 flex items-center justify-center transition-colors shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="border-t border-slate-100 mt-12 pt-12 space-y-16">
              {/* Category Grid - Replicating User Image Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                {/* Convert To PDF */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.25em] border-b pb-3 border-slate-100 flex items-center justify-between">
                    <span>Convert To PDF</span>
                    <Zap className="w-4 h-4" />
                  </h3>
                  <div className="space-y-3">
                    {categorizedTools['Convert To PDF'].map(tool => (
                      <div key={tool.id} onClick={() => handleToolClick(tool.id)} className="flex items-center justify-between group cursor-pointer p-3 hover:bg-slate-50 rounded-2xl transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-2 transition-transform duration-500">
                            <tool.icon className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" strokeWidth={1.5} />
                          </div>
                          <div className="font-black text-xs text-slate-700 tracking-tight group-hover:text-slate-900 group-hover:translate-x-1 transition-all uppercase">{tool.name}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Convert From PDF */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.25em] border-b pb-3 border-slate-100 flex items-center justify-between">
                    <span>Convert From PDF</span>
                    <Files className="w-4 h-4" />
                  </h3>
                  <div className="space-y-3">
                    {categorizedTools['Convert From PDF'].map(tool => (
                      <div key={tool.id} onClick={() => handleToolClick(tool.id)} className="flex items-center justify-between group cursor-pointer p-3 hover:bg-slate-50 rounded-2xl transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-500">
                            <tool.icon className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" strokeWidth={1.5} />
                          </div>
                          <div className="font-black text-xs text-slate-700 tracking-tight group-hover:text-slate-900 group-hover:translate-x-1 transition-all uppercase">{tool.name}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Standard Tools */}
              <div className="space-y-8 text-center border-t border-slate-100 pt-12 pb-8">
                <div>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2 uppercase italic">Core Operation Grid</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Advanced document orchestration modules</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                  {categorizedTools['Standard Tools'].map(tool => (
                    <div key={tool.id} onClick={() => handleToolClick(tool.id)} className="tool-card group">
                      <div className="tool-icon"><tool.icon strokeWidth={2} /></div>
                      <div className="tool-name uppercase tracking-tight text-[11px]">{tool.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key={`tool-${selectedTool}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="max-w-5xl mx-auto mt-12 mb-20"
        >
          <div className="flex items-center justify-between mb-8 px-4">
            <button onClick={() => setSelectedTool(null)} className="btn btn-outline py-2 px-6 flex items-center gap-3 group bg-white">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> 
              <span className="text-xs uppercase font-black tracking-widest text-slate-500 group-hover:text-slate-900 transition-colors">Abort Mission</span>
            </button>
            <div className="text-right">
              <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">{currentTool?.category} Engine</div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">{currentTool?.name}</h2>
            </div>
          </div>
          <div className="content-wrapper min-h-[600px] shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-xl border-white/50">
            {renderToolContent()}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen relative selection:bg-primary selection:text-white flex flex-col bg-slate-50/50">
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <Particles 
          particleColors={['#6366f1', '#4f46e5', '#94a3b8']}
          particleCount={120}
          speed={0.15}
        />
      </div>

      <header className="header border-transparent bg-white/40 border-b border-slate-100 shadow-sm">
        <div className="container flex items-center justify-between py-1">
          <Link to="/" className="flex items-center gap-4 transition-transform hover:scale-105 active:scale-95 group">
            <Logo className="w-12 h-12" />
            <span className="logo italic tracking-tighter text-3xl font-black uppercase text-slate-900">DOXLY</span>
          </Link>
          <nav className="flex items-center gap-10">
            <Link to="/enterprise" className="nav-link uppercase text-[10px] font-black tracking-widest">Enterprise</Link>
            <Link to="/pricing" className="nav-link uppercase text-[10px] font-black tracking-widest">Pricing</Link>
            <Link to="/security" className="nav-link uppercase text-[10px] font-black tracking-widest">Security Sub-manifesto</Link>
            <div className="w-px h-4 bg-slate-200"></div>
            <Link to="/api" className="btn btn-primary-ghost py-2.5 px-6 text-[10px] uppercase font-black tracking-widest bg-white border border-slate-100 shadow-sm hover:border-primary transition-all">SDK API</Link>
          </nav>
        </div>
      </header>

      <main className="container flex-1 relative z-10">
        <ScrollToTop />
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Static.About />} />
          <Route path="/security" element={<Static.Security />} />
          <Route path="/enterprise" element={<Static.Enterprise />} />
          <Route path="/pricing" element={<Static.Pricing />} />
          <Route path="/api" element={<Static.API />} />
          <Route path="/contact" element={<Static.Contact />} />
          <Route path="/terms" element={<Static.Terms />} />
          <Route path="/privacy" element={<Static.Privacy />} />
          <Route path="/cookie-policy" element={<Static.CookiePolicy />} />
        </Routes>
      </main>

      <footer className="footer-bg pt-32 pb-16 mt-32 relative z-10 bg-white border-t border-slate-100 shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">
            <div className="col-span-2 space-y-8">
              <div className="flex items-center gap-4 grayscale group hover:grayscale-0 transition-all cursor-crosshair">
                <Logo className="w-9 h-9" />
                <span className="font-black italic text-2xl tracking-tighter text-slate-900 uppercase">DOXLY STUDIO</span>
              </div>
              <p className="text-sm font-medium text-slate-500 max-w-sm leading-relaxed">
                The local-first document security engine. Engineered for maximum reliability and absolute privacy. Every byte stays on your silicon.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Product Vault</h4>
              <Link to="/pricing" className="block text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-3">Pricing Strategy</Link>
              <Link to="/security" className="block text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-3">Security Sub-manifesto</Link>
              <Link to="/api" className="block text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-3">SDK Integration</Link>
              <Link to="/enterprise" className="block text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-3">Enterprise Subsystem</Link>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Doxly Protocol</h4>
              <Link to="/about" className="block text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-3">About the Mission</Link>
              <Link to="/contact" className="block text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-3">Support Node</Link>
              <Link to="/privacy" className="block text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-3">Privacy Protocol</Link>
              <Link to="/terms" className="block text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-3">Terms of Engagement</Link>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 pt-12 border-t border-slate-100">
            <div className="flex items-center gap-6">
                 <p className="text-xs font-black uppercase tracking-widest text-slate-400">© 2026 DOXLY STUDIO</p>
                 <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                 <p className="text-sm font-bold tracking-wide text-slate-600">All bytes processed locally in volatile memory</p>
                 <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                 <p className="text-sm font-medium text-slate-500">Made with <span className="text-red-500 inline-block animate-pulse">❤️</span> by <span className="font-bold text-slate-700">Vibhor</span></p>
            </div>
            <div className="flex gap-8">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-slate-900 transition-all hover:scale-125"><Github className="w-5 h-5" /></a>
              <a href="https://nexailabs.tech" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-slate-900 transition-all hover:scale-125"><Globe className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>

      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#fff',
            borderRadius: '16px',
            fontSize: '11px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '16px 24px',
            boxShadow: '0 12px 24px -10px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }}
      />
    </div>
  );
}

export default App;
