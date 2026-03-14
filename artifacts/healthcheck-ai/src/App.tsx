import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";
import NotFound from "@/pages/not-found";

import { Home } from "@/pages/Home";
import { Assessment } from "@/pages/Assessment";
import { Dashboard } from "@/pages/Dashboard";
import { Vitals } from "@/pages/Vitals";
import { Tips } from "@/pages/Tips";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function Router() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/assessment" component={Assessment} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/vitals" component={Vitals} />
          <Route path="/tips" component={Tips} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
