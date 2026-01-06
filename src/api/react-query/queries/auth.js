import { useMutation } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/react-query/apiClient';


export function useUserLogin() {
    return useMutation({
        mutationFn: ({ data }) =>
            apiClient(`/user/login`, {
                method: 'POST',
                body: data,
            }),
    });
}