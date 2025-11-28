import React from 'react';
import { motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalculationResult } from '@/lib/calculator';
import { useToast } from '@/hooks/use-toast';

interface ResultCardProps {
  result: CalculationResult;
}

export const ResultCard = ({ result }: ResultCardProps) => {
  const { toast } = useToast();
  
  const handleCopy = () => {
    const text = `Total Internal Marks: ${result.total}/${result.maxTotal} (${result.message})`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "You can now paste your result anywhere.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", duration: 0.6 }}
      className="glass-card rounded-2xl p-6 md:p-8 text-center space-y-6 mt-6 relative overflow-hidden group"
    >
      {/* Background glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/30 transition-colors duration-700" />

      <div className="relative z-10">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-2">Final Internal Mark</h3>
        
        <div className="flex items-baseline justify-center gap-1 mb-2">
          <span className="text-6xl md:text-7xl font-display font-bold text-foreground tracking-tighter">
            {result.total}
          </span>
          <span className="text-2xl text-muted-foreground font-light">/ {result.maxTotal}</span>
        </div>

        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          className="h-3 bg-secondary rounded-full overflow-hidden mb-4 max-w-[200px] mx-auto"
        >
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${result.percentage}%` }}
            transition={{ delay: 0.3, duration: 1, type: "spring" }}
            className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full"
          />
        </motion.div>

        <p className="text-lg font-medium text-primary mb-6">{result.message}</p>

        <Button 
          variant="outline" 
          className="glass-button-secondary gap-2 rounded-full px-6 hover:scale-105 active:scale-95"
          onClick={handleCopy}
        >
          <Copy size={16} />
          Copy Summary
        </Button>
      </div>
    </motion.div>
  );
};
