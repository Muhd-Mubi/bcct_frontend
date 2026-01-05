import { useMutation } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/react-query/apiClient';

export function useGetJobs(page) {
    return useQuery({
        queryKey: ['job', page],
        queryFn: () => apiClient(`/job/get-job/${page}`),
    });
}

export function useGetJobById(id) {
    return useQuery({
        queryKey: ['job', id],
        queryFn: () => apiClient(`/job/get-job-id/${id}`),
        enabled: false,
    });
}


export function useCreateJob() {
    return useMutation({
        mutationFn: ({ data }) =>
            apiClient(`/job/create-job`, {
                method: 'POST',
                body: data,
            }),
    });
}

export function useEditJob() {
    return useMutation({
        mutationFn: ({ id, data }) =>
            apiClient(`/job/update-job/${id}`, {
                method: 'PUT',
                body: data,
            }),
    });
}

export function useDeleteJob() {
    return useMutation({
        mutationFn: ({ id }) =>
            apiClient(`/job/delete-job/${id}`, {
                method: 'DELETE',
            }),
    });
}
