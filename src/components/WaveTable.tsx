import { useEffect, useRef } from 'react';
import css from './WaveTable.module.css';
import { useAudioContext } from '../contexts/AudioContext';

export default function WaveTable({ color }: { color: string }) {
    const { getWaveTable } = useAudioContext();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvasRef.current) return () => {};
        let active = true;
        const canvas = canvasRef.current;
        const ctx = canvasRef.current.getContext('2d')!;
        const scale = window.devicePixelRatio;
        const elementBox = canvas.getBoundingClientRect();
        canvas.width = elementBox.width * scale;
        canvas.height = elementBox.height * scale;
        function animate() {
            if (!active) return;
            const waveTable = getWaveTable().slice(0, -10);
            const RECTANGLE_WIDTH = canvas.width / waveTable.length;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = color;
            for (let i = 0; i < waveTable.length; i++) {
                ctx.fillRect(
                    i * RECTANGLE_WIDTH,
                    canvas.height,
                    RECTANGLE_WIDTH + 1,
                    -(waveTable[i]! / 320) * canvas.height,
                );
            }
            requestAnimationFrame(animate);
        }
        animate();
        return () => {
            active = false;
        };
    }, [getWaveTable, color]);
    return <canvas ref={canvasRef} className={css['wavetable-canvas']} />;
}
