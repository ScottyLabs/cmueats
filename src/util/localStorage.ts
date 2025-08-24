import { useEffect, useState } from 'react';

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
            localStorage.setItem(key, newVal);
            setValue(newVal);
        },
    ] as const;
}
