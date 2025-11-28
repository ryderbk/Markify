import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  max: number;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: number;
}

export const CustomInput = ({ label, max, value, onChange, className, ...props }: CustomInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // Allow empty string for clearing
    if (val === '') {
      setError(null);
      onChange(e);
      return;
    }

    // Integer only check
    if (!/^\d+$/.test(val)) {
      return; // Ignore non-digits
    }

    const numVal = parseInt(val, 10);

    if (numVal > max) {
      setError(`Max value is ${max}`);
      // Optional: Clamp immediately or let them type but show error?
      // Requirements: "If input > max -> clamp to max + show a small validation message."
      // So we clamp it in the event sent to parent, but maybe show the clamped value?
      
      // Let's trigger the change with the max value
      e.target.value = max.toString();
      onChange(e);
      
      // Clear error after 2 seconds
      setTimeout(() => setError(null), 2000);
    } else {
      setError(null);
      onChange(e);
    }
  };

  return (
    <div className={cn("relative group space-y-1.5", className)}>
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">
          {label}
        </label>
        <span className="text-xs text-muted-foreground/50 font-mono">Max: {max}</span>
      </div>
      
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onWheel={(e) => e.currentTarget.blur()} // Prevent scroll changing
          className={cn(
            "w-full h-12 px-4 rounded-xl bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/10",
            "text-lg font-semibold text-foreground placeholder:text-muted-foreground/30",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
            "transition-all duration-300 backdrop-blur-sm",
            error && "border-destructive/50 focus:ring-destructive/20"
          )}
          {...props}
        />
        
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive"
            >
              <AlertCircle size={18} />
            </motion.div>
          )}
          {!error && value && Number(value) === max && (
             <motion.div
             initial={{ opacity: 0, scale: 0.5 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.5 }}
             className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500/80"
           >
             <CheckCircle2 size={18} />
           </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-destructive font-medium ml-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
