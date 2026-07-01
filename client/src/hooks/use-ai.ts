import { useState } from 'react';
import apiClient from '@/apiConfig/apiClient';

export interface Summary {
  patient: string;
  chiefComplaint: string;
  duration: string;
  severity: string;
  other: string;
  suggested: string;
}

export interface Message {
  from: 'ai' | 'user';
  text: string;
  chips?: string[];
}

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendedDoctors, setRecommendedDoctors] = useState<any[]>([]);

  const sendMessage = async (message: string, conversationHistory: Message[]) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.post('/ai/chat', {
        message,
        conversationHistory,
      });

      if (response.data.success) {
        if (response.data.data.recommendedDoctors) {
          setRecommendedDoctors(response.data.data.recommendedDoctors);
        }
        return response.data.data;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetConversation = async () => {
    try {
      await apiClient.post('/ai/reset');
    } catch (err: any) {
      console.error('Failed to reset conversation:', err);
    }
  };

  const reset = () => {
    setRecommendedDoctors([]);
    resetConversation();
  };

  return {
    loading,
    error,
    recommendedDoctors,
    sendMessage,
    reset,
    resetConversation,
  };
};