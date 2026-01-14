import { useEffect, useState } from 'react';
import css from './OfflineAlertBanner.module.css';
import { X } from 'lucide-react';

export default function AlertBanner() {
    const [showOfflineAlert, setShowOfflineAlert] = useState(!navigator.onLine);

    // Monitor for the user being online
    useEffect(() => {
        const handleOnlineStatus = () => {
            setShowOfflineAlert(!navigator.onLine);
        };

        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);

        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, []);

    return (
        showOfflineAlert && (
            <div className={css.announcement}>
                <span>
                    🚫🌐 We are temporarily unable to provide the latest available dining information or the map while
                    you are offline. We apologize for any inconvenience. 🌐🚫
                </span>
                <button onClick={() => setShowOfflineAlert(false)} type="button">
                    <X className={css.x} size={22} />
                </button>
            </div>
        )
    );
}
