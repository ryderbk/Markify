import React from 'react';
import { Moon, Sun, GraduationCap } from 'lucide-react';
import { useTheme } from 'next-themes'; // We need to install this or use a custom hook. 
// I'll use a simple custom hook for now to avoid extra deps if not needed, 
// BUT next-themes is in package.json! Perfect.

import { Button } from '@/components/ui/button';
import bgImage from '@assets/generated_images/dark_abstract_gradient_background_for_glassmorphism_ui.png';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full relative overflow-hidden selection:bg-primary selection:text-white font-sans">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-30 dark:opacity-60 transition-opacity duration-700"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* Gradient overlay to blend nicely with theme */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-background/80 via-background/50 to-background/90 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen max-w-md mx-auto px-4 md:px-0">
        {/* Header */}
        <header className="flex items-center justify-between py-6 md:py-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary backdrop-blur-md border border-primary/10 shadow-lg shadow-primary/10">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight leading-none">Internal Marks</h1>
              <p className="text-xs text-muted-foreground font-medium">Calculator</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors duration-300"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </header>

        {/* Main */}
        <main className="flex-1 flex flex-col pb-24">
          {children}
        </main>
      </div>
    </div>
  );
};
