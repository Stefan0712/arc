import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Upload, RefreshCw, Trash2, Database, AlertCircle } from 'lucide-react';
import { db } from '../../db/db';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import ConfirmationModal from '../../components/layout/ConfirmationModal';

export default function DataSettings() {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleNuke = async () => {
    await db.delete();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-page text-primary flex flex-col font-sans">
      <AnimatePresence>
        {showDeleteModal  ? <ConfirmationModal title='Are you sure?' isOpen={showDeleteModal} message='This will delete all habits and logs and cannot be undone. Do you want to continue?' onConfirm={handleNuke} onClose={()=>setShowDeleteModal(false)} /> : null}
      </AnimatePresence>
      <header className="p-4 flex items-center gap-4 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Data Management</h1>
      </header>

      <main className="p-4 flex flex-col gap-8 max-w-2xl mx-auto w-full">
        {/* Backup & Recovery */}
        <section>
          <div className="flex items-center gap-2 mb-3 ml-2 text-secondary">
            <Database size={14} />
            <h2 className="text-[14px] font-bold uppercase">Backup & Recovery</h2>
          </div>
          <div className="bg-menu-section rounded-cards border border-menu-section-border overflow-hidden shadow-xl">
            <button onClick={()=>navigate('/menu/export')} className="w-full flex items-center justify-between p-4 active:bg-zinc-800 border-b border-zinc-800/50">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded bg-emerald-500/10 text-emerald-500">
                  <Download size={20} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-menu-button-title">Export Data</p>
                  <p className="text-xs text-zinc-500 text-menu-button-subtitle">Download your habits as JSON</p>
                </div>
              </div>
            </button>

            <div className="w-full flex items-center justify-between p-4 cursor-pointer">
              <button onClick={()=>navigate('/menu/import')} className="flex items-center gap-4">
                <div className="p-2 rounded bg-blue-500/10 text-blue-500">
                  <Upload size={20} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">Import Data</p>
                  <p className="text-xs text-zinc-500">Restore from a JSON backup</p>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Connectivity */}
        <section>
          <div className="flex items-center gap-2 mb-3 ml-2 text-dim">
            <RefreshCw size={14} />
            <h2 className="text-[14px] font-bold uppercase text-secondary">Cloud Sync</h2>
          </div>
          <div className="bg-menu-section rounded-cards border border-menu-section-border p-4 opacity-70 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded bg-icon-background text-primary">
                <RefreshCw size={20} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm text-menu-button-title italic">Cloud Sync (Coming Soon)</p>
                <p className="text-xs text-menu-button-subtitle">Cross-device synchronization</p>
              </div>
            </div>
          </div>
        </section>

        {/* Reset & Wipe */}
        <section>
          <div className="flex items-center gap-2 mb-3 ml-2 text-rose-500/80">
            <AlertCircle size={14} />
            <h2 className="text-[14px] font-bold uppercase">Danger Zone</h2>
          </div>
          <div className="bg-menu-button-danger rounded-cards border border-menu-button-danger-border overflow-hidden shadow-xl">
            <button onClick={()=>setShowDeleteModal(true)} className="w-full flex items-center gap-4 p-4 active:bg-rose-500/10 text-menu-button-danger-text transition-colors">
              <div className="p-2 rounded bg-rose-500/10">
                <Trash2 size={20} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Delete All Data</p>
                <p className="text-xs uppercase font-bold tracking-tighter">Everything will be lost</p>
              </div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}