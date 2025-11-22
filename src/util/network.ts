import { useEffect } from 'react';

export default function useRefreshWhenBackOnline() {
    useEffect(() => {
        function handleOnline() {
            if (navigator.onLine) {
                // Refresh the page
                window.location.reload();
            }
        }

        window.addEventListener('online', handleOnline);

        return () => window.removeEventListener('online', handleOnline);
    }, []);
}
