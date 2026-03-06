import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';

type AudioState = {
    playerId: string | null;
    duration: number;
    status: 'playing' | 'paused';
    timeCode: number;
};
type DrawerAPIContextValue = {
    /** always restarts song, even if playerId is currently active */
    initSong: (url: string, playerId: string) => void;
    playSong: (playerId: string) => void;
    pauseSong: (playerId: string) => void;
    setSongProgress: (playerId: string, percent: number) => void;
    audioState: AudioState;
};

const AudioContext = createContext<DrawerAPIContextValue | undefined>(undefined);

const globalAudioObj = new Audio(); // just to make sure we only have one song playing at a given time
export function AudioContextProvider({ children }: { children: React.ReactNode }) {
    const [audioState, setAudioState] = useState<AudioState>({
        duration: NaN,
        timeCode: NaN,
        status: 'playing',
        playerId: null,
    });
    useEffect(() => {
        globalAudioObj.addEventListener('timeupdate', () => {
            setAudioState((curState) => ({ ...curState, timeCode: globalAudioObj.currentTime }));
        });
        globalAudioObj.addEventListener('pause', () => {
            setAudioState((curState) => ({ ...curState, status: 'paused' }));
        });
        globalAudioObj.addEventListener('play', () => {
            setAudioState((curState) => ({ ...curState, status: 'playing' }));
        });
        globalAudioObj.addEventListener('loadedmetadata', () => {
            setAudioState((curState) => ({ ...curState, duration: globalAudioObj.duration }));
        });
    }, []);
    const ctx: DrawerAPIContextValue = useMemo(
        () => ({
            playSong: (playerId) => {
                if (audioState?.playerId !== playerId) return;
                globalAudioObj.play();
            },
            pauseSong: (playerId) => {
                if (audioState?.playerId !== playerId) return;
                globalAudioObj.pause();
            },
            setSongProgress: (playerId, percent) => {
                if (audioState?.playerId !== playerId) return;
                globalAudioObj.currentTime = percent * globalAudioObj.duration;
            },
            initSong: (url, playerId) => {
                globalAudioObj.setAttribute('src', url);
                globalAudioObj.load();
                globalAudioObj.play();
                setAudioState({
                    playerId,
                    timeCode: NaN,
                    status: 'paused',
                    duration: NaN,
                });
            },
            audioState,
        }),
        [audioState],
    );
    return <AudioContext.Provider value={ctx}>{children}</AudioContext.Provider>;
}

export const useAudioContext = () => {
    const context = useContext(AudioContext);
    if (context === undefined) throw new Error('Cannot use audio context outside of provider!');
    return context;
};
