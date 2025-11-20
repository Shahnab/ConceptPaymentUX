import React from 'react';
import { ArrowLeft, Users, DollarSign } from 'lucide-react';
import { Participant, TripDetails } from '../types';

interface ConfirmationPageProps {
  participants: Participant[];
  tripDetails: TripDetails;
  onConfirm: () => void;
  onBack: () => void;
}

export const ConfirmationPage: React.FC<ConfirmationPageProps> = ({
  participants,
  tripDetails,
  onConfirm,
  onBack
}) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const currentUser = participants.find(p => p.isCurrentUser);

  return (
    <>
      {/* Background layers - fixed to viewport */}
      <div className="fixed inset-0 bg-[#0a0a0a] z-0">
        {/* Base gradient layer */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#1a1a1a_0%,#000000_100%)]"></div>
        
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.2),transparent_50%)] animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.18),transparent_50%)] animate-pulse" style={{ animationDuration: '6s' }}></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_80%,rgba(16,185,129,0.12),transparent_50%)] animate-pulse" style={{ animationDuration: '7s' }}></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,rgba(236,72,153,0.1),transparent_50%)] animate-pulse" style={{ animationDuration: '9s' }}></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-[10%] left-[15%] w-1 h-1 bg-blue-400 rounded-full blur-[1px] animate-pulse" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-[60%] left-[80%] w-1 h-1 bg-purple-400 rounded-full blur-[1px] animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute top-[30%] right-[20%] w-1 h-1 bg-emerald-400 rounded-full blur-[1px] animate-pulse" style={{ animationDuration: '5s' }}></div>
          <div className="absolute bottom-[20%] left-[40%] w-1 h-1 bg-pink-400 rounded-full blur-[1px] animate-pulse" style={{ animationDuration: '3.5s' }}></div>
        </div>
        
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] pointer-events-none mix-blend-overlay"></div>
        
        {/* Floating orbs with blur */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/[0.15] rounded-full blur-[150px] animate-pulse pointer-events-none" style={{ animationDuration: '5s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/[0.15] rounded-full blur-[150px] animate-pulse pointer-events-none" style={{ animationDuration: '7s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/[0.08] rounded-full blur-[160px] pointer-events-none"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] pointer-events-none"></div>
        
        {/* Scanline effect */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.01)_50%)] bg-[size:100%_4px] pointer-events-none"></div>
        
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none"></div>
        
        {/* Spotlight effect from top center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-transparent pointer-events-none"></div>
        
        {/* Subtle side lighting */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[300px] h-full bg-gradient-to-r from-blue-500/[0.03] to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] h-full bg-gradient-to-l from-purple-500/[0.03] to-transparent pointer-events-none"></div>
      </div>

      <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative z-10">
      
      
      {/* Mobile Container - Fixed Height */}
      <div className="w-full max-w-[400px] h-[850px] bg-[#f3f4f6] rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-white relative flex flex-col">
        
        {/* Top Bar */}
        <header className="px-6 pt-12 pb-6 flex justify-between items-center z-30 bg-[#f3f4f6] relative shrink-0">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-[#f3f4f6] rounded-full flex items-center justify-center shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] transition-all duration-200 group"
          >
            <ArrowLeft size={20} className="text-slate-600 group-hover:scale-105 transition-transform" />
          </button>
          
          <h1 className="text-lg font-bold text-slate-800 tracking-tight drop-shadow-[1px_1px_0px_rgba(255,255,255,1)]">
            Confirm Payment
          </h1>
          
          <div className="w-10 h-10"></div>
        </header>

        {/* Main Content - No Scroll Needed */}
        <div className="flex-1 flex flex-col justify-between px-6 pb-6">
          
          <div className="space-y-6 mt-4">
            
            {/* Trip Title */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Japan Event 2025</h2>
              <p className="text-sm text-slate-500">Group Trip Payment</p>
            </div>

            {/* Payment Summary - Minimal Card */}
            <div className="bg-white rounded-2xl p-6 shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff] border border-slate-100">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Total Trip Cost</span>
                  <span className="text-lg font-bold text-slate-800">{formatCurrency(tripDetails.totalAmount)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users size={16} />
                    <span>{participants.length} {participants.length === 1 ? 'person' : 'people'}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{formatCurrency(tripDetails.perPersonAmount)} each</span>
                </div>
                
                <div className="h-px bg-slate-200 my-3"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-800">Your Share</span>
                  <span className="text-2xl font-bold text-slate-900">{formatCurrency(tripDetails.perPersonAmount)}</span>
                </div>
              </div>
            </div>

            {/* Participants - Compact List */}
            <div className="bg-white rounded-2xl p-5 shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff] border border-slate-100">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Participants</h3>
              <div className="flex flex-wrap gap-2">
                {participants.map((person) => (
                  <div key={person.id} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                    <img 
                      src={person.avatar} 
                      className="w-6 h-6 rounded-full object-cover border border-slate-200" 
                      alt={person.name} 
                    />
                    <span className="text-sm text-slate-700">
                      {person.name}
                      {person.isCurrentUser && <span className="text-slate-400 ml-1">(You)</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method - Minimal */}
            <div className="bg-white rounded-2xl p-5 shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff] border border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-7 bg-slate-900 rounded flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white italic">VISA</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">**** 2986</p>
                    <p className="text-xs text-slate-500">Visa Credit</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Action */}
          <div className="mt-8 shrink-0">
            <button 
              onClick={onConfirm}
              className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-2xl shadow-xl shadow-slate-300 hover:bg-slate-800 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <DollarSign size={24} />
              Pay Now
            </button>
            
            <p className="text-center text-xs text-slate-400 mt-4">
              Secure payment · Protected transaction
            </p>
          </div>

        </div>

      </div>
    </div>
    </>
  );
};

