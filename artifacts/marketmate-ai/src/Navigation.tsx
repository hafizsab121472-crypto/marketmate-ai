import React from 'react';
import { 
  Home, 
  FileText, 
  Bookmark, 
  TrendingUp, 
  Wrench, 
  Video, 
  DollarSign, 
  User, 
  Gift, 
  Settings,
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onCloseMobileMenu?: () => void;
}

export const navItems = [
  { id: 'dashboard', label: 'Dashboard / Home', icon: Home },
  { id: 'studio', label: 'Content Studio', icon: FileText },
  { id: 'saved', label: 'Saved Posts', icon: Bookmark },
  { id: 'growth', label: '30-Day Growth', icon: TrendingUp },
  { id: 'tools', label: 'Tools', icon: Wrench },
  { id: 'video-studio', label: 'Video Studio', icon: Video },
  { id: 'monetization', label: 'Earnings / Monetization', icon: DollarSign },
  { id: 'profile', label: 'Business Profile', icon: User },
  { id: 'refer', label: 'Refer & Earn', icon: Gift },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  setActiveTab, 
  onCloseMobileMenu 
}) => {
  const handleSelect = (id: string) => {
    setActiveTab(id);
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  return (
    <nav className="flex flex-col space-y-1 p-4">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full text-left ${
              isActive 
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' 
                : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
            }`}
          >
            <IconComponent className="w-5 h-5 shrink-0" />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
