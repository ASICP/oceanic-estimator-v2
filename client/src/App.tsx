import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import CostEstimatorWizard from "@/components/CostEstimatorWizard";
import PorpoiseCalculatorPage from "@/pages/PorpoiseCalculatorPage";
import GitHubSyncPage from "@/pages/GitHubSyncPage";
import BlueWhaleCalculatorPage from "@/pages/BlueWhaleCalculatorPage";
import EchoCalculatorPage from "@/pages/EchoCalculatorPage";
import CalculatorLandingPage from "@/pages/CalculatorLandingPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={CalculatorLandingPage} />
      <Route path="/porpoise" component={PorpoiseCalculatorPage} />
      <Route path="/estimator-v1" component={CostEstimatorWizard} />
      <Route path="/echo" component={EchoCalculatorPage} />
      <Route path="/blue-whale" component={BlueWhaleCalculatorPage} />
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
