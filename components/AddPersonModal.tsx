import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}

export const AddPersonModal: React.FC<AddPersonModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name);
      setName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl transform transition-all scale-100">
        <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
          <h3 className="font-semibold flex items-center gap-2">
            <UserPlus size={18} /> Add Friend
          </h3>
          <button onClick={onClose} className="hover:bg-slate-700 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Friend's Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sarah Johnson"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
            autoFocus
          />
          
          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 active:scale-95 transition-all"
          >
            Add to Trip
          </button>
        </form>
      </div>
    </div>
  );
};