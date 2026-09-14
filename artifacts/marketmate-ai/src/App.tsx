import React, { useEffect, useState } from 'react';
import { Switch, Route, useLocation } from 'wouter';
import { Menu, X, Wrench } from 'lucide-react';

import Navigation from './Navigation';

import { PostsManager } from './components/PostsManager';
import SavedPosts from './components/Savedpoststemp';
import { EarningsSection } from './components/EarningsSection';
import GrowthSection from './components/GrowthSection';
import ProfileSection from './components/ProfileSection';
import ReferralSection from './components/ReferralSection';
import VideoStudio from './components/VideoStudio';
import Settings from './components/Settings';


// ============================================================
// Tools Page
// ============================================================

const ToolsHub: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10">
            <Wrench className="w-6 h-6 text-purple-400" />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Tools
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Useful tools to help you grow your content and social presence.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white">
            Content Tools
          </h2>

          <p className="text-sm text-slate-400 mt-2">
            Create and improve social media content using MarketMate.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white">
            Growth Tools
          </h2>

          <p className="text-sm text-slate-400 mt-2">
            Use your growth plan to stay consistent and improve engagement.
          </p>
        </div>
      </div>
    </div>
  );
};


// ============================================================
// 404 Page
// ============================================================

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">
          404
        </h1>

        <p className="text-slate-400 mt-2">
          Page not found.
        </p>
      </div>
    </div>
  );
};


// ============================================================
// Main App
// ============================================================

const App: React.FC = () => {
  const [location, setLocation] = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getTabFromPath = (path: string): string => {
    if (path === '/') return 'dashboard';
    if (path === '/saved') return 'saved';
    if (path === '/growth') return 'growth';
    if (path === '/tools') return 'tools';
    if (path === '/video-studio') return 'video-studio';
    if (path === '/earnings') return 'monetization';
    if (path === '/profile') return 'profile';
    if (path === '/referral') return 'refer';
    if (path === '/settings') return 'settings';

    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<string>(
    getTabFromPath(location)
  );


  // ============================================================
  // Keep navigation synchronized with URL
  // ============================================================

  useEffect(() => {
    setActiveTab(getTabFromPath(location));
  }, [location]);


  // ============================================================
  // Navigation handler
  // ============================================================

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);

    switch (tab) {
      case 'dashboard':
      case 'studio':
        setLocation('/');
        break;

      case 'saved':
        setLocation('/saved');
        break;

      case 'growth':
        setLocation('/growth');
        break;

      case 'tools':
        setLocation('/tools');
        break;

      case 'video-studio':
        setLocation('/video-studio');
        break;

      case 'monetization':
        setLocation('/earnings');
        break;

      case 'profile':
        setLocation('/profile');
        break;

      case 'refer':
        setLocation('/referral');
        break;

      case 'settings':
        setLocation('/settings');
        break;

      default:
        setLocation('/');
        break;
    }
  };


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* ======================================================
          Mobile Header
      ====================================================== */}

      <header className="lg:hidden sticky top-0 z-50 bg-slate-950/95 backdrop-blur border-b border-slate-800">
        <div className="flex items-center justify-between px-4 py-3">

          <button
            type="button"
            onClick={() => handleTabChange('dashboard')}
            className="text-xl font-bold text-white"
          >
            MarketMate
            <span className="text-purple-400">.</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen((open) => !open)
            }
            className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

        </div>
      </header>


      {/* ======================================================
          Mobile Drawer
      ====================================================== */}

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 pt-[61px]">

          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
          />

          <aside className="relative w-[280px] max-w-[85vw] h-full bg-slate-950 border-r border-slate-800 overflow-y-auto">

            <Navigation
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              onCloseMobileMenu={() =>
                setMobileMenuOpen(false)
              }
            />

          </aside>
        </div>
      )}


      {/* ======================================================
          Desktop Layout
      ====================================================== */}

      <div className="min-h-screen lg:flex">

        {/* ====================================================
            Desktop Sidebar
        ==================================================== */}

        <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-slate-950 border-r border-slate-800">

          <div className="px-6 py-6 border-b border-slate-800">

            <button
              type="button"
              onClick={() => handleTabChange('dashboard')}
              className="text-2xl font-bold text-white"
            >
              MarketMate
              <span className="text-purple-400">.</span>
            </button>

            <p className="text-xs text-slate-500 mt-1">
              Social Growth & Monetization
            </p>

          </div>

          <div className="flex-1 overflow-y-auto">

            <Navigation
              activeTab={activeTab}
              setActiveTab={handleTabChange}
            />

          </div>

        </aside>


        {/* ====================================================
            Main Content
        ==================================================== */}

        <main className="w-full lg:pl-72">

          <div className="min-h-screen px-4 py-5 sm:px-6 lg:px-8 lg:py-8">

            <Switch>

              {/* Dashboard / Content Studio */}
              <Route
                path="/"
                component={PostsManager}
              />

              {/* Saved Posts */}
              <Route
                path="/saved"
                component={SavedPosts}
              />

              {/* 30-Day Growth */}
              <Route
                path="/growth"
                component={GrowthSection}
              />

              {/* Tools */}
              <Route
                path="/tools"
                component={ToolsHub}
              />

              {/* Video Studio */}
              <Route
                path="/video-studio"
                component={VideoStudio}
              />

              {/* Earnings / Monetization */}
              <Route
                path="/earnings"
                component={EarningsSection}
              />

              {/* Business Profile */}
              <Route
                path="/profile"
                component={ProfileSection}
              />

              {/* Refer & Earn */}
              <Route
                path="/referral"
                component={ReferralSection}
              />

              {/* Settings */}
              <Route
                path="/settings"
                component={Settings}
              />

              {/* 404 */}
              <Route component={NotFound} />

            </Switch>

          </div>

        </main>

      </div>

    </div>
  );
};

export default App;