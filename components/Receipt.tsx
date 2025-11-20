import React, { useEffect, useRef } from 'react';
import { Check, Clock, Printer } from 'lucide-react';
import { Participant, TripDetails } from '../types';

interface ReceiptProps {
  participants: Participant[];
  tripDetails: TripDetails;
  isPrinting: boolean;
  printingProgress: number;
  onRemind: (participant: Participant) => void;
  remindingId: string | null;
}

export const Receipt: React.FC<ReceiptProps> = ({ 
  participants, 
  tripDetails, 
  isPrinting, 
  printingProgress,
  onRemind,
  remindingId
}) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const isComplete = printingProgress >= 100;
  const allPaid = participants.every(p => p.status === 'paid');

  // Paper movement logic - emerges from inside the printer slot
  // Starts hidden inside the black box and gradually emerges
  const paperTranslateY = isPrinting ? printingProgress : 0;
  
  // Calculate rotation for enhanced 3D effect
  const rotationX = Math.max(0, 20 - (paperTranslateY * 0.2));
  const translateZ = paperTranslateY * 0.8;

  // Audio Effect for Printing
  useEffect(() => {
    if (!isPrinting || isComplete) return;

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const volume = ctx.createGain();
    volume.gain.value = 0.05; // Keep it very subtle
    volume.connect(ctx.destination);

    // 1. Motor Hum (Sawtooth)
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 120; // Low mechanical hum
    
    // Lowpass filter for the motor to make it duller
    const motorFilter = ctx.createBiquadFilter();
    motorFilter.type = 'lowpass';
    motorFilter.frequency.value = 400;
    osc.connect(motorFilter);
    motorFilter.connect(volume);

    // 2. Paper Friction (White Noise)
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Bandpass filter for the "hiss" of thermal printing
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 2000;
    noiseFilter.Q.value = 1;
    
    noise.connect(noiseFilter);
    noiseFilter.connect(volume);

    // Start
    osc.start();
    noise.start();

    // Cleanup function
    return () => {
      const endTime = ctx.currentTime + 0.1;
      volume.gain.exponentialRampToValueAtTime(0.001, endTime);
      osc.stop(endTime);
      noise.stop(endTime);
      setTimeout(() => {
        ctx.close();
      }, 150);
    };
  }, [isPrinting, isComplete]);

  return (
    <div className="relative w-full flex flex-col items-center" style={{ perspective: '2000px' }}>
      
      {/* ---------------- THE RECEIPT PAPER ---------------- */}
      <div 
        className="relative w-[90%] transition-all duration-100 ease-linear will-change-transform"
        style={{ 
            transformStyle: 'preserve-3d',
            transformOrigin: 'top center',
            // Paper emerges from inside the slot - starts at 0% (hidden) and moves down as it prints
            transform: `translateY(${paperTranslateY - 100}%) translateZ(${translateZ}px) rotateX(${rotationX}deg)`,
            opacity: isPrinting ? 1 : 0,
            // Position it so the top edge is at the slot opening
            marginTop: '0px',
            zIndex: 20,
        }}
      >
        {/* ---------------- PRINTING STATUS BAR (Above Receipt) ---------------- */}
        {isPrinting && !isComplete && (
          <div className="absolute -top-20 left-0 right-0 bg-white rounded-2xl p-3 shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff] z-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Printer size={14} className="text-slate-600" />
                <span className="text-xs font-semibold text-slate-800">Printing...</span>
              </div>
              <span className="text-xs font-bold text-slate-600">{Math.round(printingProgress)}%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 transition-all duration-100 ease-linear rounded-full relative"
                style={{ width: `${printingProgress}%` }}
              >
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
        {/* Enhanced shadow cast by the printer housing onto the emerging paper */}
        <div 
            className="absolute left-0 right-0 pointer-events-none z-40 mix-blend-multiply rounded-t-sm"
            style={{
                top: '0',
                height: `${Math.max(0, 120 - paperTranslateY)}px`,
                background: `linear-gradient(to bottom, 
                    rgba(0,0,0,${Math.max(0, 0.9 - paperTranslateY * 0.007)}),
                    rgba(0,0,0,${Math.max(0, 0.5 - paperTranslateY * 0.004)}) 50%,
                    transparent)`,
                transition: 'all 100ms linear',
            }}
        ></div>
        
        {/* "Fresh Print" Gloss/Sheen overlay that follows the printing head */}
        <div 
            className="absolute left-0 right-0 z-40 pointer-events-none mix-blend-overlay"
            style={{
                top: `${paperTranslateY * 0.8}px`,
                height: '40px',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)',
                transition: 'top 100ms linear',
            }}
        ></div>

        {/* Paper Content */}
        <div 
            className="bg-[#fbfbfb] w-full font-mono text-slate-800 relative rounded-b-[2px] overflow-visible"
            style={{boxShadow: `
                    0 ${Math.min(50, paperTranslateY * 0.5)}px ${Math.min(100, paperTranslateY)}px -12px rgba(0,0,0,${Math.min(0.5, paperTranslateY * 0.005)}),
                    0 ${Math.min(20, paperTranslateY * 0.2)}px ${Math.min(40, paperTranslateY * 0.4)}px -8px rgba(0,0,0,${Math.min(0.3, paperTranslateY * 0.003)}),
                    0 4px 6px -2px rgba(0,0,0,0.1),
                    inset 0 0 60px rgba(0,0,0,0.02)
                `,
                transition: 'box-shadow 100ms linear',
            }}
        >
            {/* Paper Base Color with slight yellowing */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#fffef9] via-[#fffcf5] to-[#fffbf0]"></div>
            
            {/* Texture Layers - Enhanced */}
            {/* Fine paper grain */}
            <div className="absolute inset-0 opacity-[0.18] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply pointer-events-none"></div>
            {/* Fiber texture */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4=')] pointer-events-none"></div>
            {/* Subtle dot pattern */}
            <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle,#000_0.5px,transparent_0.5px)] [background-size:8px_8px] pointer-events-none"></div>
            
            {/* Subtle edge wear/aging */}
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(139,117,83,0.015)] via-transparent to-[rgba(139,117,83,0.015)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(139,117,83,0.02)] pointer-events-none"></div>
            
            {/* Left edge perforation marks */}
            <div className="absolute left-0 top-0 bottom-0 w-[4px] pointer-events-none z-30">
                {[...Array(20)].map((_, i) => (
                    <div 
                        key={i} 
                        className="absolute left-[1px] w-[2px] h-[3px] bg-slate-300/40"
                        style={{ 
                            top: `${i * 5}%`,
                            borderRadius: '50%',
                            boxShadow: 'inset 0 0 1px rgba(0,0,0,0.2)'
                        }}
                    ></div>
                ))}
            </div>
            
            {/* Receipt Body with Ink Bleed Effect */}
            <div 
                className="relative z-10 p-5 pt-7 flex flex-col gap-[18px]"
                style={{ filter: 'contrast(1.05)' }} // Slight contrast boost to sharpen edges
            >
                
                {/* Header */}
                <div 
                    className="text-center flex flex-col items-center gap-[5px] pt-1 pb-1"
                    style={{ textShadow: '0 0 0.5px rgba(15, 23, 42, 0.4)' }} // Heavy bleed for bold header
                >
                    <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-slate-900">Trip Invoice</h2>
                    <div className="w-2/3 border-b border-slate-800/80 my-0.5 shadow-[0_1px_1px_rgba(0,0,0,0.1)]"></div>
                    <p className="text-[8px] text-slate-500 uppercase tracking-[0.2em] font-semibold" style={{ textShadow: '0 0 0.3px rgba(100, 116, 139, 0.3)' }}>Japan Event 2025</p>
                </div>

                {/* Financials */}
                <div 
                    className="space-y-[5px] px-2 py-[14px] bg-slate-50/80 rounded-sm border-y border-dashed border-slate-300/80"
                    style={{ textShadow: '0 0 0.3px rgba(0,0,0,0.15)' }}
                >
                    <div className="flex justify-between items-baseline">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</span>
                        <span className="text-base font-bold text-slate-900 tracking-tighter" style={{ textShadow: '0 0 0.5px rgba(15, 23, 42, 0.3)' }}>{formatCurrency(tripDetails.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Per Person</span>
                        <span className="text-xs font-bold text-slate-700">{formatCurrency(tripDetails.perPersonAmount)}</span>
                    </div>
                </div>

                {/* User List */}
                <div 
                    className="flex flex-col gap-[14px] px-1"
                    style={{ textShadow: '0 0 0.2px rgba(0,0,0,0.1)' }} // Light bleed for list items
                >
                    {participants.map((person) => (
                        <div key={person.id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-2.5">
                                <div className="relative w-7 h-7">
                                    <div className="absolute inset-0 bg-slate-200 rounded-full"></div>
                                    <img 
                                        src={person.avatar} 
                                        className="w-full h-full rounded-full grayscale contrast-125 border border-white/50 relative z-10 object-cover" 
                                        alt="" 
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-slate-800 uppercase tracking-wider">{person.name}</span>
                                    {person.isCurrentUser && <span className="text-[7px] text-blue-600 font-bold uppercase tracking-widest" style={{ textShadow: 'none' }}>Current User</span>}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {person.status === 'unpaid' && (
                                    <button 
                                        onClick={() => onRemind(person)} 
                                        disabled={remindingId === person.id} 
                                        className="text-[8px] text-slate-400 hover:text-slate-900 font-bold uppercase tracking-widest mr-2 transition-colors"
                                    >
                                        {remindingId === person.id ? '...' : 'REMIND'}
                                    </button>
                                )}
                                <div className={`
                                    flex items-center gap-1.5 px-2 py-1 rounded-[4px] transition-all border
                                    ${person.status === 'paid' 
                                        ? 'bg-slate-100 border-slate-200 text-slate-900' 
                                        : 'bg-white border-slate-200 text-slate-400'}
                                `}>
                                    {person.status === 'paid' ? <Check size={10} strokeWidth={4} /> : <Clock size={10} strokeWidth={3} />}
                                    <span className="text-[8px] font-bold uppercase tracking-widest">{person.status}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer / Status Bar */}
                <div className="mt-[5px] pt-[14px] border-t-2 border-slate-900" style={{ borderColor: 'rgba(15, 23, 42, 0.9)', textShadow: '0 0 0.4px rgba(0,0,0,0.2)' }}>
                    <div className="flex justify-between items-center mb-[9px]">
                        <span className="text-[8px] font-bold uppercase text-slate-900 tracking-[0.2em]">Payment Status</span>
                        <span className="bg-slate-900 text-white text-[7px] font-bold uppercase tracking-widest px-2 py-1 rounded shadow-sm">
                            {allPaid ? 'Confirmed' : 'Pending'}
                        </span>
                    </div>
                    
                    {/* Progress Bars */}
                    <div className="flex gap-1 h-1.5 w-full mb-2">
                        {[...Array(5)].map((_, i) => {
                            const total = participants.length;
                            const paidCount = participants.filter(p => p.status === 'paid').length;
                            const fillLevel = total > 0 ? (paidCount / total) * 5 : 0;
                            const isActive = i < fillLevel;
                            
                            return (
                                <div key={i} className={`flex-1 rounded-full ${isActive ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
                            );
                        })}
                    </div>
                    
                    <div className="flex justify-between w-full px-1">
                         {['THANK', 'YOU', 'FOR', 'YOUR', 'BUSINESS'].map((word, i) => (
                             <span key={i} className="text-[7px] text-slate-400 font-bold uppercase tracking-[0.25em]">{word}</span>
                         ))}
                    </div>
                </div>
            </div>

            {/* Realistic Tear/Cut Line */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-slate-300/60 z-20"></div>
            
            {/* Perforated Tear Edge with realistic jagged cut */}
            <div 
                className="absolute -bottom-[14px] left-0 right-0 h-[14px] z-20"
                style={{
                    background: 'linear-gradient(to bottom, #fffbf0, #fffaed)',
                }}
            >
                {/* Perforation dots along tear line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] flex">
                    {[...Array(40)].map((_, i) => (
                        <div 
                            key={i} 
                            className="flex-1 h-[2px]"
                            style={{
                                background: i % 2 === 0 ? '#d1d5db' : 'transparent',
                            }}
                        ></div>
                    ))}
                </div>
                
                {/* Jagged torn edge */}
                <div 
                    className="absolute top-[2px] left-0 right-0 h-[12px]"
                    style={{
                        maskImage: `url("data:image/svg+xml,%3Csvg width='100' height='12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 L2,3 L4,1 L7,4 L9,2 L12,5 L14,2 L17,4 L19,1 L22,5 L24,2 L27,4 L29,1 L32,5 L34,3 L37,5 L39,2 L42,4 L44,1 L47,5 L49,2 L52,4 L54,1 L57,5 L59,3 L62,5 L64,2 L67,4 L69,1 L72,5 L74,2 L77,4 L79,1 L82,5 L84,3 L87,5 L89,2 L92,4 L94,1 L97,5 L100,2 L100,12 L0,12 Z' fill='black'/%3E%3C/svg%3E")`,
                        maskSize: '100px 12px',
                        maskRepeat: 'repeat-x',
                        WebkitMaskImage: `url("data:image/svg+xml,%3Csvg width='100' height='12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 L2,3 L4,1 L7,4 L9,2 L12,5 L14,2 L17,4 L19,1 L22,5 L24,2 L27,4 L29,1 L32,5 L34,3 L37,5 L39,2 L42,4 L44,1 L47,5 L49,2 L52,4 L54,1 L57,5 L59,3 L62,5 L64,2 L67,4 L69,1 L72,5 L74,2 L77,4 L79,1 L82,5 L84,3 L87,5 L89,2 L92,4 L94,1 L97,5 L100,2 L100,12 L0,12 Z' fill='black'/%3E%3C/svg%3E")`,
                        WebkitMaskSize: '100px 12px',
                        WebkitMaskRepeat: 'repeat-x',
                    }}
                >
                    {/* Shadow on torn edge */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-400/20 to-transparent"></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};