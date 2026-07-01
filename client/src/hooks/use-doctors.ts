import { useState, useEffect } from 'react';
import apiClient from '@/apiConfig/apiClient';

export interface Doctor {
  _id: string;
  name: string;
  email: string;
  role: 'doctor';
  specialization?: string;
}

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get('/doctors');
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch doctors');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return {
    doctors,
    isLoading,
    error,
    fetchDoctors,
  };
}
