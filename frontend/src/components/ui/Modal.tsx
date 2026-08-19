import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-200/50 w-full max-w-xl overflow-hidden pointer-events-auto border border-slate-100"
            >
              <div className="relative">
                <button 
                  onClick={onClose}
                  className="absolute top-8 right-8 p-2 rounded-full hover:bg-slate-50 transition-colors z-10"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};