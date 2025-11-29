import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { CustomInput } from '@/components/ui/custom-input';
import { Button } from '@/components/ui/button';
import { ResultCard } from '@/components/ResultCard';
import { ToolLayout } from '@/components/ToolLayout';
import { useToast } from '@/hooks/use-toast';
import { 
  TheoryMarks, 
  IntegratedMarks, 
  calculateTheory, 
  calculateIntegrated, 
  safeParse, 
  CalculationResult 
} from '@/lib/calculator';

type FormType = 'theory' | 'integrated';

const defaultTheory: TheoryMarks = {
  cie1: undefined, cie2: undefined, assignment1: undefined, assignment2: undefined, assignment3: undefined, model: undefined
};

const defaultIntegrated: IntegratedMarks = {
  cie1: undefined, cie2: undefined, cie3: undefined, practical1: undefined, practical2: undefined, practical3: undefined
};

export const InternalScore = () => {
  const [mode, setMode] = useState<FormType | null>(null);
  const [theoryData, setTheoryData] = useState<TheoryMarks>(defaultTheory);
  const [integratedData, setIntegratedData] = useState<IntegratedMarks>(defaultIntegrated);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const { toast } = useToast();

  const handleCalculate = () => {
    if (mode === 'theory') {
      setResult(calculateTheory(theoryData));
    } else if (mode === 'integrated') {
      setResult(calculateIntegrated(integratedData));
    }
  };

  const handleReset = () => {
    setTheoryData(defaultTheory);
    setIntegratedData(defaultIntegrated);
    setResult(null);
    toast({ title: "Reset", description: "Fields cleared." });
  };

  if (!mode) {
    return (
      <ToolLayout title="Internal Score" onReset={() => {}} backTo="/">
        <div className="space-y-6 text-center pt-4">
           <h2 className="text-2xl font-display font-bold">Select Paper Type</h2>
           <div className="grid gap-4">
              <button
                onClick={() => setMode('theory')}
                className="group relative overflow-hidden p-6 rounded-2xl glass-card text-left hover:border-primary/50 transition-all duration-300 hover:shadow-primary/10 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold font-display">Theory</h3>
                    <p className="text-sm text-muted-foreground mt-1">Max Internal: 40</p>
                  </div>
                  <ArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                </div>
              </button>

              <button
                onClick={() => setMode('integrated')}
                className="group relative overflow-hidden p-6 rounded-2xl glass-card text-left hover:border-primary/50 transition-all duration-300 hover:shadow-primary/10 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold font-display">Integrated / TI</h3>
                    <p className="text-sm text-muted-foreground mt-1">Max Internal: 50</p>
                  </div>
                  <ArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-blue-500" />
                </div>
              </button>
            </div>
        </div>
      </ToolLayout>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header handled manually here to allow Back to switch modes if desired, 
          but requirement says "Back button to return to welcome screen" (Home).
          However, inside the tool, maybe back goes to Mode selection? 
          Let's assume Back goes to Home as per "Back + Reset (only inside tool pages)".
          Actually, if I'm in "Theory", Back should probably go to Mode selection or Home?
          Let's make Back go to Mode selection if mode is selected.
      */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary -ml-2 group" onClick={() => {
          if (mode) {
            setMode(null);
            setResult(null);
          }
        }}>
          <ChevronLeft className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back
        </Button>
        
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-display font-bold opacity-80">{mode === 'theory' ? 'Theory' : 'Integrated'}</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset} 
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            <RotateCcw size={14} className="mr-1" /> Reset
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        {mode === 'theory' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4 order-1">
              <CustomInput 
                label="CIE 1" 
                max={50} 
                value={theoryData.cie1 ?? ''} 
                onChange={(e) => setTheoryData({...theoryData, cie1: safeParse(e.target.value)})} 
              />
              <CustomInput 
                label="CIE 2" 
                max={50} 
                value={theoryData.cie2 ?? ''} 
                onChange={(e) => setTheoryData({...theoryData, cie2: safeParse(e.target.value)})} 
              />
              <CustomInput 
                label="MODEL" 
                max={100} 
                value={theoryData.model ?? ''} 
                onChange={(e) => setTheoryData({...theoryData, model: safeParse(e.target.value)})} 
              />
            </div>
            <div className="space-y-4 order-2">
              <CustomInput 
                label="ASS 1" 
                max={10} 
                value={theoryData.assignment1 ?? ''} 
                onChange={(e) => setTheoryData({...theoryData, assignment1: safeParse(e.target.value)})} 
              />
              <CustomInput 
                label="ASS 2" 
                max={10} 
                value={theoryData.assignment2 ?? ''} 
                onChange={(e) => setTheoryData({...theoryData, assignment2: safeParse(e.target.value)})} 
              />
              <CustomInput 
                label="ASS 3" 
                max={10} 
                value={theoryData.assignment3 ?? ''} 
                onChange={(e) => setTheoryData({...theoryData, assignment3: safeParse(e.target.value)})} 
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4 order-1">
              <CustomInput 
                label="CIE 1" 
                max={50} 
                value={integratedData.cie1 ?? ''} 
                onChange={(e) => setIntegratedData({...integratedData, cie1: safeParse(e.target.value)})} 
              />
              <CustomInput 
                label="CIE 2" 
                max={50} 
                value={integratedData.cie2 ?? ''} 
                onChange={(e) => setIntegratedData({...integratedData, cie2: safeParse(e.target.value)})} 
              />
              <CustomInput 
                label="MODEL / CIE 3" 
                max={100} 
                value={integratedData.cie3 ?? ''} 
                onChange={(e) => setIntegratedData({...integratedData, cie3: safeParse(e.target.value)})} 
              />
            </div>
            <div className="space-y-4 order-2">
              <CustomInput 
                label="PRT 1" 
                max={50} 
                value={integratedData.practical1 ?? ''} 
                onChange={(e) => setIntegratedData({...integratedData, practical1: safeParse(e.target.value)})} 
              />
              <CustomInput 
                label="PRT 2" 
                max={50} 
                value={integratedData.practical2 ?? ''} 
                onChange={(e) => setIntegratedData({...integratedData, practical2: safeParse(e.target.value)})} 
              />
              <CustomInput 
                label="PRT 3" 
                max={100} 
                value={integratedData.practical3 ?? ''} 
                onChange={(e) => setIntegratedData({...integratedData, practical3: safeParse(e.target.value)})} 
              />
            </div>
          </div>
        )}

        <Button 
          className="w-full glass-button h-14 text-lg font-bold mt-6 rounded-xl"
          onClick={handleCalculate}
        >
          Calculate Internal Marks
        </Button>

        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <ResultCard result={result} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
