import React from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, Lock, FileText, Zap, Layout, Globe, Users, CreditCard, Code, Server, ArrowRight, Cookie, Scale, Eye, Database, AlertCircle, Mail, Building2, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const PageWrapper: React.FC<{ children: React.ReactNode; title: string; subtitle?: string }> = ({ children, title, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    className="max-w-5xl mx-auto px-6 py-20"
  >
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
          <Zap className="w-4 h-4 text-primary" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Doxly Intelligence</span>
      </div>
      <h1 className="text-6xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
    <div className="space-y-12">
      {children}
    </div>
  </motion.div>
);

export const About = () => (
  <PageWrapper 
    title="The Doxly Philosophy" 
    subtitle="Engineered to solve the critical privacy gap in modern document processing."
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="content-wrapper">
        <h3 className="text-xl font-bold mb-4">The Local-First Vision</h3>
        <p className="text-slate-500 leading-relaxed">
          Most "free" PDF tools today are just data collection traps. They upload your sensitive contracts, medical records, and legal files to the cloud. Doxly bypasses traditional cloud bottlenecks by utilizing local machine power via WebAssembly.
        </p>
      </div>
      <div className="content-wrapper">
        <h3 className="text-xl font-bold mb-4">Zero-Transfer Policy</h3>
        <p className="text-slate-500 leading-relaxed">
          Your files never touch a server. Your data stays on your silicon. That's the Doxly guarantee. We've built an arsenal of tools that respect your privacy without compromising on speed.
        </p>
      </div>
    </div>
  </PageWrapper>
);

export const Security = () => (
  <PageWrapper 
    title="Ironclad Security" 
    subtitle="How Doxly keeps your most sensitive data inside the vault."
  >
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { icon: Lock, title: 'Local Encryption', desc: 'Secure local memory processing for every operation.' },
        { icon: Shield, title: 'No Cloud Sync', desc: 'Zero data leaves your machine. Ever.' },
        { icon: globe = Globe, title: 'Offline-First', desc: 'Works 100% without an internet connection.' }
      ].map((item, i) => (
        <div key={i} className="content-wrapper text-center">
          <item.icon className="w-10 h-10 text-primary mx-auto mb-6" />
          <h4 className="font-bold mb-2">{item.title}</h4>
          <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
        </div>
      ))}
    </div>
    <div className="content-wrapper bg-slate-900 text-white">
      <h3 className="text-2xl font-bold mb-6 italic">Protocol 01: Data Redaction</h3>
      <p className="text-slate-400 leading-relaxed">
        Doxly's engine is designed with a "Disposable Environment" architecture. Every time you process a file, a sandboxed local environment is created, utilized, and then immediately purged. This ensures no document fragments ever persist in your system memory longer than necessary.
      </p>
    </div>
  </PageWrapper>
);

export const Enterprise = () => (
  <PageWrapper 
    title="Elite Processing" 
    subtitle="Scaling privacy across your entire organization with Doxly Enterprise."
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="content-wrapper">
        <Users className="w-12 h-12 text-primary mb-6" />
        <h3 className="text-2xl font-bold mb-4">Team Control</h3>
        <p className="text-slate-500 mb-8">Manage deployments across thousands of machines with centralized policy control and zero infrastructure costs.</p>
        <button className="btn btn-primary w-full">Request Quote</button>
      </div>
      <div className="content-wrapper">
        <Server className="w-12 h-12 text-primary mb-6" />
        <h3 className="text-2xl font-bold mb-4">On-Prem Integration</h3>
        <p className="text-slate-500 mb-8">Direct integration with your internal workflows and document management systems via our binary bridge.</p>
        <button className="btn btn-outline w-full">View Documentation</button>
      </div>
    </div>
  </PageWrapper>
);

