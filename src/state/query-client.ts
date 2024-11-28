
import {QueryClient} from '@tanstack/react-query';

export function createQueryClient() {
    // configure query client options here
    const queryClient = new QueryClient()
    return queryClient
}

// this is only used in client-side code
export const queryClient = createQueryClient()