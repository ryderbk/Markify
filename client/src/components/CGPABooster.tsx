import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Trash2, Plus, Rocket } from 'lucide-react';
import { CustomInput } from '@/components/ui/custom-input';
import { Button } from '@/components/ui/button';
import { ToolLayout } from '@/components/ToolLayout';
import { safeParse } from '@/lib/calculator';

type CompletedSemester = {
  id: string;
  gpa: string;
};

export const CGPABooster = () => {
  const [targetCGPA, setTargetCGPA] = useState<string>('');
  const [completedSemesters, setCompletedSemesters] = useState<CompletedSemester[]>([
    { id: '1', gpa: '' }
  ]);
  const [remainingSemesters, setRemainingSemesters] = useState<number | undefined>(undefined);
  const [requiredGPA, setRequiredGPA] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const addSemester = () => {
    if (completedSemesters.length >= 8) return;
    setCompletedSemesters([...completedSemesters, { id: Date.now().toString(), gpa: '' }]);
  };

  const removeSemester = (id: string) => {
    if (completedSemesters.length > 1) {
      setCompletedSemesters(completedSemesters.filter(s => s.id !== id));
    }
  };

  const updateSemester = (id: string, value: string) => {
    setCompletedSemesters(completedSemesters.map(s => s.id === id ? { ...s, gpa: value } : s));
  };

  const calculateRequiredGPA = () => {
    const parsedTarget = parseFloat(targetCGPA);
    if (!targetCGPA || isNaN(parsedTarget)) return;

    // Formula:
    // Required GPA = (Target CGPA * Total Semesters - Sum of Completed GPAs) / Remaining Semesters
    
    const numCompleted = completedSemesters.length;
    const numRemaining = 8 - numCompleted;
    
    if (numRemaining <= 0) {
      setRequiredGPA("Completed");
      setMessage("You have already completed all semesters.");
      return;
    }
    
    const totalSemesters = 8;
    
    const sumCompletedGPA = completedSemesters.reduce((acc, curr) => acc + (parseFloat(curr.gpa) || 0), 0);
    
    const requiredTotalPoints = parsedTarget * totalSemesters;
    const neededPoints = requiredTotalPoints - sumCompletedGPA;
    
    const reqGPA = neededPoints / numRemaining;

    if (reqGPA > 10) {
      setRequiredGPA("Impossible");
      setMessage("Even with a perfect 10 in all remaining semesters, this target is mathematically impossible.");
    } else if (reqGPA < 0) {
      setRequiredGPA("Achieved");
      setMessage("You have already achieved your target CGPA!");
    } else {
      setRequiredGPA(reqGPA.toFixed(2));
      
      if (reqGPA > 9) setMessage("It will be tough, but you can do it!");
      else if (reqGPA > 8) setMessage("Aim high and stay consistent.");
      else if (reqGPA > 7) setMessage("You're on the right track.");
      else setMessage("Achievable with steady effort.");
    }
  };

  const handleReset = () => {
    setTargetCGPA('');
    setCompletedSemesters([{ id: '1', gpa: '' }]);
    setRequiredGPA(null);
    setMessage(null);
  };

  return (
    <ToolLayout title="CGPA Booster" onReset={handleReset} backTo="/">
      <div className="space-y-8 pb-12">
        {/* Step 1: Target */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
             <Rocket className="text-primary" size={20} /> Target
          </h3>
          <CustomInput 
            label="Target Final CGPA (0-10)" 
            max={10} 
            value={targetCGPA} 
            onChange={(e) => setTargetCGPA(e.target.value)} 
          />
        </div>

        {/* Step 2: Completed Semesters */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="font-bold text-lg">Completed Semesters</h3>
          <div className="space-y-3">
            {completedSemesters.map((sem, index) => (
              <div key={sem.id} className="flex items-end gap-2">
                <div className="flex-1">
                  <CustomInput 
                    label={`Semester ${index + 1} GPA`} 
                    max={10} 
                    value={sem.gpa} 
                    onChange={(e) => updateSemester(sem.id, e.target.value)} 
                  />
                </div>
                {completedSemesters.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeSemester(sem.id)}
                    className="h-14 w-14 rounded-2xl text-destructive hover:bg-destructive/10 border border-destructive/20"
                  >
                    <Trash2 size={20} />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button 
            variant="outline" 
            onClick={addSemester} 
            disabled={completedSemesters.length >= 8}
            className="w-full border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 text-primary h-12 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} className="mr-2" /> {completedSemesters.length >= 8 ? "Maximum is 8 semesters" : "Add Semester"}
          </Button>
        </div>

        <Button 
          className="w-full glass-button h-14 text-lg font-bold rounded-2xl"
          onClick={calculateRequiredGPA}
          disabled={completedSemesters.length >= 8}
        >
          Calculate Required GPA
        </Button>

        {/* Result Card */}
        <AnimatePresence>
          {requiredGPA && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-8 rounded-3xl text-center border-primary/30 bg-gradient-to-b from-primary/10 to-transparent relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10" />
              
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">Required GPA</h3>
              
              <div className="mb-4">
                <span className="text-5xl md:text-6xl font-display font-bold text-primary tracking-tighter">
                  {requiredGPA}
                </span>
                {requiredGPA !== "Impossible" && requiredGPA !== "Achieved" && (
                  <span className="text-lg text-muted-foreground ml-2">/ sem</span>
                )}
              </div>

              <p className="text-lg font-medium text-foreground/80">{message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToolLayout>
  );
};
