import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/react-query/apiClient';

export function useGetMeasurements() {
  return useQuery({
    queryKey: ['measurement'],
    queryFn: () => apiClient('/measurement/get-measurement'),
  });
}
