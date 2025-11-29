import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Home } from "@/pages/Home";
import { InternalScore } from "@/components/InternalScore";
import { TargetSense } from "@/components/TargetSense";
import { GPAPredictor } from "@/components/GPAPredictor";
import { CGPACalculator } from "@/components/CGPACalculator";
import { Layout } from "@/components/Layout";
import { ThemeProvider } from "next-themes";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/internal" component={InternalScore} />
        <Route path="/target" component={TargetSense} />
        <Route path="/gpa" component={GPAPredictor} />
        <Route path="/cgpa" component={CGPACalculator} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
