
import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/utils/transitions';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const PageTransition = ({ children, className = "" }: PageTransitionProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeIn}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
