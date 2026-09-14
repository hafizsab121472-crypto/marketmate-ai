import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { ContentStudio } from './components/ContentStudio';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 dark">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'content-studio' ? (
          <ContentStudio />
        ) : (
          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 text-slate-200">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p>مینو میں سے Content Studio پر کلک کریں تاکہ آپ پرامپٹ جنریٹر استعمال کر سکیں۔</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

