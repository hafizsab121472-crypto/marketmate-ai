import React, { useState } from 'react';
import { Share2, Copy, Check, Gift } from 'lucide-react';

export const ReferralSection: React.FC = () => {
const [copied, setCopied] = useState(false);
const referralLink = "https://marketmate-ai.vercel.app/?ref=MM-89241";

const copyLink = () => {
navigator.clipboard.writeText(referralLink);
setCopied(true);
setTimeout(() => setCopied(false), 2000);
};

return (
<div className="max-w-4xl mx-auto p-6 space-y-6 text-slate-100">
<div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
<div className="flex items-center gap-2 text-indigo-400 font-semibold mb-2">
<Gift className="w-5 h-5" /> Refer & Earn Rewards
</div>
<h1 className="text-2xl font-bold mb-2">Invite Friends, Get Free Credits</h1>
<p className="text-slate-400 text-sm mb-6">Share your link to earn 20 AI credits for every registration.</p>

<div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800">  
      <input   
        type="text"   
        readOnly   
        value={referralLink}   
        className="bg-transparent flex-1 text-xs text-indigo-300 font-mono px-3 outline-none"   
      />  
      <button   
        onClick={copyLink}   
        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2"  
      >  
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}  
        {copied ? 'Copied' : 'Copy'}  
      </button>  
    </div>  
  </div>  
</div>

);
};
export default ReferralSection;