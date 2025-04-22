import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ModalProvider } from "@/contexts/ModalContext";

import Home from "@/pages/Home";
import WallpaperDetail from "@/pages/WallpaperDetail";
import Category from "@/pages/Category";
import SearchResults from "@/pages/SearchResults";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/wallpaper/:slug" component={WallpaperDetail} />
      <Route path="/category/:slug" component={Category} />
      <Route path="/search" component={SearchResults} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ModalProvider>
          <Toaster />
          <Router />
        </ModalProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
