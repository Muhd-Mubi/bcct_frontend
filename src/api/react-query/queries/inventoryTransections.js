import { useMutation } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/react-query/apiClient';


export function useGetInventoryTransections({ page, body }) {
    return useQuery({
        queryKey: ['inventoryTransection', page, body],
        queryFn: () =>
            apiClient(`/inventory-transection/get-inventory-transections/${page}`, {
                method: 'POST',
                body: body,
            }),
    });
}

export function useCompleteWorkOrder() {
    return useMutation({
        mutationFn: ({ id, data }) =>
            apiClient(`/inventory-transection/work-order-complete/${id}`, {
                method: 'POST',
                body: data,
            }),
    });
}

export function useRevertWorkOrder() {
    return useMutation({
        mutationFn: ({ id }) =>
            apiClient(`/inventory-transection/work-order-revert/${id}`, {
                method: 'POST',
            }),
    });
}

export function useCompleteOnboarding() {
    return useMutation({
        mutationFn: ({ data }) =>
            apiClient(`/inventory-transection/onboarding-complete`, {
                method: 'POST',
                body: data,
            }),
    });
}


