import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

type AudioState = {
    /** which card is responsible for displaying controls for current audio */
    playerId: string | null;
    /** is NaN when data is still loading */
    duration: number;
    status: 'playing' | 'paused';
    /** is NaN when data is still loading */
    timeCode: number;
};
const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

type AudioContextValue = {
    /** always restarts song, even if playerId is currently active */
    initSong: (url: string, playerId: string) => void;
    playSong: (playerId: string) => void;
    pauseSong: (playerId: string) => void;
    setSongProgress: (playerId: string, percent: number) => void;
    getWaveTable: () => number[];
    audioState: AudioState;
};

const foregroundAudioObj = new Audio();
const backgroundAudioObj = new Audio();
const AudioContext = createContext<AudioContextValue | undefined>(undefined);

export function AudioContextProvider({ children }: { children: React.ReactNode }) {
    const [audioState, setAudioState] = useState<AudioState>({
        duration: NaN,
        timeCode: NaN,
        status: 'playing',
        playerId: null,
    });
    const [audioAnalyzer, setAudioAnalyzer] = useState<AnalyserNode>();
    const [dataArray, setDataArray] = useState<Uint8Array<ArrayBuffer>>();
    const initializedAudioAnalyzer = useRef(false);

    // this... well... actually works lmao
    useEffect(() => {
        const controller = new AbortController();

        foregroundAudioObj.addEventListener(
            'timeupdate',
            () => {
                setAudioState((curState) => ({ ...curState, timeCode: foregroundAudioObj.currentTime }));
            },
            { signal: controller.signal },
        );
        foregroundAudioObj.addEventListener(
            'pause',
            () => {
                setAudioState((curState) => ({ ...curState, status: 'paused' }));
            },
            { signal: controller.signal },
        );
        foregroundAudioObj.addEventListener(
            'play',
            () => {
                setAudioState((curState) => ({ ...curState, status: 'playing' }));
            },
            { signal: controller.signal },
        );
        foregroundAudioObj.addEventListener(
            'loadedmetadata',
            () => {
                setAudioState((curState) => ({ ...curState, duration: foregroundAudioObj.duration }));
            },
            { signal: controller.signal },
        );
        return () => controller.abort();
    }, []);

    // wavetable audio object to globalAudioObj handoff
    useEffect(() => {
        if (!isMobile) return () => {};
        const controller = new AbortController();
        document.addEventListener(
            'visibilitychange',
            async () => {
                if (document.visibilityState === 'hidden') {
                    backgroundAudioObj.currentTime = foregroundAudioObj.currentTime;
                    if (!foregroundAudioObj.paused) {
                        foregroundAudioObj.pause();
                        backgroundAudioObj.play();
                    }
                } else if (document.visibilityState === 'visible') {
                    foregroundAudioObj.currentTime = backgroundAudioObj.currentTime;
                    if (!backgroundAudioObj.paused) {
                        backgroundAudioObj.pause();
                        foregroundAudioObj.play();
                    }
                }
            },
            { signal: controller.signal },
        );
        return () => controller.abort();
    }, []);
    const getWaveTable = useCallback(() => {
        if (audioAnalyzer === undefined || dataArray === undefined) return [0];
        audioAnalyzer.getByteFrequencyData(dataArray);
        return [...dataArray];
    }, [audioAnalyzer, dataArray]);
    const ctx: AudioContextValue = useMemo(
        () => ({
            playSong: (playerId) => {
                if (audioState?.playerId !== playerId) return;
                foregroundAudioObj.play();
            },
            pauseSong: (playerId) => {
                if (audioState?.playerId !== playerId) return;
                foregroundAudioObj.pause();
            },
            setSongProgress: (playerId, percent) => {
                if (audioState?.playerId !== playerId) return;
                foregroundAudioObj.currentTime = percent * foregroundAudioObj.duration;
            },
            initSong: (url, playerId) => {
                foregroundAudioObj.setAttribute('src', url);
                backgroundAudioObj.setAttribute('src', url);
                backgroundAudioObj.load();
                foregroundAudioObj.load();
                foregroundAudioObj.play();
                if (!initializedAudioAnalyzer.current) {
                    const audioCtx = new window.AudioContext();
                    const audioSource = audioCtx.createMediaElementSource(foregroundAudioObj);
                    const analyzer = audioCtx.createAnalyser();
                    audioSource.connect(analyzer);
                    analyzer.connect(audioCtx.destination);
                    analyzer.fftSize = 256;
                    const bufferLength = analyzer.frequencyBinCount;
                    setAudioAnalyzer(analyzer);
                    setDataArray(new Uint8Array(bufferLength));
                    initializedAudioAnalyzer.current = true; // guarantee only one init
                }
                setAudioState({
                    playerId,
                    timeCode: NaN,
                    status: 'playing',
                    duration: NaN,
                });
            },
            audioState,
            getWaveTable,
        }),
        [audioState, getWaveTable],
    );
    return <AudioContext.Provider value={ctx}>{children}</AudioContext.Provider>;
}

export const useAudioContext = () => {
    const context = useContext(AudioContext);
    if (context === undefined) throw new Error('Cannot use audio context outside of provider!');
    return context;
};
