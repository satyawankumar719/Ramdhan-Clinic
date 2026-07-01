import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./store/AuthContext";
import { LanguageProvider } from "./store/LanguageContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AIHealthAssistant from "./pages/AIHealthAssistant";
import Appointments from "./pages/Appointments";
import Emergency from "./pages/Emergency";
import Prescriptions from "./pages/Prescriptions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Patient Routes */}
            <Route path="/patient" element={
              <ProtectedRoute role="patient">
                <PatientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/patient/appointments" element={
              <ProtectedRoute role="patient">
                <Appointments role="patient" />
              </ProtectedRoute>
            } />
            <Route path="/patient/prescriptions" element={
              <ProtectedRoute role="patient">
                <Prescriptions role="patient" />
              </ProtectedRoute>
            } />
            <Route path="/patient/emergency" element={
              <ProtectedRoute role="patient">
                <Emergency role="patient" />
              </ProtectedRoute>
            } />
            <Route path="/patient/assistant" element={
              <ProtectedRoute role="patient">
                <AIHealthAssistant />
              </ProtectedRoute>
            } />

            {/* Doctor Routes */}
            <Route path="/doctor" element={
              <ProtectedRoute role="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/doctor/appointments" element={
              <ProtectedRoute role="doctor">
                <Appointments role="doctor" />
              </ProtectedRoute>
            } />
            <Route path="/doctor/prescriptions" element={
              <ProtectedRoute role="doctor">
                <Prescriptions role="doctor" />
              </ProtectedRoute>
            } />
            <Route path="/doctor/emergency" element={
              <ProtectedRoute role="doctor">
                <Emergency role="doctor" />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
