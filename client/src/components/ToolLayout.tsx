import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Link } from 'wouter';

interface ToolLayoutProps {
  title: string;
  children: React.ReactNode;
  onReset: () => void;
  backTo?: string;
}

export const ToolLayout = ({ title, children, onReset, backTo = "/" }: ToolLayoutProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href={backTo}>
          <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary -ml-2 group">
            <ChevronLeft className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back
          </Button>
        </Link>
        
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-display font-bold hidden sm:block opacity-80">{title}</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset} 
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            <RotateCcw size={14} className="mr-1" /> Reset
          </Button>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    </div>
  );
};
