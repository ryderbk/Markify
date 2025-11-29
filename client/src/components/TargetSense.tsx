import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { CustomInput } from '@/components/ui/custom-input';
import { Button } from '@/components/ui/button';
import { ToolLayout } from '@/components/ToolLayout';
import { useToast } from '@/hooks/use-toast';
import { safeParse } from '@/lib/calculator';

type FormType = 'theory' | 'integrated';

export const TargetSense = () => {
  const [mode, setMode] = useState<FormType | null>(null);
  const [target, setTarget] = useState<number | undefined>(undefined);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  
  // State for inputs
  const [inputs, setInputs] = useState<Record<string, number | undefined>>({});

  const updateInput = (key: string, val: string | number) => {
    setInputs(prev => ({ ...prev, [key]: safeParse(val) }));
  };

  const handleReset = () => {
    setInputs({});
    setTarget(undefined);
    setResultMessage(null);
  };

  const handleBack = () => {
    if (mode) {
      setMode(null);
      handleReset();
    }
  };

  const calculateTarget = () => {
    if (!target) return;

    const t = target;
    
    if (mode === 'theory') {
      // Formula: Total = (C1/50*8) + (C2/50*8) + (A1/10*4) + (A2/10*4) + (A3/10*6) + (Model/100*10)
      // Target = Knowns + (Model/100 * 10)
      // Model = (Target - Knowns) * 10
      
      const c1 = ((inputs.cie1 ?? 0) / 50) * 8;
      const c2 = ((inputs.cie2 ?? 0) / 50) * 8;
      const a1 = ((inputs.ass1 ?? 0) / 10) * 4;
      const a2 = ((inputs.ass2 ?? 0) / 10) * 4;
      const a3 = ((inputs.ass3 ?? 0) / 10) * 6;
      
      const knowns = c1 + c2 + a1 + a2 + a3;
      const neededFromModel = t - knowns;
      
      // neededFromModel = (Model/100) * 10
      // Model = neededFromModel * 10
      const requiredModel = neededFromModel * 10;
      
      if (requiredModel <= 0) {
        setResultMessage("Target already achieved! You don't need any marks in Model.");
      } else if (requiredModel > 100) {
        setResultMessage(`Impossible target. You would need ${requiredModel.toFixed(1)}/100 in Model.`);
      } else {
        setResultMessage(`You need ${Math.ceil(requiredModel)}/100 in Model Exam.`);
      }
    } else {
      // Integrated
      // Formula: Total = (C1/50*7) + (C2/50*7) + (C3/100*11) + (P1/50*7) + (P2/50*7) + (P3/100*11)
      // Assuming CIE3 is the Model/Variable here as per logic discussed.
      
      const c1 = ((inputs.cie1 ?? 0) / 50) * 7;
      const c2 = ((inputs.cie2 ?? 0) / 50) * 7;
      const p1 = ((inputs.prt1 ?? 0) / 50) * 7;
      const p2 = ((inputs.prt2 ?? 0) / 50) * 7;
      const p3 = ((inputs.prt3 ?? 0) / 100) * 11;
      
      const knowns = c1 + c2 + p1 + p2 + p3;
      const neededFromCie3 = t - knowns;
      
      // needed = (CIE3 / 100) * 11
      // CIE3 = (needed / 11) * 100
      const requiredCie3 = (neededFromCie3 / 11) * 100;

      if (requiredCie3 <= 0) {
        setResultMessage("Target already achieved! You don't need any marks in Model/CIE3.");
      } else if (requiredCie3 > 100) {
        setResultMessage(`Impossible target. You would need ${requiredCie3.toFixed(1)}/100 in Model/CIE3.`);
      } else {
        setResultMessage(`You need ${Math.ceil(requiredCie3)}/100 in Model/CIE3.`);
      }
    }
  };

  if (!mode) {
    return (
      <ToolLayout title="Target Sense" onReset={() => {}} backTo="/">
        <div className="space-y-6 text-center pt-4">
           <h2 className="text-2xl font-display font-bold">Select Paper Type</h2>
           <div className="grid gap-4">
              <Button variant="outline" className="h-24 text-xl font-display glass-card justify-between px-8 hover:border-primary/50" onClick={() => setMode('theory')}>
                Theory <ArrowRight />
              </Button>
              <Button variant="outline" className="h-24 text-xl font-display glass-card justify-between px-8 hover:border-primary/50" onClick={() => setMode('integrated')}>
                Integrated <ArrowRight />
              </Button>
            </div>
        </div>
      </ToolLayout>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary -ml-2 group" onClick={handleBack}>
          <ChevronLeft className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back
        </Button>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-display font-bold opacity-80">{mode === 'theory' ? 'Theory Target' : 'Integrated Target'}</h2>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs text-muted-foreground hover:text-destructive">
            <RotateCcw size={14} className="mr-1" /> Reset
          </Button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h3 className="font-bold text-lg">1. Enter Obtained Marks</h3>
          
          {mode === 'theory' ? (
            <div className="grid grid-cols-2 gap-4">
              <CustomInput label="CIE 1" max={50} value={inputs.cie1 ?? ''} onChange={(e) => updateInput('cie1', e.target.value)} />
              <CustomInput label="CIE 2" max={50} value={inputs.cie2 ?? ''} onChange={(e) => updateInput('cie2', e.target.value)} />
              <CustomInput label="ASS 1" max={10} value={inputs.ass1 ?? ''} onChange={(e) => updateInput('ass1', e.target.value)} />
              <CustomInput label="ASS 2" max={10} value={inputs.ass2 ?? ''} onChange={(e) => updateInput('ass2', e.target.value)} />
              <CustomInput label="ASS 3" max={10} value={inputs.ass3 ?? ''} onChange={(e) => updateInput('ass3', e.target.value)} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <CustomInput label="CIE 1" max={50} value={inputs.cie1 ?? ''} onChange={(e) => updateInput('cie1', e.target.value)} />
              <CustomInput label="CIE 2" max={50} value={inputs.cie2 ?? ''} onChange={(e) => updateInput('cie2', e.target.value)} />
              <CustomInput label="PRT 1" max={50} value={inputs.prt1 ?? ''} onChange={(e) => updateInput('prt1', e.target.value)} />
              <CustomInput label="PRT 2" max={50} value={inputs.prt2 ?? ''} onChange={(e) => updateInput('prt2', e.target.value)} />
              <CustomInput label="PRT 3" max={100} value={inputs.prt3 ?? ''} onChange={(e) => updateInput('prt3', e.target.value)} />
            </div>
          )}
        </div>

        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h3 className="font-bold text-lg">2. Set Target</h3>
          <CustomInput 
            label={`Target Internal (${mode === 'theory' ? '/40' : '/50'})`} 
            max={mode === 'theory' ? 40 : 50} 
            value={target ?? ''} 
            onChange={(e) => setTarget(safeParse(e.target.value))} 
          />
        </div>

        <Button className="w-full glass-button h-14 text-lg font-bold rounded-xl" onClick={calculateTarget}>
          Calculate Required Model Mark
        </Button>

        {resultMessage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 rounded-xl text-center border-primary/30 bg-primary/10"
          >
            <p className="text-xl font-bold">{resultMessage}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
