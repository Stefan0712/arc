import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, Globe, Code2, Database, Zap, Cpu } from 'lucide-react';
import Logo from '../assets/logo.png';

export default function AboutPage() {
  const navigate = useNavigate();

  const techStack = [
    { name: 'React 19', icon: <Zap size={16} />, desc: 'UI Library & Hooks' },
    { name: 'TypeScript', icon: <Code2 size={16} />, desc: 'Type-safe logic' },
    { name: 'Zustand', icon: <Cpu size={16} />, desc: 'Global State & Settings' },
    { name: 'Dexie.js', icon: <Database size={16} />, desc: 'IndexedDB Persistence' },
  ];

  return (
    <div className="min-h-screen bg-page text-primary flex flex-col font-sans">
      <header className="p-4 flex items-center gap-4 sticky top-0 z-20 bg-page/80 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold tracking-tight">About</h1>
      </header>

      <main className="p-4 flex flex-col gap-8 max-w-2xl mx-auto w-full overflow-y-auto mb-20">
        {/* App Info */}
        <section className="text-center py-6">
          <div className="w-20 h- rounded-cards mx-auto mb-4 flex items-center justify-center shadow-lg shadow-accent/20">
            <img src={Logo} />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Arc</h2>
          <p className="text-secondary text-sm">Version 1.0.0 (Stable)</p>
        </section>

        {/* The Stack */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-secondary ml-1">Tech Stack</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {techStack.map((tech) => (
              <div key={tech.name} className="bg-menu-section border border-menu-section-border p-4 rounded-cards flex items-start gap-3">
                <div className="p-2 bg-page rounded-lg text-accent">
                  {tech.icon}
                </div>
                <div>
                  <p className="font-bold text-sm">{tech.name}</p>
                  <p className="text-xs text-secondary">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Links */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-secondary ml-1">Developer</h3>
          <div className="bg-menu-section border border-menu-section-border rounded-cards divide-y divide-menu-section-border overflow-hidden">
            <a 
              href="https://github.com/stefan0712" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-between p-4 hover:bg-page transition-colors"
            >
              <div className="flex items-center gap-3">
                <Github size={18} className="text-secondary" />
                <span className="text-sm font-medium">GitHub Profile</span>
              </div>
              <Globe size={14} className="text-dim" />
            </a>
            <a 
              href="https://github.com/stefan0712/arc" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-between p-4 hover:bg-page transition-colors"
            >
              <div className="flex items-center gap-3">
                <Code2 size={18} className="text-secondary" />
                <span className="text-sm font-medium">Source Code</span>
              </div>
              <Globe size={14} className="text-dim" />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}