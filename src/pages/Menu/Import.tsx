import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileJson, CheckCircle2 } from 'lucide-react';
import { db } from '../../db/db';
import type { ExportData, Habit, Log } from '../../types/types';
import { toast } from '../../store/useNotificationStore';

export default function ImportPage() {
  const navigate = useNavigate();
  const [previewData, setPreviewData] = useState<ExportData | null>(null);

  const handleFileLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setPreviewData(json);
      } catch (err: unknown) {
        if (err instanceof Error) {
            alert('Import failed: '+err.message)
        }else {
            alert('Unknown error occured during import')
        }
      }
    };
    reader.readAsText(file);
  };

  const processImport = async () => {
    if (!previewData) return;
    
    const logsWithDates = previewData.logs.map((log: Log) => ({
      ...log,
      timestamp: new Date(log.timestamp) // This is the magic line
    }));

    await db.transaction('rw', db.habits, db.logs, async () => {
      await db.habits.bulkPut(previewData.habits);
      await db.logs.bulkPut(logsWithDates);
    });

    toast('File was imported successfully', 'success');
    navigate('/menu/data');
  };

  return (
    <div className="min-h-screen bg-page text-primary flex flex-col font-sans">
      <header className="p-4 flex items-center gap-4 sticky top-0">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-secondary hover:text-primary"><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-bold">Import Data</h1>
      </header>

      <main className="p-4 flex flex-col gap-6 max-w-2xl mx-auto w-full">
        {!previewData ? (
          <label className="flex flex-col items-center justify-center gap-4 p-12 border-2 border-dashed border-habit-card rounded-cards bg-transparent cursor-pointer hover:bg-action-hover transition-colors">
            <Upload size={40} className="text-zinc-600" />
            <div className="text-center">
              <p className="font-bold">Click to upload backup file</p>
              <p className="text-xs text-dim">.json files only</p>
            </div>
            <input type="file" accept=".json" onChange={handleFileLoad} className="hidden" />
          </label>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-accent/20 border border-accent rounded flex items-center gap-3">
              <FileJson className="text-accent" />
              <p className="text-sm font-bold">File Loaded: {previewData.habits.length} Habits found</p>
            </div>

            <section className="space-y-3">
              <h2 className="text-xs font-bold uppercase text-secondary ml-1">Previewing Content</h2>
              <div className="bg-menu-section rounded-cards border border-menu-section divide-y divide-zinc-800/50">
                {previewData.habits.map((h: Habit) => {
                  const logCount = previewData.logs.filter((l: Log) => l.habitId === h._id).length;
                  return (
                    <div key={h._id} className="p-4 flex justify-between items-center">
                      <span className="text-sm font-medium">{h.title}</span>
                      <span className="text-[10px] bg- px-2 py-1 rounded text-zinc-400 font-bold uppercase">{logCount} Logs</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="flex gap-2">
              <button onClick={() => setPreviewData(null)} className="flex-1 bg-no-btn border border-subtle py-4 rounded-button font-bold">Cancel</button>
              <button onClick={processImport} className="flex-[2] bg-accent py-4 rounded-button font-bold flex items-center justify-center gap-2">
                <CheckCircle2 size={20} /> Confirm Import
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}