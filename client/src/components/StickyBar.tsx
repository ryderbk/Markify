import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Download, Save, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface StickyBarProps {
  onReset: () => void;
  onExport: () => void;
  onSave: () => void;
  onPrint: () => void;
}

export const StickyBar = ({ onReset, onExport, onSave, onPrint }: StickyBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 flex justify-center pointer-events-none">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
        className="glass-panel rounded-2xl p-2 flex items-center gap-2 pointer-events-auto max-w-md w-full justify-between shadow-2xl ring-1 ring-white/10"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onReset} className="hover:bg-destructive/10 hover:text-destructive rounded-xl transition-colors h-10 w-10">
                <RotateCcw size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Reset Form</p></TooltipContent>
          </Tooltip>

          <div className="w-px h-6 bg-border/50" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onExport} className="hover:bg-primary/10 hover:text-primary rounded-xl transition-colors h-10 w-10">
                <Download size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Export CSV</p></TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onSave} className="hover:bg-primary/10 hover:text-primary rounded-xl transition-colors h-10 w-10">
                <Save size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Save JSON</p></TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onPrint} className="hover:bg-primary/10 hover:text-primary rounded-xl transition-colors h-10 w-10">
                <Printer size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Print Result</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>
    </div>
  );
};
