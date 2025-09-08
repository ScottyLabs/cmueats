import { useEffect, useState } from 'react';
import notifySlack from './slack';

export default function useLocalStorage<T extends string | null>(key: string): [T, (newVal: string) => void];
export default function useLocalStorage<T>(
    key: string,
    deserializer: (val: string | null) => T,
    serializer: (val: T) => string,
): [T, (newVal: T) => void];
export default function useLocalStorage<T>(
    key: string,
    deserializer?: (val: string | null) => T,
    serializer?: (val: T) => string,
) {
    const [rawValue, setRawValue] = useState(() => localStorage.getItem(key));
    useEffect(() => {
        const onStorageUpdate = () => {
            setRawValue(localStorage.getItem(key));
        };
        window.addEventListener('storage', onStorageUpdate); // gets called when other windows modify storage
        return () => window.removeEventListener('storage', onStorageUpdate);
    }, [key]);

    return [
        deserializer !== undefined ? deserializer(rawValue) : rawValue,
        (newVal: T) => {
            const serializedValue = serializer !== undefined ? serializer(newVal) : (newVal as string);
            try {
                localStorage.setItem(key, serializedValue);
            } catch (e) {
                notifySlack(String(e));
            }
            setRawValue(serializedValue);
        },
    ] as const;
}
