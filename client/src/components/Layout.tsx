import React from 'react';
import { Moon, Sun, GraduationCap } from 'lucide-react';
import { useTheme } from 'next-themes'; 
import { Button } from '@/components/ui/button';

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
      
      {/* Gradient Background - Blue -> Purple -> White (Subtle) */}
      <div className="fixed inset-0 z-0 w-full h-full bg-gradient-to-br from-[#E9EFF7] via-[#F0F4FA] to-[#F7F9FF] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-700" />
      
      {/* Subtle animated blobs for "futuristic" feel */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[100px] animate-pulse z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 blur-[100px] animate-pulse z-0 delay-1000" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen max-w-lg mx-auto px-6 md:px-0">
        {/* Navbar - Transparent bar with soft blur */}
        <header className="flex items-center justify-between py-8 md:py-10 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[18px] bg-white/40 dark:bg-white/10 flex items-center justify-center text-primary backdrop-blur-md border border-white/50 dark:border-white/10 shadow-sm">
              <GraduationCap size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold tracking-tight leading-none text-foreground">Markify</h1>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full hover:bg-white/20 hover:text-primary transition-colors duration-300 w-12 h-12"
          >
            {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
          </Button>
        </header>

        {/* Main */}
        <main className="flex-1 flex flex-col pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </main>
      </div>
    </div>
  );
};