export const Pricing = () => (
  <PageWrapper 
    title="Fair Value" 
    subtitle="Professional tools for every scale. No hidden fees. No subscriptions."
  >
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="content-wrapper">
        <h3 className="text-xs font-black uppercase text-slate-400 mb-2">Personal</h3>
        <div className="text-4xl font-black mb-6">$0</div>
        <ul className="space-y-4 text-xs font-bold text-slate-500 uppercase mb-10">
          <li className="flex gap-2"><Check className="w-3 h-3 text-green-500" /> Unlimited Processing</li>
          <li className="flex gap-2"><Check className="w-3 h-3 text-green-500" /> Private Access</li>
          <li className="flex gap-2"><Check className="w-3 h-3 text-green-500" /> All PDF Tools</li>
        </ul>
        <Link to="/" className="btn btn-primary-ghost w-full">Current Plan</Link>
      </div>
      <div className="content-wrapper border-primary/20 shadow-xl shadow-primary/5 relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-black px-3 py-1 rounded-full uppercase">Most Popular</div>
        <h3 className="text-xs font-black uppercase text-slate-400 mb-2">Pro License</h3>
        <div className="text-4xl font-black mb-6">$49<span className="text-sm">/flat</span></div>
        <ul className="space-y-4 text-xs font-bold text-slate-500 uppercase mb-10">
          <li className="flex gap-2"><Check className="w-3 h-3 text-green-500" /> Commercial Usage</li>
          <li className="flex gap-2"><Check className="w-3 h-3 text-green-500" /> Priority Support</li>
          <li className="flex gap-2"><Check className="w-3 h-3 text-green-500" /> Early beta access</li>
        </ul>
        <button className="btn btn-primary w-full">Buy Forever</button>
      </div>
      <div className="content-wrapper">
        <h3 className="text-xs font-black uppercase text-slate-400 mb-2">Custom</h3>
        <div className="text-4xl font-black mb-6">Quote</div>
        <p className="text-xs font-medium text-slate-500 mb-10 uppercase">Volume licensing for agencies and large scale teams.</p>
        <button className="btn btn-outline w-full">Contact Sales</button>
      </div>
    </div>
  </PageWrapper>
);

export const API = () => (
  <PageWrapper 
    title="The Doxly SDK" 
    subtitle="Integrate our blazing fast, local-first engine into your own applications."
  >
    <div className="content-wrapper bg-slate-900 border-none">
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <code className="text-[10px] text-slate-500 font-mono">npm i @doxly/sdk</code>
      </div>
      <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`const { DoxlyEngine } = require('@doxly/sdk');

// Initialize the local vault
const vault = new DoxlyEngine();

// Perform extreme compression
const output = await vault.compress({
  input: buffer,
  quality: 0.6,
  localOnly: true
});`}
      </pre>
    </div>
  </PageWrapper>
);

export const Contact = () => (
  <PageWrapper title="Direct Support Node">
    <div className="content-wrapper text-center py-20">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Mail className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-3xl font-black mb-4">Questions? We're Here.</h2>
      <p className="max-w-md mx-auto text-slate-500 mb-10 leading-relaxed">Our team at Nexai Labs is ready to assist with any technical or licensing inquiries you have.</p>
      <a href="mailto:support@nexailabs.tech" className="btn btn-primary px-12 py-4 text-lg btn-glow inline-flex items-center gap-3">
        <Mail className="w-5 h-5" />
        support@nexailabs.tech
      </a>
      
      <div className="mt-12 pt-8 border-t border-slate-100 space-y-6">
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <Building2 className="w-4 h-4" />
          <span>Parent Company: <a href="https://nexailabs.tech" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">Nexai Labs</a></span>
        </div>
        
        <div className="max-w-md mx-auto bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-black uppercase tracking-widest text-red-900 mb-2">Headquarters</h4>
              <p className="text-sm font-bold text-red-700 leading-relaxed">
                Block 7, Jezero Crater<br/>
                Mars, Sol System
              </p>
              <p className="text-xs text-red-600/60 mt-2 italic">Operating at the edge of innovation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageWrapper>
);

