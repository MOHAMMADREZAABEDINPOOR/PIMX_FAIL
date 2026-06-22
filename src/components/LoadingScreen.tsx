import React from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  theme: 'light' | 'dark';
  t: { loadingText: string; loadingSubtext: string };
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ theme, t }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 flex flex-col items-center justify-center z-50 ${
        theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
      }`}
    >
      {/* Floating Skull Animation */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 3, -3, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
          ease: "easeInOut",
        }}
        className="mb-8"
      >
        <span className="text-8xl">💀</span>
      </motion.div>

      {/* Loading Text */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`text-3xl font-bold mb-2 ${
          theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
        }`}
      >
        {t.loadingText}
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`text-lg ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
        }`}
      >
        {t.loadingSubtext}
      </motion.p>

      {/* Spinner Dots */}
      <motion.div
        className="flex gap-2 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`w-3 h-3 rounded-full ${
              theme === 'dark' ? 'bg-violet-500' : 'bg-violet-600'
            }`}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
