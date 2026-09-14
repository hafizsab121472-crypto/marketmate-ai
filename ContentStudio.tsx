import React, { useState } from 'react';
import { Copy, Trash2, Video, Sparkles } from 'lucide-react';

export const ContentStudio: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('TikTok/Reels');
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const handleGeneratePrompt = () => {
    if (!topic.trim()) return;

    const promptText = `Cinematic Vertical 9:16 ${platform} video script for: "${topic}".\n\n[Scene 1]: Visual hook to catch attention.\n[Camera]: Dynamic panning shot.\n[Audio]: Energetic background music with voiceover.`;
    setGeneratedPrompt(promptText);
  };

  const handleCopy = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      alert('Prompt copied to clipboard!');
    }
  };

  const handleDelete = () => {
    setGeneratedPrompt('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-slate-100 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Content Studio</h1>
        <p className="text-slate-400 text-sm">AI Content & Video Prompt Generator</p>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Video Topic / Description
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter video concept (e.g., A futuristic marketing dashboard)"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex gap-3">
          {['TikTok/Reels', 'YouTube'].map((item) => (
            <button
              key={item}
              onClick={() => setPlatform(item)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                platform === item
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          onClick={handleGeneratePrompt}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <Sparkles className="w-5 h-5" />
          Generate AI Video Prompt
        </button>
      </div>

      {generatedPrompt && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Video className="w-4 h-4" />
              Generated Prompt
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs font-medium flex items-center gap-1.5 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy
              </button>

              <button
                onClick={handleDelete}
                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-md text-xs font-medium flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>

          <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-800/50">
            {generatedPrompt}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ContentStudio;
