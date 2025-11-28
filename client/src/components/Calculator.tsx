import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, Sparkles } from 'lucide-react';
import { CustomInput } from '@/components/ui/custom-input';
import { Button } from '@/components/ui/button';
import { ResultCard } from '@/components/ResultCard';
import { StickyBar } from '@/components/StickyBar';
import { useToast } from '@/hooks/use-toast';
import { 
  TheoryMarks, 
  IntegratedMarks, 
  calculateTheory, 
  calculateIntegrated, 
  safeParse, 
  CalculationResult 
} from '@/lib/calculator';

type FormType = 'welcome' | 'theory' | 'integrated';

// Default values - Assignments default to 10 (represented as 10 in state for clarity to user, 
// but if they clear it, it becomes undefined, which calculator treats as 10 too).
// Actually, to show "10" initially, we set it to 10.
const defaultTheory: TheoryMarks = {
  cie1: undefined, cie2: undefined, assignment1: 10, assignment2: 10, assignment3: 10, model: undefined
};

const defaultIntegrated: IntegratedMarks = {
  cie1: undefined, cie2: undefined, cie3: undefined, practical1: undefined, practical2: undefined, practical3: undefined
};

export const Calculator = () => {
  const [view, setView] = useState<FormType>('welcome');
  const [theoryData, setTheoryData] = useState<TheoryMarks>(defaultTheory);
  const [integratedData, setIntegratedData] = useState<IntegratedMarks>(defaultIntegrated);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const { toast } = useToast();

  // Reset result when changing views
  useEffect(() => {
    setResult(null);
  }, [view]);

  const handleCalculate = () => {
    if (view === 'theory') {
      const res = calculateTheory(theoryData);
      setResult(res);
    } else if (view === 'integrated') {
      const res = calculateIntegrated(integratedData);
      setResult(res);
    }
    
    // Accessibility announcement
    const message = view === 'theory' 
      ? `Calculated. Total is ${calculateTheory(theoryData).total} out of 40` 
      : `Calculated. Total is ${calculateIntegrated(integratedData).total} out of 50`;
    
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  const handleReset = () => {
    setTheoryData(defaultTheory);
    setIntegratedData(defaultIntegrated);
    setResult(null);
    toast({ title: "Form Reset", description: "All fields have been cleared to defaults." });
  };

  const handleExport = () => {
    const data = view === 'theory' ? theoryData : integratedData;
    // Handle undefined in CSV export - replace with 0 or blank
    const keys = Object.keys(data);
    const values = Object.values(data).map(v => v ?? '');
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + keys.join(",") + "\n" 
      + values.join(",");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "internal_marks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: "Exported", description: "CSV file downloaded successfully." });
  };

  const handleSave = () => {
    const data = {
      type: view,
      timestamp: new Date().toISOString(),
      marks: view === 'theory' ? theoryData : integratedData,
      result: result
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "internal_marks_snapshot.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: "Saved", description: "Snapshot saved as JSON." });
  };

  const handlePrint = () => {
    window.print();
  };

  // Load Sample Data
  const loadSample = () => {
    if (view === 'theory') {
      setTheoryData({
        cie1: 45, cie2: 42, assignment1: 9, assignment2: 10, assignment3: 8, model: 85
      });
    } else if (view === 'integrated') {
      setIntegratedData({
        cie1: 40, cie2: 38, cie3: 90, practical1: 45, practical2: 48, practical3: 95
      });
    }
    toast({ title: "Sample Data Loaded" });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {view === 'welcome' && (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 pt-8 text-center"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                Calculate Your Scores
              </h2>
              <p className="text-muted-foreground">Select your paper type to begin</p>
            </div>

            <div className="grid gap-4">
              <button
                onClick={() => setView('theory')}
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
                onClick={() => setView('integrated')}
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

            <div className="pt-4">
               {/* Optional buttons as text links or small ghost buttons */}
            </div>
          </motion.div>
        )}

        {(view === 'theory' || view === 'integrated') && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => setView('welcome')}
                className="pl-0 hover:bg-transparent hover:text-primary -ml-2"
              >
                <ChevronLeft className="mr-1" /> Back
              </Button>
              
              <Button variant="ghost" size="sm" onClick={loadSample} className="text-xs text-muted-foreground hover:text-primary">
                <Sparkles size={14} className="mr-1" /> Use Sample
              </Button>
            </div>

            <div className="space-y-4">
              {view === 'theory' ? (
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <CustomInput 
                      label="Assign 1" 
                      max={10} 
                      value={theoryData.assignment1 ?? ''} 
                      onChange={(e) => setTheoryData({...theoryData, assignment1: safeParse(e.target.value)})} 
                    />
                    <CustomInput 
                      label="Assign 2" 
                      max={10} 
                      value={theoryData.assignment2 ?? ''} 
                      onChange={(e) => setTheoryData({...theoryData, assignment2: safeParse(e.target.value)})} 
                    />
                    <CustomInput 
                      label="Assign 3" 
                      max={10} 
                      value={theoryData.assignment3 ?? ''} 
                      onChange={(e) => setTheoryData({...theoryData, assignment3: safeParse(e.target.value)})} 
                    />
                  </div>
                  <CustomInput 
                    label="Model Exam" 
                    max={100} 
                    value={theoryData.model ?? ''} 
                    onChange={(e) => setTheoryData({...theoryData, model: safeParse(e.target.value)})} 
                  />
                </div>
              ) : (
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>
                  <CustomInput 
                      label="CIE 3" 
                      max={100} 
                      value={integratedData.cie3 ?? ''} 
                      onChange={(e) => setIntegratedData({...integratedData, cie3: safeParse(e.target.value)})} 
                    />
                  <div className="grid grid-cols-2 gap-4">
                    <CustomInput 
                      label="Prac 1" 
                      max={50} 
                      value={integratedData.practical1 ?? ''} 
                      onChange={(e) => setIntegratedData({...integratedData, practical1: safeParse(e.target.value)})} 
                    />
                    <CustomInput 
                      label="Prac 2" 
                      max={50} 
                      value={integratedData.practical2 ?? ''} 
                      onChange={(e) => setIntegratedData({...integratedData, practical2: safeParse(e.target.value)})} 
                    />
                  </div>
                  <CustomInput 
                      label="Prac 3" 
                      max={100} 
                      value={integratedData.practical3 ?? ''} 
                      onChange={(e) => setIntegratedData({...integratedData, practical3: safeParse(e.target.value)})} 
                    />
                </div>
              )}

              <Button 
                className="w-full glass-button h-14 text-lg font-bold mt-6 rounded-xl"
                onClick={handleCalculate}
              >
                Calculate Internal Marks
              </Button>
            </div>

            {result && <ResultCard result={result} />}
            
            {/* Spacer for sticky bar */}
            <div className="h-20" />
            
            <StickyBar 
              onReset={handleReset} 
              onExport={handleExport} 
              onSave={handleSave} 
              onPrint={handlePrint} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
