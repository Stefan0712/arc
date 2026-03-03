import { useNavigate } from 'react-router-dom';
import { Settings, Database, Palette, ChevronRight, ArrowLeft, Info, type LucideIcon} from 'lucide-react';

export default function Menu() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-app text-primary flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center gap-4 sticky top-0 z-20">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black tracking-tight">System Menu</h1>
      </header>

      <main className="p-4 flex flex-col gap-8 max-w-2xl mx-auto w-full overflow-y-auto">

        {/* Core Settings Group */}
        <div className="space-y-6">
          <section>
            <h2 className="text-[14px] font-bold uppercase text-secondary mb-3 ml-2">App Experience</h2>
            <div className="bg-menu-section rounded-cards border border-menu-section-border overflow-hidden shadow-xl">
              <MenuLink 
                icon={Settings} 
                label="General Settings" 
                sublabel="Haptics & Controls"
                colorClass="bg-blue-600"
                onClick={() => navigate('/menu/settings')} 
              />
              <MenuLink 
                icon={Palette} 
                label="Visual Themes" 
                sublabel="Colors & Appearance"
                colorClass="bg-purple-600"
                onClick={() => navigate('/menu/themes')} 
              />
            </div>
          </section>

          <section>
            <h2 className="text-[14px] font-bold uppercase text-secondary mb-3 ml-2">Maintenance</h2>
            <div className="bg-menu-section rounded-cards border border-menu-section-border overflow-hidden shadow-xl">
              <MenuLink 
                icon={Database} 
                label="Data Management" 
                sublabel="Import, Export & Reset"
                colorClass="bg-emerald-600"
                onClick={() => navigate('/menu/data')} 
              />
            </div>
          </section>

          <section>
            <h2 className="text-[14px] font-bold uppercase text-secondary mb-3 ml-2">Support</h2>
            <div className="bg-menu-section rounded-cards border border-menu-section-border overflow-hidden shadow-xl">
              <MenuLink 
                icon={Info} 
                label="About" 
                sublabel="v1.0.0-beta"
                colorClass="bg-zinc-700"
                onClick={() => navigate('/about')} 
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

interface MenuLinkProps {
  icon: LucideIcon;
  label: string;
  sublabel?: string;
  onClick: () => void;
  colorClass?: string;
}

const MenuLink = ({ icon: Icon, label, sublabel, onClick, colorClass }: MenuLinkProps) => (
    <button 
        onClick={onClick}
        className="w-full bg-menu-button flex items-center justify-between p-4 transition-colors"
    >
        <div className="flex items-center gap-4">
        <div className={`p-2 rounded ${colorClass || 'bg-menu-icon-bg'} text-menu-button-icon-text`}>
            <Icon size={20} />
        </div>
        <div className="text-left">
            <p className="font-semibold text text-menu-button-title">{label}</p>
            {sublabel && <p className="text-[14px] text-menu-button-subtitle font-medium uppercase">{sublabel}</p>}
        </div>
        </div>
        <ChevronRight size={18} className="text-secondary" />
    </button>
);