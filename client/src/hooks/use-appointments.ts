import { useState, useEffect } from 'react';
import apiClient from '@/apiConfig/apiClient';

export interface Appointment {
  _id: string;
  patient?: { _id: string; name: string; email: string };
  doctor?: { _id: string; name: string; email: string; specialization?: string };
  phone?: string;
  date: string;
  reason: string;
  mode: 'Video' | 'In-clinic';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  spec: string;
  createdAt: string;
}

export function useAppointments(role: 'patient' | 'doctor' | 'admin') {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      let endpoint = '/appointments';
      if (role === 'patient') {
        endpoint = '/appointments/patient';
      } else if (role === 'doctor') {
        endpoint = '/appointments/doctor';
      }
      const response = await apiClient.get(endpoint);
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const bookAppointment = async (data: { doctor: string; phone: string; date: string; reason: string; mode?: string; spec: string }) => {
    try {
      const response = await apiClient.post('/appointments', data);
      if (response.data.success) {
        await fetchAppointments();
        return response.data;
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to book appointment');
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const response = await apiClient.put(`/appointments/${id}`, { status });
      if (response.data.success) {
        await fetchAppointments();
        return response.data;
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update appointment');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [role]);

  return {
    appointments,
    isLoading,
    error,
    fetchAppointments,
    bookAppointment,
    updateAppointmentStatus,
  };
}
