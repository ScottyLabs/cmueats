/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useAudioContext } from '../contexts/AudioContext';
import { IMikuCardData } from '../types/locationTypes';
import css from './EateryCardHeader.module.css';

function secondsToReadableString(seconds: number) {
    if (Number.isNaN(seconds)) return '-:--';
    const secondsFloored = Math.floor(seconds);
    const minutes = Math.floor(secondsFloored / 60);
    seconds = secondsFloored % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
function MikuCardHeader({
    songData,
    songActive,
    setSongProgress,
}: {
    songData: IMikuCardData;
    songActive: boolean;
    setSongProgress: (percent: number) => void;
}) {
    const { audioState } = useAudioContext();
    const showProgressBar = songActive && !Number.isNaN(audioState.timeCode) && !Number.isNaN(audioState.duration);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const [userInputWidthPercent, setUserInputWidthPercent] = useState<null | number>(null);
    const userInputStale = useRef(false); // only set to true once user has finished dragging
    useEffect(() => {
        if (userInputStale.current) {
            // remove user input (new audio data detected)
            setUserInputWidthPercent(null);
            userInputStale.current = false;
        }
    }, [audioState?.timeCode]);
    const songProgress = showProgressBar
        ? userInputWidthPercent !== null
            ? userInputWidthPercent
            : audioState.timeCode / audioState.duration
        : -1;
    const getPercentScrolled = (clientX: number) =>
        Math.min(
            1,
            Math.max(
                0,
                (clientX - progressBarRef.current!.getBoundingClientRect().left) /
                    progressBarRef.current!.getBoundingClientRect().width,
            ),
        );
    return (
        <div
            style={{
                '--status-color': 'var(--miku)',
                '--song-progress': `${songProgress * 100}%`,
            }}
        >
            <div className={clsx(css['card-header-container'], css['card-header-container--song-variant'])}>
                <div className={css['card-header-dot']} />

                <div className={css['time-container']}>
                    <span className={css['card-header-relative-time-text']}>
                        {songActive ? '~Playing' : 'Tap/Click to Play'}
                    </span>
                    {showProgressBar && (
                        <span className={css['card-header-absolute-time-text']}>
                            {' '}
                            {secondsToReadableString(audioState.duration * songProgress)} /{' '}
                            {secondsToReadableString(audioState.duration)}
                        </span>
                    )}
                </div>
            </div>
            <div
                role="slider"
                aria-valuenow={songProgress}
                className={css['song-scrobble-clickable-area']}
                onClick={(ev) => {
                    // if (ev.clientX === 0) return;
                    if (!showProgressBar) return;
                    setSongProgress(getPercentScrolled(ev.clientX));
                    ev.preventDefault();
                }}
                onDragEnd={(ev) => {
                    const percent = getPercentScrolled(ev.clientX);
                    userInputStale.current = true;
                    setSongProgress(percent);
                }}
                onDrag={(ev) => {
                    if (ev.clientX === 0) return; // seems like a chrome bug when the user stops dragging...
                    setUserInputWidthPercent(getPercentScrolled(ev.clientX));
                    ev.preventDefault();
                }}
                onDragStart={(ev) => {
                    const img = new Image();
                    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                    ev.dataTransfer.setDragImage(img, 0, 0);
                }}
                draggable
                ref={progressBarRef}
            >
                <div className={css['song-scrobble']}>
                    {showProgressBar && (
                        <div className={css['song-scrobble-filled']}>
                            <div className={css['song-scrobble-button']} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MikuCardHeader;
