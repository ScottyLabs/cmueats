import { useEffect, useState } from 'react';
import notifySlack from './slack';

export default function useLocalStorage(key: string) {
    const [value, setValue] = useState(() => localStorage.getItem(key));
    useEffect(() => {
        const onStorageUpdate = () => {
            setValue(localStorage.getItem(key));
        };
        window.addEventListener('storage', onStorageUpdate); // gets called when other windows modify storage
        return () => window.removeEventListener('storage', onStorageUpdate);
    }, [key]);

    return [
        value,
        (newVal: string) => {
            try {
                localStorage.setItem(key, newVal);
            } catch (e) {
                notifySlack(String(e));
            }
            setValue(newVal);
        },
    ] as const;
}