export const Terms = () => (
  <PageWrapper 
    title="Terms of Service" 
    subtitle={`Last Updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
  >
    <div className="space-y-12">
      {/* Introduction */}
      <section className="content-wrapper bg-slate-50 border-l-4 border-primary">
        <div className="flex items-start gap-4">
          <Scale className="w-6 h-6 text-primary mt-1 shrink-0" />
          <div>
            <h3 className="text-lg font-bold mb-2 text-slate-900">Agreement to Terms</h3>
            <p className="text-slate-600 leading-relaxed">
              These Terms of Service ("Terms") govern your access to and use of Doxly, a professional PDF processing application developed by Nexai Labs. By accessing or using Doxly, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
            </p>
          </div>
        </div>
      </section>

      {/* Company Information */}
      <section className="content-wrapper">
        <div className="flex items-start gap-4 mb-6">
          <Building2 className="w-6 h-6 text-primary mt-1 shrink-0" />
          <div>
            <h3 className="text-xl font-bold mb-4">1. About Doxly</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Doxly is a desktop application developed and operated by <strong>Nexai Labs</strong>. Doxly provides local-first PDF processing tools that operate entirely on your device without requiring cloud connectivity.
            </p>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-700">
                <strong>Parent Company:</strong> Nexai Labs<br/>
                <strong>Website:</strong> <a href="https://nexailabs.tech" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">nexailabs.tech</a><br/>
                <strong>Contact:</strong> <a href="mailto:support@nexailabs.tech" className="text-primary hover:underline">support@nexailabs.tech</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* License */}
      <section className="content-wrapper">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <FileText className="w-6 h-6 text-primary" />
          2. License Grant
        </h3>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>
            Subject to your compliance with these Terms, Nexai Labs grants you a limited, non-exclusive, non-transferable, revocable license to download, install, and use Doxly for your personal or commercial purposes.
          </p>
          <p>
            You retain 100% ownership of all documents and files you process using Doxly. We do not claim any rights to your content.
          </p>
        </div>
      </section>

      {/* Restrictions */}
      <section className="content-wrapper">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-primary" />
          3. Restrictions on Use
        </h3>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>You agree not to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Reverse engineer, decompile, disassemble, or otherwise attempt to derive the source code of Doxly</li>
            <li>Modify, adapt, alter, or create derivative works based on Doxly</li>
            <li>Remove, alter, or obscure any proprietary notices, labels, or marks on Doxly</li>
            <li>Use Doxly for any illegal, unauthorized, or prohibited purpose</li>
            <li>Distribute, sublicense, lease, rent, loan, or otherwise transfer Doxly to any third party</li>
            <li>Use Doxly in any manner that could damage, disable, overburden, or impair our servers or networks</li>
          </ul>
        </div>
      </section>

      {/* Local Processing */}
      <section className="content-wrapper bg-green-50 border-green-200">
        <div className="flex items-start gap-4">
          <Shield className="w-6 h-6 text-green-600 mt-1 shrink-0" />
          <div>
            <h3 className="text-xl font-bold mb-4 text-green-900">4. Local Processing & Privacy</h3>
            <p className="text-green-800 leading-relaxed mb-4">
              Doxly operates entirely on your local device. All document processing occurs in your device's memory and storage. We do not transmit, store, or access your files on any external servers.
            </p>
            <p className="text-green-800 leading-relaxed">
              By using Doxly, you acknowledge that you are solely responsible for maintaining backups of your documents and that Nexai Labs is not liable for any data loss that may occur during processing.
            </p>
          </div>
        </div>
      </section>

      {/* Intellectual Property */}
      <section className="content-wrapper">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <Code className="w-6 h-6 text-primary" />
          5. Intellectual Property Rights
        </h3>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>
            Doxly, including its software, design, graphics, logos, and all other content, is the exclusive property of Nexai Labs and is protected by copyright, trademark, and other intellectual property laws.
          </p>
          <p>
            These Terms do not grant you any rights to use Nexai Labs' trademarks, service marks, logos, or other brand features.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="content-wrapper">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-primary" />
          6. Disclaimer of Warranties
        </h3>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>
            Doxly is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied. Nexai Labs disclaims all warranties, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Merchantability and fitness for a particular purpose</li>
            <li>Non-infringement of third-party rights</li>
            <li>Uninterrupted or error-free operation</li>
            <li>Accuracy, reliability, or completeness of results</li>
          </ul>
        </div>
      </section>

      {/* Limitation of Liability */}
      <section className="content-wrapper">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" />
          7. Limitation of Liability
        </h3>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>
            To the maximum extent permitted by law, Nexai Labs and its affiliates, officers, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Loss of data, profits, or business opportunities</li>
            <li>Cost of substitute services</li>
            <li>Any damages resulting from your use or inability to use Doxly</li>
          </ul>
          <p>
            Our total liability to you for any claims arising from or related to these Terms or your use of Doxly shall not exceed the amount you paid for Doxly, if any, or $50, whichever is greater.
          </p>
        </div>
      </section>

      {/* Indemnification */}
      <section className="content-wrapper">
        <h3 className="text-xl font-bold mb-4">8. Indemnification</h3>
        <p className="text-slate-600 leading-relaxed">
          You agree to indemnify, defend, and hold harmless Nexai Labs, its affiliates, officers, employees, and agents from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or relating to your use of Doxly, violation of these Terms, or infringement of any rights of another party.
        </p>
      </section>

      {/* Termination */}
      <section className="content-wrapper">
        <h3 className="text-xl font-bold mb-4">9. Termination</h3>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>
            Nexai Labs reserves the right to terminate or suspend your access to Doxly at any time, with or without cause or notice, for any reason, including if you breach these Terms.
          </p>
          <p>
            Upon termination, your right to use Doxly will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
          </p>
        </div>
      </section>

      {/* Changes to Terms */}
      <section className="content-wrapper">
        <h3 className="text-xl font-bold mb-4">10. Changes to Terms</h3>
        <p className="text-slate-600 leading-relaxed">
          Nexai Labs reserves the right to modify these Terms at any time. We will notify users of material changes by updating the "Last Updated" date at the top of this page. Your continued use of Doxly after such modifications constitutes your acceptance of the updated Terms.
        </p>
      </section>

      {/* Governing Law */}
      <section className="content-wrapper">
        <h3 className="text-xl font-bold mb-4">11. Governing Law</h3>
        <p className="text-slate-600 leading-relaxed">
          These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Nexai Labs operates, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of Doxly shall be subject to the exclusive jurisdiction of the courts in that jurisdiction.
        </p>
      </section>

      {/* Contact */}
      <section className="content-wrapper bg-primary/5 border-primary/20">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <Mail className="w-6 h-6 text-primary" />
          12. Contact Information
        </h3>
        <p className="text-slate-600 leading-relaxed mb-4">
          If you have any questions about these Terms of Service, please contact us:
        </p>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-700">
            <strong>Email:</strong> <a href="mailto:support@nexailabs.tech" className="text-primary hover:underline">support@nexailabs.tech</a><br/>
            <strong>Company:</strong> Nexai Labs<br/>
            <strong>Website:</strong> <a href="https://nexailabs.tech" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">nexailabs.tech</a>
          </p>
        </div>
      </section>
    </div>
  </PageWrapper>
);
  
export const Privacy = () => (
  <PageWrapper 
    title="Privacy Policy" 
    subtitle={`Last Updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
  >
    <div className="space-y-12">
      {/* Introduction */}
      <section className="content-wrapper bg-green-50 border-l-4 border-green-500">
        <div className="flex items-start gap-4">
          <Shield className="w-6 h-6 text-green-600 mt-1 shrink-0" />
          <div>
            <h3 className="text-lg font-bold mb-2 text-green-900">Our Commitment to Privacy</h3>
            <p className="text-green-800 leading-relaxed">
              At Nexai Labs, we are committed to protecting your privacy. Doxly is designed with privacy as a core principle—your documents are processed entirely on your device and never leave your computer.
            </p>
          </div>
        </div>
      </section>

      {/* Company Information */}
      <section className="content-wrapper">
        <div className="flex items-start gap-4 mb-6">
          <Building2 className="w-6 h-6 text-primary mt-1 shrink-0" />
          <div>
            <h3 className="text-xl font-bold mb-4">1. Information About Us</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Doxly is developed and operated by <strong>Nexai Labs</strong>. This Privacy Policy explains how we handle information in connection with your use of Doxly.
            </p>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-700">
                <strong>Data Controller:</strong> Nexai Labs<br/>
                <strong>Website:</strong> <a href="https://nexailabs.tech" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">nexailabs.tech</a><br/>
                <strong>Contact:</strong> <a href="mailto:support@nexailabs.tech" className="text-primary hover:underline">support@nexailabs.tech</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Local Processing */}
      <section className="content-wrapper bg-blue-50 border-blue-200">
        <div className="flex items-start gap-4">
          <Database className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-900">2. Local Processing Architecture</h3>
            <div className="space-y-4 text-blue-800 leading-relaxed">
              <p>
                <strong>Doxly operates entirely offline.</strong> All document processing occurs locally on your device using your device's processing power and memory.
              </p>
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <p className="font-bold mb-2">What This Means:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Your files never leave your device</li>
                  <li>No data is transmitted to external servers</li>
                  <li>No cloud storage is used</li>
                  <li>Processing happens in your device's local memory</li>
                  <li>All temporary data is purged when you close the application</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Information We Don't Collect */}
      <section className="content-wrapper">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <Eye className="w-6 h-6 text-primary" />
          3. Information We Do Not Collect
        </h3>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>Because Doxly operates entirely locally, we do not collect, store, or have access to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Your Documents:</strong> We never see, access, or store any PDF files or documents you process</li>
            <li><strong>File Contents:</strong> The actual content of your documents remains on your device</li>
            <li><strong>Personal Information:</strong> We do not collect names, email addresses, or other personal identifiers</li>
            <li><strong>Usage Analytics:</strong> We do not track which tools you use or how often you use them</li>
            <li><strong>Device Information:</strong> We do not collect device identifiers, IP addresses, or system information</li>
            <li><strong>Location Data:</strong> We do not collect or track your geographic location</li>
          </ul>
        </div>
      </section>

      {/* Optional Information */}
      <section className="content-wrapper">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <Mail className="w-6 h-6 text-primary" />
          4. Optional Information You May Provide
        </h3>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>
            If you contact us for support via email (<a href="mailto:support@nexailabs.tech" className="text-primary hover:underline">support@nexailabs.tech</a>), you may voluntarily provide:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Your email address</li>
            <li>Information about technical issues you're experiencing</li>
            <li>Feature requests or feedback</li>
          </ul>
          <p>
            This information is used solely to respond to your inquiries and improve our services. We do not use this information for marketing purposes without your explicit consent.
          </p>
        </div>
      </section>

      {/* Cookies and Tracking */}
      <section className="content-wrapper">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <Cookie className="w-6 h-6 text-primary" />
          5. Cookies and Tracking Technologies
        </h3>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>
            Doxly may use local storage (localStorage) on your device to remember your preferences, such as theme settings or tool configurations. This data remains on your device and is never transmitted to us.
          </p>
          <p>
            We do not use cookies, web beacons, or any other tracking technologies that transmit data to external servers.
          </p>
          <p>
            For more detailed information about our use of local storage, please see our <Link to="/cookie-policy" className="text-primary hover:underline font-bold">Cookie Policy</Link>.
          </p>
        </div>
      </section>

      {/* Third-Party Services */}
      <section className="content-wrapper">
        <h3 className="text-xl font-bold mb-4">6. Third-Party Services</h3>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>
            Doxly is designed to operate independently without requiring third-party services for document processing. However, if you choose to visit our website (nexailabs.tech), that website may have its own privacy practices.
          </p>
          <p>
            We encourage you to review the privacy policies of any third-party websites you visit.
          </p>
        </div>
      </section>

      {/* Data Security */}
      <section className="content-wrapper bg-slate-900 text-white">
        <div className="flex items-start gap-4">
          <Lock className="w-6 h-6 text-primary mt-1 shrink-0" />
          <div>
            <h3 className="text-xl font-bold mb-4">7. Data Security</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Since Doxly processes all documents locally on your device, the security of your documents depends on the security of your device. We recommend:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
              <li>Keeping your operating system and security software up to date</li>
              <li>Using strong passwords or biometric authentication on your device</li>
              <li>Regularly backing up your important documents</li>
              <li>Being cautious when sharing your device with others</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Children's Privacy */}
      <section className="content-wrapper">
        <h3 className="text-xl font-bold mb-4">8. Children's Privacy</h3>
        <p className="text-slate-600 leading-relaxed">
          Doxly is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at <a href="mailto:support@nexailabs.tech" className="text-primary hover:underline">support@nexailabs.tech</a>.
        </p>
      </section>

      {/* Your Rights */}
      <section className="content-wrapper">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <Check className="w-6 h-6 text-primary" />
          9. Your Privacy Rights
        </h3>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>
            Since we do not collect personal information through Doxly, there is no data for us to provide, modify, or delete. However, you have the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Stop using Doxly at any time</li>
            <li>Delete the application from your device</li>
            <li>Clear any local storage data through your device settings</li>
            <li>Contact us with privacy-related questions or concerns</li>
          </ul>
        </div>
      </section>

      {/* Changes to Privacy Policy */}
      <section className="content-wrapper">
        <h3 className="text-xl font-bold mb-4">10. Changes to This Privacy Policy</h3>
        <p className="text-slate-600 leading-relaxed">
          We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by updating the "Last Updated" date at the top of this page. We encourage you to review this Privacy Policy periodically.
        </p>
      </section>

      {/* Contact */}
      <section className="content-wrapper bg-primary/5 border-primary/20">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <Mail className="w-6 h-6 text-primary" />
          11. Contact Us
        </h3>
        <p className="text-slate-600 leading-relaxed mb-4">
          If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
        </p>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-700">
            <strong>Email:</strong> <a href="mailto:support@nexailabs.tech" className="text-primary hover:underline">support@nexailabs.tech</a><br/>
            <strong>Company:</strong> Nexai Labs<br/>
            <strong>Website:</strong> <a href="https://nexailabs.tech" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">nexailabs.tech</a>
          </p>
        </div>
      </section>
    </div>
  </PageWrapper>
);

