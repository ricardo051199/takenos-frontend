import { LayoutDashboard, Users, FileText, Settings, Zap } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'influencers', label: 'Influencers', icon: Users },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'automation', label: 'Automatización', icon: Zap },
    { id: 'reports', label: 'Reportes', icon: FileText },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="w-64 min-h-screen bg-[#6D37D5] text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl tracking-wide">Takenos</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-white/20 shadow-lg'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="text-sm text-white/60">
          © 2024 Takenos
        </div>
      </div>
    </div>
  );
}