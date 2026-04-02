import { motion } from 'motion/react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
        />
        <div className="mt-4 text-slate-500 font-medium text-center">Loading TravelBus...</div>
      </div>
    </div>
  );
}
