import { createContext, useContext, useEffect, useMemo, useState } from 'react';

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

export const globalAudioObj = new Audio(); // just to make sure we only have one song playing at a given time

export function AudioContextProvider({ children }: { children: React.ReactNode }) {
    const [audioState, setAudioState] = useState<AudioState>({
        duration: NaN,
        timeCode: NaN,
        status: 'playing',
        playerId: null,
    });
    const [audioAnalyzer, setAudioAnalyzer] = useState<AnalyserNode>();
    const [dataArray, setDataArray] = useState<Uint8Array<ArrayBuffer>>();

    // this... well... actually works lmao
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
                if (audioAnalyzer === undefined) {
                    const audioCtx = new window.AudioContext();
                    const audioSource = audioCtx.createMediaElementSource(globalAudioObj);
                    const analyzer = audioCtx.createAnalyser();
                    audioSource.connect(analyzer);
                    analyzer.connect(audioCtx.destination);
                    analyzer.fftSize = 256;
                    const bufferLength = analyzer.frequencyBinCount;
                    setAudioAnalyzer(analyzer);
                    setDataArray(new Uint8Array(bufferLength));
                }
                setAudioState({
                    playerId,
                    timeCode: NaN,
                    status: 'playing',
                    duration: NaN,
                });
            },
            audioState,
            getWaveTable() {
                if (audioAnalyzer === undefined || dataArray === undefined || Number.isNaN(audioState.timeCode))
                    return [0];
                audioAnalyzer.getByteFrequencyData(dataArray);
                return [...dataArray];
            },
        }),
        [audioState, audioAnalyzer, dataArray],
    );
    return <AudioContext.Provider value={ctx}>{children}</AudioContext.Provider>;
}

export const useAudioContext = () => {
    const context = useContext(AudioContext);
    if (context === undefined) throw new Error('Cannot use audio context outside of provider!');
    return context;
};
