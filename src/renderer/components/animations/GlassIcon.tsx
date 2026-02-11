import React from 'react';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassIconProps {
  icon: ReactNode;
  label: string;
  color?: string;
  onClick?: () => void;
  className?: string;
}

const gradientMapping: Record<string, string> = {
  blue: 'linear-gradient(135deg, hsl(223, 90%, 55%), hsl(208, 90%, 50%))',
  purple: 'linear-gradient(135deg, hsl(283, 90%, 55%), hsl(268, 90%, 50%))',
  red: 'linear-gradient(135deg, hsl(3, 90%, 55%), hsl(348, 90%, 50%))',
  green: 'linear-gradient(135deg, hsl(123, 90%, 45%), hsl(108, 90%, 40%))',
  orange: 'linear-gradient(135deg, hsl(43, 90%, 55%), hsl(28, 90%, 50%))',
  indigo: 'linear-gradient(135deg, hsl(253, 90%, 55%), hsl(238, 90%, 50%))'
};

const GlassIcon = ({ icon, label, color = 'blue', onClick, className = '' }: GlassIconProps) => {
  const getBackgroundStyle = (colorKey: string): React.CSSProperties => {
    if (gradientMapping[colorKey]) {
      return { background: gradientMapping[colorKey] };
    }
    return { background: colorKey };
  };

  return (
    <motion.button
      onClick={onClick}
      className={`glass-icon-btn ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      aria-label={label}
    >
      <motion.span
        className="glass-icon-back"
        style={getBackgroundStyle(color)}
        whileHover={{
          transform: 'rotate(25deg) translate3d(-0.5em, -0.5em, 0.5em)',
          transition: { duration: 0.3, ease: [0.83, 0, 0.17, 1] }
        }}
      />
      <motion.span
        className="glass-icon-front"
        whileHover={{
          transform: 'translate3d(0, 0, 2em)',
          transition: { duration: 0.3, ease: [0.83, 0, 0.17, 1] }
        }}
      >
        <span className="glass-icon-symbol">{icon}</span>
      </motion.span>
      <motion.span
        className="glass-icon-label"
        initial={{ opacity: 0, y: 0 }}
        whileHover={{
          opacity: 1,
          y: '20%',
          transition: { duration: 0.3, ease: [0.83, 0, 0.17, 1] }
        }}
      >
        {label}
      </motion.span>
    </motion.button>
  );
};

export default GlassIcon;
