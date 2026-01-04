const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiClient(
    endpoint,
    { method = 'GET', body, headers = {} } = {}
) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        // credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }

    return response.json();
}
