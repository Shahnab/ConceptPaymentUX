import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share, UserPlus, CreditCard, CheckCircle2, Loader2 } from 'lucide-react';
import { Receipt } from './components/Receipt';
import { AddPersonModal } from './components/AddPersonModal';
import { ConfirmationPage } from './components/ConfirmationPage';
import { Participant, TripDetails } from './types';
import { generateReminderMessage } from './services/geminiService';

// Initial Mock Data
const INITIAL_TRIP: TripDetails = {
  title: "Trip Invoice – Japan Event 2025",
  totalAmount: 1500,
  perPersonAmount: 500,
  currency: "USD"
};

const INITIAL_PARTICIPANTS: Participant[] = [
  { id: '1', name: 'You', avatar: 'https://picsum.photos/id/64/100/100', status: 'paid', amount: 500, isCurrentUser: true },
  { id: '2', name: 'Nguyen', avatar: 'https://picsum.photos/id/91/100/100', status: 'paid', amount: 500 },
  { id: '3', name: 'Diem', avatar: 'https://picsum.photos/id/121/100/100', status: 'paid', amount: 500 },
];

function App() {
  const [currentPage, setCurrentPage] = useState<'confirmation' | 'receipt'>('confirmation');
  const [isPrinting, setIsPrinting] = useState(false);
  const [printingProgress, setPrintingProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [tripDetails, setTripDetails] = useState<TripDetails>(INITIAL_TRIP);
  const [remindingId, setRemindingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isToastSuccess, setIsToastSuccess] = useState(false);

  const allPaid = participants.every(p => p.status === 'paid');
  const isPrintComplete = printingProgress >= 100;

  // Trigger printing animation on mount and handle progress
  useEffect(() => {
    let progressInterval: any;

    if (isPrinting && currentPage === 'receipt') {
        // Reset progress when printing starts
        setPrintingProgress(0);
        
        // Duration set to 3000ms (3 seconds) for realistic printing feel
        const duration = 3000; 
        const startTime = Date.now();

        progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            setPrintingProgress(progress);

            if (progress >= 100) {
                clearInterval(progressInterval);
                // Don't show toast anymore - success state is shown in button
            }
        }, 16); // ~60fps update
    } else {
        setPrintingProgress(0);
    }

    return () => {
        if (progressInterval) clearInterval(progressInterval);
    };
  }, [isPrinting, currentPage]);

  // Initial print trigger - removed, now triggered by confirmation
  // useEffect(() => {
  //   const timer = setTimeout(() => setIsPrinting(true), 500);
  //   return () => clearTimeout(timer);
  // }, []);

  // Recalculate totals when participants change
  useEffect(() => {
    const newTotal = participants.length * 500; // Simplified logic: fixed per person
    setTripDetails(prev => ({
      ...prev,
      totalAmount: newTotal
    }));
  }, [participants]);

  const handleAddPerson = (name: string) => {
    const newPerson: Participant = {
      id: Date.now().toString(),
      name,
      avatar: `https://picsum.photos/seed/${name}/100/100`,
      status: 'unpaid',
      amount: tripDetails.perPersonAmount
    };
    
    // Retract paper slightly for visual effect before printing new list
    setIsPrinting(false);
    setToastMessage(null); // Clear any existing toasts
    setTimeout(() => {
        setParticipants(prev => [...prev, newPerson]);
        setIsPrinting(true);
    }, 600);
  };

  const handleConfirmPayment = () => {
    setCurrentPage('receipt');
    // Small delay before starting print animation
    setTimeout(() => {
      setIsPrinting(true);
    }, 500);
  };

  const handleBackToConfirmation = () => {
    setCurrentPage('confirmation');
    setIsPrinting(false);
    setPrintingProgress(0);
  };

  const handleRemind = async (participant: Participant) => {
    setRemindingId(participant.id);
    try {
        const message = await generateReminderMessage('You', participant.name, 'Japan Trip', '$500');
        setToastMessage(`Generated Message: "${message}"`);
        setIsToastSuccess(false);
        setTimeout(() => setToastMessage(null), 5000);
    } catch (e) {
        setToastMessage("Failed to generate reminder.");
        setIsToastSuccess(false);
    } finally {
        setRemindingId(null);
    }
  };

  return (
    <>
      {currentPage === 'confirmation' ? (
        <ConfirmationPage
          participants={participants}
          tripDetails={tripDetails}
          onConfirm={handleConfirmPayment}
          onBack={handleBackToConfirmation}
        />
      ) : (
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
        
        {/* Top Bar - Updated with 3D Neomorphic Effect */}
        <header className="px-6 pt-8 pb-4 flex justify-between items-center z-30 bg-[#f3f4f6] relative shrink-0">
          <button 
            onClick={handleBackToConfirmation}
            className="w-10 h-10 bg-[#f3f4f6] rounded-full flex items-center justify-center shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] transition-all duration-200 group"
          >
            <ArrowLeft size={20} className="text-slate-600 group-hover:scale-105 transition-transform" />
          </button>
          
          <h1 className="text-lg font-bold text-slate-800 tracking-tight drop-shadow-[1px_1px_0px_rgba(255,255,255,1)]">
            Payment Status
          </h1>
          
          <button className="w-10 h-10 bg-[#f3f4f6] rounded-full flex items-center justify-center shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] transition-all duration-200 group">
            <Share size={20} className="text-slate-600 group-hover:scale-105 transition-transform" />
          </button>
        </header>

        {/* Main Content Area - No Scroll */}
        <div className="flex-1 flex flex-col justify-start relative px-5 overflow-hidden pt-8 pb-2">
          
          {/* The Printer & Receipt Component */}
          <div className="w-full mb-2">
            <Receipt 
                participants={participants} 
                tripDetails={tripDetails}
                isPrinting={isPrinting}
                printingProgress={printingProgress}
                onRemind={handleRemind}
                remindingId={remindingId}
            />
          </div>

          {/* Add Person Action - Only visible when printing is complete */}
          <div 
            className={`flex justify-center mt-6 mb-4 transition-all duration-700 ease-out ${isPrintComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
          >
             <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors bg-white px-4 py-2.5 rounded-full shadow-md border border-slate-200 hover:shadow-lg hover:border-slate-300 active:scale-95 z-50 relative"
             >
                <UserPlus size={16} /> Add another friend
             </button>
          </div>

        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md p-6 border-t border-slate-100 z-40 rounded-b-[32px] shrink-0">
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-slate-500 font-medium">Payment Method</span>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-700 font-semibold">Visa Ending 2986</span>
                    <div className="w-8 h-5 bg-blue-700 rounded text-white flex items-center justify-center text-[8px] font-bold italic">VISA</div>
                </div>
            </div>
            
            {!isPrintComplete ? (
                <button 
                    disabled
                    className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-2xl shadow-xl shadow-slate-200 cursor-wait flex items-center justify-center gap-3 opacity-90"
                >
                    <Loader2 size={24} className="animate-spin text-blue-400" /> 
                    <span>Payment Processing...</span>
                </button>
            ) : allPaid ? (
                <button 
                    disabled
                    className="w-full bg-emerald-600 text-white font-bold text-lg py-4 rounded-2xl shadow-xl shadow-emerald-100 cursor-default flex items-center justify-center gap-2 opacity-90 animate-in zoom-in duration-300"
                >
                    <CheckCircle2 size={24} /> Payment Successful
                </button>
            ) : (
                <button className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 active:scale-98 transition-all flex items-center justify-center gap-2">
                    Pay Now
                </button>
            )}
        </div>

        {/* Toast Notification */}
        {toastMessage && (
            <div className={`absolute top-20 left-1/2 -translate-x-1/2 backdrop-blur-lg text-white text-sm px-5 py-3 rounded-full z-50 shadow-2xl flex items-center gap-2.5 transition-all duration-300 ${isToastSuccess ? 'bg-emerald-600/95' : 'bg-slate-900/95'}`}>
                {isToastSuccess && <CheckCircle2 className="shrink-0 text-white" size={18} />}
                <span className="font-medium">{toastMessage}</span>
            </div>
        )}

      </div>

      {/* Modals */}
      <AddPersonModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddPerson} 
      />
          </div>
        </>
      )}
    </>
  );
}

export default App;