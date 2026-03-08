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
type DrawerAPIContextValue = {
    /** always restarts song, even if playerId is currently active */
    initSong: (url: string, playerId: string) => void;
    playSong: (playerId: string) => void;
    pauseSong: (playerId: string) => void;
    setSongProgress: (playerId: string, percent: number) => void;
    getWaveTable: () => number[];
    audioState: AudioState;
};

const AudioContext = createContext<DrawerAPIContextValue | undefined>(undefined);

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
    const audioElementRef = useRef<HTMLAudioElement>(null);

    // this... well... actually works lmao
    useEffect(() => {
        audioElementRef.current!.addEventListener('timeupdate', () => {
            setAudioState((curState) => ({ ...curState, timeCode: audioElementRef.current!.currentTime }));
        });
        audioElementRef.current!.addEventListener('pause', () => {
            setAudioState((curState) => ({ ...curState, status: 'paused' }));
        });
        audioElementRef.current!.addEventListener('play', () => {
            setAudioState((curState) => ({ ...curState, status: 'playing' }));
        });
        audioElementRef.current!.addEventListener('loadedmetadata', () => {
            setAudioState((curState) => ({ ...curState, duration: audioElementRef.current!.duration }));
        });
    }, []);
    const getWaveTable = useCallback(() => {
        if (audioAnalyzer === undefined || dataArray === undefined) return [0];
        audioAnalyzer.getByteFrequencyData(dataArray);
        return [...dataArray];
    }, [audioAnalyzer, dataArray]);
    const ctx: DrawerAPIContextValue = useMemo(
        () => ({
            playSong: (playerId) => {
                if (audioState?.playerId !== playerId) return;
                audioElementRef.current!.play();
            },
            pauseSong: (playerId) => {
                if (audioState?.playerId !== playerId) return;
                audioElementRef.current!.pause();
            },
            setSongProgress: (playerId, percent) => {
                if (audioState?.playerId !== playerId) return;
                audioElementRef.current!.currentTime = percent * audioElementRef.current!.duration;
            },
            initSong: (url, playerId) => {
                audioElementRef.current!.setAttribute('src', url);
                // audioElementRef.current!.load();
                audioElementRef.current!.play();
                if (!initializedAudioAnalyzer.current) {
                    const audioCtx = new window.AudioContext();
                    const audioSource = audioCtx.createMediaElementSource(audioElementRef.current!);
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
    return (
        <AudioContext.Provider value={ctx}>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio ref={audioElementRef} preload="auto" src="" />
            {children}
        </AudioContext.Provider>
    );
}

export const useAudioContext = () => {
    const context = useContext(AudioContext);
    if (context === undefined) throw new Error('Cannot use audio context outside of provider!');
    return context;
};
