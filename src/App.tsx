import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminOnlyRoute, PartnerOnlyRoute, AdminAndPartnerRoute } from "@/components/auth/RoleBasedRoute";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Partners from "./pages/Partners";
import Orders from "./pages/Orders";
import EnhancedSettlements from "./pages/EnhancedSettlements";
import Templates from "./pages/Templates";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Earnings from "./pages/Earnings";
import Storefront from "./pages/Storefront";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes - No authentication required */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected routes - Authentication required */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                {/* Routes accessible to both Admin and Partner */}
                <Route element={<AdminAndPartnerRoute />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/settlements" element={<EnhancedSettlements />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/earnings" element={<Earnings />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
                
                {/* Admin-only routes */}
                <Route element={<AdminOnlyRoute />}>
                  <Route path="/partners" element={<Partners />} />
                  <Route path="/templates" element={<Templates />} />
                </Route>
                
                {/* Partner-only routes */}
                <Route element={<PartnerOnlyRoute />}>
                  <Route path="/storefront" element={<Storefront />} />
                </Route>
                
                {/* Catch-all for 404 */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
