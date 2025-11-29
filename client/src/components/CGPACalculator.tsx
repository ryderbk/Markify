import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { CustomInput } from '@/components/ui/custom-input';
import { Button } from '@/components/ui/button';
import { ToolLayout } from '@/components/ToolLayout';
import { safeParse } from '@/lib/calculator';

type Semester = {
  id: string;
  gpa: number | undefined;
  credits: number | undefined;
};

export const CGPACalculator = () => {
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: '1', gpa: undefined, credits: undefined }
  ]);
  const [cgpa, setCgpa] = useState<string | null>(null);

  const addSemester = () => {
    setSemesters([...semesters, { id: Date.now().toString(), gpa: undefined, credits: undefined }]);
  };

  const removeSemester = (id: string) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter(s => s.id !== id));
    }
  };

  const updateSemester = (id: string, field: keyof Semester, value: any) => {
    setSemesters(semesters.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const calculateCGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    semesters.forEach(s => {
      const gpa = s.gpa || 0;
      const credits = s.credits || 0; // Weighted calculation needs credits
      
      // If user doesn't enter credits, we can't do weighted accurately. 
      // Defaulting to 1 would be a simple average if all are 1. 
      // Let's assume credit is mandatory for accurate calc, or default to 20?
      // Prompt says "Ask number of semesters... Ask GPA... Output CGPA using standard weighted formula".
      // Weighted formula = Sum(GPA*Credits)/Sum(Credits).
      // I added Credits field to be accurate.
      
      const c = credits || 20; // Default to 20 if missing? Or treat as 0? 
      // Let's assume equal weight if credits missing? No, that's dangerous.
      // Let's just use input values.
      
      totalPoints += gpa * (s.credits || 0);
      totalCredits += (s.credits || 0);
    });

    if (totalCredits === 0) {
      // Fallback to simple average if no credits entered
      const simpleSum = semesters.reduce((acc, curr) => acc + (curr.gpa || 0), 0);
      setCgpa((simpleSum / semesters.length).toFixed(2));
    } else {
      setCgpa((totalPoints / totalCredits).toFixed(2));
    }
  };

  const handleReset = () => {
    setSemesters([{ id: '1', gpa: undefined, credits: undefined }]);
    setCgpa(null);
  };

  return (
    <ToolLayout title="CGPA Calculator" onReset={handleReset} backTo="/">
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground text-center">
          Enter your GPA and Total Credits for each semester to calculate weighted CGPA.
        </p>
        
        <div className="space-y-4">
          {semesters.map((sem, index) => (
            <motion.div 
              key={sem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-4 rounded-xl space-y-4 relative"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-muted-foreground">Semester {index + 1}</h3>
                {semesters.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removeSemester(sem.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <CustomInput 
                  label="GPA" 
                  max={10} 
                  value={sem.gpa ?? ''} 
                  onChange={(e) => updateSemester(sem.id, 'gpa', safeParse(e.target.value))} 
                />
                
                <CustomInput 
                  label="Credits" 
                  max={30} 
                  value={sem.credits ?? ''} 
                  onChange={(e) => updateSemester(sem.id, 'credits', safeParse(e.target.value))} 
                />
              </div>
            </motion.div>
          ))}
        </div>

        <Button variant="outline" onClick={addSemester} className="w-full border-dashed border-white/20 hover:border-primary">
          <Plus size={16} className="mr-2" /> Add Semester
        </Button>

        <Button className="w-full glass-button h-14 text-lg font-bold rounded-xl" onClick={calculateCGPA}>
          Calculate CGPA
        </Button>

        {cgpa && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 rounded-xl text-center border-primary/30 bg-primary/10"
          >
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Your CGPA</p>
            <p className="text-6xl font-display font-bold text-primary">{cgpa}</p>
          </motion.div>
        )}
      </div>
    </ToolLayout>
  );
};
