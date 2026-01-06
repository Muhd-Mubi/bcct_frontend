import { useMutation } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/react-query/apiClient';


export function useCompleteWorkOrder() {
    return useMutation({
        mutationFn: ({ id, data }) =>
            apiClient(`/inventory-transection/work-order-complete/${id}`, {
                method: 'POST',
                body: data,
            }),
    });
}


