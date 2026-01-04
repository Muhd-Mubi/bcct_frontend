import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';

export function useGetMeasurements() {
  return useQuery({
    queryKey: ['measurement'],
    queryFn: () => apiClient('/measurement'),
  });
}
