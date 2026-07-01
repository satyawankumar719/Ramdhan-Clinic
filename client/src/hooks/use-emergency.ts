import { useState, useEffect } from 'react';
import apiClient from '@/apiConfig/apiClient';

export interface Emergency {
  _id: string;
  patient?: { _id: string; name: string; email: string };
  assignedDoctor?: { _id: string; name: string; specialization: string };
  location: string;
  phone: string;
  symptoms: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'resolved' | 'cancelled';
  notes: string;
  createdAt: string;
}

export function useEmergency(role: string) {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmergencies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const endpoint = role === 'patient' ? '/emergency/patient' : '/emergency';
      const response = await apiClient.get(endpoint);
      if (response.data.success) {
        setEmergencies(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch emergencies');
    } finally {
      setIsLoading(false);
    }
  };

  const createEmergency = async (data: { location: string; phone: string; symptoms: string }) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post('/emergency', data);
      await fetchEmergencies();
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send emergency request');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string, notes?: string) => {
    try {
      await apiClient.put(`/emergency/${id}`, { status, notes });
      await fetchEmergencies();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
      throw err;
    }
  };

  useEffect(() => {
    fetchEmergencies();
  }, [role]);

  return {
    emergencies,
    isLoading,
    error,
    createEmergency,
    updateStatus,
    fetchEmergencies
  };
}
