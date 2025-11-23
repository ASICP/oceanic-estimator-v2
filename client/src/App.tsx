import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import CostEstimatorWizard from "@/components/CostEstimatorWizard";
import PorpoiseCalculatorPage from "@/pages/PorpoiseCalculatorPage";
import GitHubSyncPage from "@/pages/GitHubSyncPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={PorpoiseCalculatorPage} />
      <Route path="/estimator-v1" component={CostEstimatorWizard} />
      <Route path="/github-sync" component={GitHubSyncPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
