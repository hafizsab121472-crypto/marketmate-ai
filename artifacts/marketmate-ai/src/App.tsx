import React, { useState } from 'react';
import Navigation from './Navigation';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 dark">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 text-slate-200">
          <h1 className="text-2xl font-bold mb-4 text-white">MarketMate AI Dashboard</h1>
          <p className="text-slate-400">آپ کا ڈارک موڈ اور نیویگیشن مینو اب مکمل طور پر تیار ہے۔</p>
        </div>
      </main>
    </div>
  );
}

export default App;

