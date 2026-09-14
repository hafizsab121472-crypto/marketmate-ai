import React, { useState } from 'react';
import { Video, Sparkles, Film, Copy, Check, Smartphone, Tv } from 'lucide-react';

export const VideoStudio: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const formatText = aspectRatio === '9:16' ? 'Vertical 9:16 TikTok/Reels' : 'Horizontal 16:9 YouTube';
      const prompt = `Cinematic ${formatText} video script for: "${topic}".\n\n[Scene 1]: Visual hook to catch attention.\n[Camera]: Dynamic panning shot.\n[Audio]: Energetic background music with voiceover.`;
      
      setGeneratedPrompt(prompt);
      setLoading(false);
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <Video className="w-6 h-6 text-indigo-400" />
          <h1 className="text-2xl font-bold">AI Video Studio</h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              Video Topic ya Idea
            </label>
            <textarea
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Marketing strategy for 2026..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setAspectRatio('9:16')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium ${
                aspectRatio === '9:16' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'border-slate-800 text-slate-400'
              }`}
            >
              <Smartphone className="w-4 h-4" /> 9:16 (TikTok/Reels)
            </button>
            <button
              type="button"
              onClick={() => setAspectRatio('16:9')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium ${
                aspectRatio === '16:9' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'border-slate-800 text-slate-400'
              }`}
            >
              <Tv className="w-4 h-4" /> 16:9 (YouTube)
            </button>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition"
          >
            <Sparkles className="w-5 h-5" />
            {loading ? 'Generating...' : 'Generate AI Video Prompt'}
          </button>

          {generatedPrompt && (
            <div className="mt-6 bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold uppercase text-indigo-400 flex items-center gap-1">
                  <Film className="w-3.5 h-3.5" /> Generated Prompt
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-md"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">{generatedPrompt}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoStudio;
