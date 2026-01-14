import React from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface SidebarToggleProps {
  readonly collapsed: boolean;
  readonly onToggle: (collapsed: boolean) => void;
  readonly className?: string;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({ collapsed, onToggle, className = '' }) => {
  const logoSize = 16;

  return (
    <div className={className}>
      {collapsed ? (
        <button
          onClick={() => onToggle(false)}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all duration-200 flex-shrink-0"
          title="Expand sidebar"
        >
          <PanelLeftOpen size={logoSize} />
        </button>
      ) : (
        <button
          onClick={() => onToggle(true)}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all duration-200 flex-shrink-0"
          title="Collapse sidebar"
        >
          <PanelLeftClose size={logoSize} />
        </button>
      )}
    </div>
  );
};

export default SidebarToggle;
