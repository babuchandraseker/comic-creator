import React from 'react';
import { Lightbulb } from 'lucide-react';

const SAMPLES = [
  {
    title: 'The Cyberpunk Courier',
    style: 'Cyberpunk Manga',
    story: 'In Neo-Tokyo 2099, Kaito, a cybernetic motorcycle courier, receives a locked bio-drive with no sender. While zooming through neon-lit alleys, a swarm of rogue corporate drones ambushes him. He skids behind an energy barrier, draws his pulse blaster, and realizes the drive contains his missing sister\'s consciousness.',
  },
  {
    title: 'The Dragon\'s Tea Party',
    style: 'Whimsical Cartoon',
    story: 'Barnaby the ferocious red dragon was tired of burning castles. One Tuesday, he puts on a tiny apron and bakes blueberry scones. Sir Reginald the knight kicks open the cave door ready for battle, but is bewildered when Barnaby politely offers him a cup of Earl Grey tea and fresh pastry.',
  },
  {
    title: 'Midnight Detective',
    style: 'Classic Noir Comic',
    story: 'Detective Jack Malone stared at the rain-streaked window of his dusty office. A mysterious dame in a crimson trench coat stepped in from the fog, clutching an obsidian key. "Someone is hunting the shadows," she whispered. Before Jack could ask, the streetlamp outside shattered with a loud crack.',
  },
];

export default function SampleStories({ onSelectSample, disabled }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
        <Lightbulb className="w-4 h-4 text-amber-500" />
        <span>Try a sample story preset:</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {SAMPLES.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelectSample(sample)}
            className="text-left bg-white hover:bg-yellow-50 border-2 border-black rounded-lg p-2.5 shadow-comic-sm hover:translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="font-bold text-xs text-black">{sample.title}</div>
            <div className="text-[11px] text-indigo-600 font-semibold">{sample.style}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
