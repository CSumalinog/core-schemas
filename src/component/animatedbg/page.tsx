// app/components/AnimatedBackground.tsx
'use client';

import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <motion.div
      initial={{ backgroundPosition: '0% 50%' }}
      animate={{ backgroundPosition: '100% 50%' }}
      transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
      className="absolute inset-0 z-0 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 bg-[length:200%_200%]"
    />
  );
}
