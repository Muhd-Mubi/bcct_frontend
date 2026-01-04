import { useMutation } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/react-query/apiClient';

export function useGetMeasurements() {
  return useQuery({
    queryKey: ['measurement'],
    queryFn: () => apiClient('/measurement/get-measurement'),
  });
}

export function useEditMeasurement() {
  return useMutation({
    mutationFn: ({ id, data }) =>
      apiClient(`/measurement/update-measurement/${id}`, {
        method: 'PUT',
        body: data,
      }),
  });
}
