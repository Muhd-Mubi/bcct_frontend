import { useMutation } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/react-query/apiClient';

export function useGeMaterials() {
    return useQuery({
        queryKey: ['material'],
        queryFn: () => apiClient('/material/get-material'),
    });
}

export function useCreateMaterial() {
    return useMutation({
        mutationFn: ({ data }) =>
            apiClient(`/material/create-material`, {
                method: 'POST',
                body: data,
            }),
    });
}

export function useEditMaterial() {
    return useMutation({
        mutationFn: ({ id, data }) =>
            apiClient(`/material/update-material/${id}`, {
                method: 'PUT',
                body: data,
            }),
    });
}

// export function useDeleteMeasurement() {
//   return useMutation({
//     mutationFn: ({ id }) =>
//       apiClient(`/measurement/delete-measurement/${id}`, {
//         method: 'DELETE',
//       }),
//   });
// }