export const CookiePolicy = () => (
  <PageWrapper 
    title="Cookie Policy" 
    subtitle={`Last Updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
  >
    <div className="space-y-12">
      <section className="content-wrapper bg-purple-50 border-l-4 border-purple-500">
        <div className="flex items-start gap-4">
          <Cookie className="w-6 h-6 text-purple-600 mt-1 shrink-0" />
          <div>
            <h3 className="text-lg font-bold mb-2 text-purple-900">Understanding Our Cookie Policy</h3>
            <p className="text-purple-800 leading-relaxed">
              This Cookie Policy explains how Doxly, developed by Nexai Labs, uses local storage and similar technologies. Since Doxly operates entirely offline, we do not use traditional cookies that transmit data to servers.
            </p>
          </div>
        </div>
      </section>

      <section className="content-wrapper">
        <div className="flex items-start gap-4 mb-6">
          <Building2 className="w-6 h-6 text-primary mt-1 shrink-0" />
          <div>
            <h3 className="text-xl font-bold mb-4">1. About This Policy</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              This Cookie Policy is provided by <strong>Nexai Labs</strong>, the developer and operator of Doxly. It explains our use of local storage technologies.
            </p>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-700">
                <strong>Company:</strong> Nexai Labs<br/>
                <strong>Website:</strong> <a href="https://nexailabs.tech" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">nexailabs.tech</a><br/>
                <strong>Contact:</strong> <a href="mailto:support@nexailabs.tech" className="text-primary hover:underline">support@nexailabs.tech</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-wrapper bg-green-50 border-green-200">
        <div className="flex items-start gap-4">
          <Shield className="w-6 h-6 text-green-600 mt-1 shrink-0" />
          <div>
            <h3 className="text-xl font-bold mb-4 text-green-900">2. What We Do NOT Use</h3>
            <div className="space-y-4 text-green-800 leading-relaxed">
              <p><strong>Doxly does not use traditional cookies or tracking technologies.</strong> Specifically, we do not use:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>HTTP Cookies:</strong> We do not set or read cookies that are transmitted to servers</li>
                <li><strong>Tracking Cookies:</strong> We do not use third-party tracking cookies</li>
                <li><strong>Analytics Cookies:</strong> We do not use cookies for analytics or user behavior tracking</li>
                <li><strong>Advertising Cookies:</strong> We do not use cookies for advertising purposes</li>
                <li><strong>Session Cookies:</strong> We do not use server-side session cookies</li>
                <li><strong>Web Beacons:</strong> We do not use web beacons or pixel tags</li>
                <li><strong>Fingerprinting:</strong> We do not use device fingerprinting technologies</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="content-wrapper">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <Database className="w-6 h-6 text-primary" />
          3. Local Storage (localStorage)
        </h3>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>Doxly may use your browser's or application's <strong>localStorage</strong> feature to store certain preferences and settings locally on your device. This data never leaves your device and is not transmitted to Nexai Labs or any third parties.</p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="font-bold mb-2 text-slate-900">What We Store Locally:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
              <li>Theme preferences (light/dark mode)</li>
              <li>Tool configuration settings</li>
              <li>User interface preferences</li>
              <li>Cookie consent preferences (if applicable)</li>
            </ul>
          </div>
          <p><strong>Important:</strong> This local storage data is stored entirely on your device and can be cleared at any time through your browser or application settings.</p>
        </div>
      </section>

      <section className="content-wrapper">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <Settings className="w-6 h-6 text-primary" />
          4. How to Manage Local Storage
        </h3>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>You have full control over the local storage data used by Doxly. Here's how to manage it:</p>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <h4 className="font-bold mb-2 text-slate-900">Desktop Application:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                <li>Clear application data through Doxly's settings menu (if available)</li>
                <li>Uninstall and reinstall Doxly to remove all local data</li>
                <li>Use your operating system's application data management tools</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <h4 className="font-bold mb-2 text-slate-900">Web Version (if applicable):</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                <li>Clear browser data through your browser's settings</li>
                <li>Use browser developer tools to clear localStorage</li>
                <li>Use private/incognito browsing mode</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="content-wrapper">
        <h3 className="text-xl font-bold mb-4">5. Third-Party Cookies</h3>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>Doxly does not integrate with third-party services that use cookies. We do not embed third-party content that might set cookies on your device.</p>
          <p>However, if you visit our parent company's website (<a href="https://nexailabs.tech" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">nexailabs.tech</a>), that website may have its own cookie practices. Please refer to that website's privacy and cookie policies for more information.</p>
        </div>
      </section>

      <section className="content-wrapper bg-blue-50 border-blue-200">
        <div className="flex items-start gap-4">
          <Zap className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-900">6. Purpose of Local Storage</h3>
            <div className="space-y-4 text-blue-800 leading-relaxed">
              <p>We use local storage solely to enhance your user experience by:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Remembering your preferences so you don't have to reconfigure settings each time</li>
                <li>Maintaining your theme selection across sessions</li>
                <li>Storing tool-specific configurations</li>
                <li>Improving application performance by caching non-sensitive preferences</li>
              </ul>
              <p className="mt-4"><strong>We do not use local storage for:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Tracking your behavior or usage patterns</li>
                <li>Collecting personal information</li>
                <li>Storing document content or file data</li>
                <li>Transmitting data to external servers</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="content-wrapper">
        <h3 className="text-xl font-bold mb-4">7. Duration of Storage</h3>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>Local storage data persists on your device until you:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Manually clear the application data</li>
            <li>Uninstall Doxly</li>
            <li>Clear your browser's local storage (for web versions)</li>
            <li>Use your device's storage management tools to clear application data</li>
          </ul>
          <p>There is no automatic expiration of local storage data. It remains on your device until you choose to remove it.</p>
        </div>
      </section>

      <section className="content-wrapper">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <Check className="w-6 h-6 text-primary" />
          8. Your Rights and Choices
        </h3>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>You have complete control over local storage used by Doxly:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Right to Access:</strong> You can view local storage data through your browser's developer tools or application settings</li>
            <li><strong>Right to Delete:</strong> You can clear local storage at any time through various methods described above</li>
            <li><strong>Right to Object:</strong> You can choose not to use features that require local storage, though this may limit functionality</li>
            <li><strong>Right to Withdraw Consent:</strong> You can clear stored preferences at any time</li>
          </ul>
        </div>
      </section>

      <section className="content-wrapper">
        <h3 className="text-xl font-bold mb-4">9. Updates to This Cookie Policy</h3>
        <p className="text-slate-600 leading-relaxed">
          We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by updating the "Last Updated" date at the top of this page. We encourage you to review this Cookie Policy periodically.
        </p>
      </section>

      <section className="content-wrapper bg-primary/5 border-primary/20">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <Mail className="w-6 h-6 text-primary" />
          10. Contact Us
        </h3>
        <p className="text-slate-600 leading-relaxed mb-4">
          If you have any questions, concerns, or requests regarding this Cookie Policy or our use of local storage, please contact us:
        </p>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-700">
            <strong>Email:</strong> <a href="mailto:support@nexailabs.tech" className="text-primary hover:underline">support@nexailabs.tech</a><br/>
            <strong>Company:</strong> Nexai Labs<br/>
            <strong>Website:</strong> <a href="https://nexailabs.tech" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">nexailabs.tech</a>
          </p>
        </div>
      </section>
    </div>
  </PageWrapper>
);
