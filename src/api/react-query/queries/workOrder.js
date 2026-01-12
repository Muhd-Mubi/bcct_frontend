import { useMutation } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/react-query/apiClient';

export function useGetWorkOrder(page) {
    return useQuery({
        queryKey: ['workOrder', page],
        queryFn: () => apiClient(`/work-order/get-work-order/${page}`),
    });
}

export function useCreateWorkOrder() {
    return useMutation({
        mutationFn: ({ data }) =>
            apiClient(`/work-order/create-work-order`, {
                method: 'POST',
                body: data,
            }),
    });
}

export function useEditWorkOrderStatus() {
    return useMutation({
        mutationFn: ({ data, id }) =>
            apiClient(`/work-order/update-work-order-status/${id}`, {
                method: 'PUT',
                body: data,
            }),
    });
}

export function useEditWorkOrder() {
    return useMutation({
        mutationFn: ({ id, data }) =>
            apiClient(`/work-order/edit-work-order/${id}`, {
                method: 'PUT',
                body: data,
            }),
    });
}

export function useDeleteWorkOrder() {
    return useMutation({
        mutationFn: ({ id }) =>
            apiClient(`/work-order/delete-work-order/${id}`, {
                method: 'DELETE',
            }),
    });
}

export function useGetWorkOrderCounts() {
    return useQuery({
        queryKey: ['workOrderCount'],
        queryFn: () => apiClient(`/work-order/get-work-order-counts`),
    });
}