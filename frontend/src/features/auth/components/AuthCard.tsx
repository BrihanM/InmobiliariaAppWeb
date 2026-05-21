import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-md"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-white/10 p-8">
        {children}
      </div>
    </motion.div>
  );
}
