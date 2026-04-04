import { motion } from 'motion/react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6">
      <motion.div
        animate={{
          rotate: 360,
          borderRadius: ["20%", "20%", "50%", "50%", "20%"],
        }}
        transition={{
          duration: 2,
          ease: "linear",
          repeat: Infinity,
        }}
        className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-2xl"
      />
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-bold text-slate-900 tracking-widest uppercase">Loading</h3>
        <p className="text-slate-500 text-xs font-medium animate-pulse">Preparing your journey...</p>
      </div>
    </div>
  );
}
