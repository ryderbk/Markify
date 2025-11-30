import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { CustomInput } from '@/components/ui/custom-input';
import { Button } from '@/components/ui/button';
import { ToolLayout } from '@/components/ToolLayout';
import { safeParse } from '@/lib/calculator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Paper = {
  id: string;
  type: 'theory' | 'integrated';
  credits: number | undefined;
  internal: number | undefined;
  external: number | undefined; // Expected Semester Mark
};

export const GPAPredictor = () => {
  const [papers, setPapers] = useState<Paper[]>([
    { id: '1', type: 'theory', credits: undefined, internal: undefined, external: undefined }
  ]);
  const [gpa, setGpa] = useState<string | null>(null);

  const addPaper = () => {
    setPapers([...papers, { id: Date.now().toString(), type: 'theory', credits: undefined, internal: undefined, external: undefined }]);
  };

  const removePaper = (id: string) => {
    if (papers.length > 1) {
      setPapers(papers.filter(p => p.id !== id));
    }
  };

  const updatePaper = (id: string, field: keyof Paper, value: any) => {
    setPapers(papers.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    papers.forEach(p => {
      const credits = p.credits || 0;
      const internal = p.internal || 0;
      const external = p.external || 0;

      // Convert external to weightage
      // Theory: Internal (40) + External (60) [External 100 -> 60]
      // Integrated: Internal (50) + External (50) [External 100 -> 50]
      
      let finalMark = 0;
      if (p.type === 'theory') {
        finalMark = internal + (external / 100 * 60);
      } else {
        finalMark = internal + (external / 100 * 50);
      }

      // Grade Points (Standard 10 point scale approx)
      // O(10): 90-100, A+(9): 80-89, A(8): 70-79, B+(7): 60-69, B(6): 50-59, C(5): 40-49, F(0): <40
      // Using S/A/B/C/D/E notation from prompt logic request "Determine grade -> grade point"
      // I'll use: 90-100=10, 80-89=9, 70-79=8, 60-69=7, 50-59=6, 40-49=5, <40=0
      
      let gradePoint = 0;
      if (finalMark >= 90) gradePoint = 10;
      else if (finalMark >= 80) gradePoint = 9;
      else if (finalMark >= 70) gradePoint = 8;
      else if (finalMark >= 60) gradePoint = 7;
      else if (finalMark >= 50) gradePoint = 6;
      else if (finalMark >= 40) gradePoint = 5; // Pass?
      else gradePoint = 0;

      totalPoints += gradePoint * credits;
      totalCredits += credits;
    });

    if (totalCredits === 0) {
      setGpa("0.00");
    } else {
      setGpa((totalPoints / totalCredits).toFixed(2));
    }
  };

  const handleReset = () => {
    setPapers([{ id: '1', type: 'theory', credits: undefined, internal: undefined, external: undefined }]);
    setGpa(null);
  };

  return (
    <ToolLayout title="GPA Predictor" onReset={handleReset} backTo="/">
      <div className="space-y-6">
        <div className="space-y-4">
          {papers.map((paper, index) => (
            <motion.div 
              key={paper.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-4 rounded-xl space-y-4 relative"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-muted-foreground">Paper {index + 1}</h3>
                {papers.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removePaper(paper.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1 relative group space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">Type</label>
                  <Select value={paper.type} onValueChange={(v) => updatePaper(paper.id, 'type', v)}>
                    <SelectTrigger className="w-full h-14 px-5 rounded-2xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 shadow-sm text-base font-medium text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all duration-300 inline-flex items-center justify-between leading-[1.4]">
                      <SelectValue placeholder="Select type" className="text-base font-medium text-foreground" />
                    </SelectTrigger>
                    <SelectContent 
                      className="w-[var(--radix-select-trigger-width)] min-w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-white/10 rounded-2xl shadow-md z-50 p-1" 
                      position="popper" 
                      sideOffset={8}
                    >
                      <SelectItem value="theory" className="text-base font-medium py-2 px-4 rounded-lg cursor-pointer text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors duration-200 data-[state=checked]:bg-slate-100 dark:data-[state=checked]:bg-slate-800">Theory (Max 40)</SelectItem>
                      <SelectItem value="integrated" className="text-base font-medium py-2 px-4 rounded-lg cursor-pointer text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors duration-200 data-[state=checked]:bg-slate-100 dark:data-[state=checked]:bg-slate-800">Integrated (Max 50)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <CustomInput 
                  label="Credits" 
                  max={20} 
                  value={paper.credits ?? ''} 
                  onChange={(e) => updatePaper(paper.id, 'credits', safeParse(e.target.value))} 
                  className="sm:col-span-1"
                />
                
                <CustomInput 
                  label="Internal" 
                  max={paper.type === 'theory' ? 40 : 50} 
                  value={paper.internal ?? ''} 
                  onChange={(e) => updatePaper(paper.id, 'internal', safeParse(e.target.value))} 
                />
                
                <CustomInput 
                  label="Exp. Sem (100)" 
                  max={100} 
                  value={paper.external ?? ''} 
                  onChange={(e) => updatePaper(paper.id, 'external', safeParse(e.target.value))} 
                />
              </div>
            </motion.div>
          ))}
        </div>

        <Button variant="outline" onClick={addPaper} className="w-full border-dashed border-white/20 hover:border-primary">
          <Plus size={16} className="mr-2" /> Add Paper
        </Button>

        <Button className="w-full glass-button h-14 text-lg font-bold rounded-xl" onClick={calculateGPA}>
          Predict GPA
        </Button>

        {gpa && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 rounded-xl text-center border-primary/30 bg-primary/10"
          >
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Predicted GPA</p>
            <p className="text-6xl font-display font-bold text-primary">{gpa}</p>
          </motion.div>
        )}
      </div>
    </ToolLayout>
  );
};
