import { useEffect, useState } from 'react';
import notifySlack from './slack';
import { safeGetItem, safeSetItem } from './safeStorage';

export default function useLocalStorage(key: string) {
    const [value, setValue] = useState(() => safeGetItem(key));
    useEffect(() => {
        const onStorageUpdate = () => {
            setValue(safeGetItem(key));
        };
        window.addEventListener('storage', onStorageUpdate); // gets called when other windows modify storage
        return () => window.removeEventListener('storage', onStorageUpdate);
    }, [key]);

    return [
        value,
        (newVal: string) => {
            const success = safeSetItem(key, newVal);
            if (!success) {
                notifySlack(`Failed to set localStorage key "${key}": cookies may be disabled`);
            }
            setValue(newVal);
        },
    ] as const;
}
