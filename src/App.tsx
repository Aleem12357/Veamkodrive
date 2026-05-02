import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Layout } from "@/components/layout/Layout";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Repair from "./pages/Repair";
import BuySell from "./pages/BuySell";
import Rent from "./pages/Rent";
import Consulting from "./pages/Consulting";
import Parts from "./pages/Parts";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,      // data fresh for 2 min
      gcTime: 1000 * 60 * 10,         // keep in cache for 10 min
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/services" element={<Layout><Services /></Layout>} />
              <Route path="/repair" element={<Layout><Repair /></Layout>} />
              <Route path="/buy-sell" element={<Layout><BuySell /></Layout>} />
              <Route path="/rent" element={<Layout><Rent /></Layout>} />
              <Route path="/consulting" element={<Layout><Consulting /></Layout>} />
              <Route path="/parts" element={<Layout><Parts /></Layout>} />
              <Route path="/cart" element={<Layout><Cart /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/profile" element={<Layout><Profile /></Layout>} />
              <Route path="/admin" element={<Layout><Admin /></Layout>} />
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
