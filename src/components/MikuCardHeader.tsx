/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useAudioContext } from '../contexts/AudioContext';
import { IMikuCardData } from '../types/locationTypes';
import css from './EateryCardHeader.module.css';
import PlayIcon from '../assets/control_buttons/play.svg?react';
import PauseIcon from '../assets/control_buttons/pause.svg?react';
import WaveTable from './WaveTable';

function secondsToReadableString(totalSeconds: number) {
    if (Number.isNaN(totalSeconds)) return '-:--';
    const secondsFloored = Math.floor(totalSeconds);
    const minutes = Math.floor(secondsFloored / 60);
    const seconds = secondsFloored % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
function MikuCardHeader({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    songData,
    playerActive,
    setSongProgress,
}: {
    songData: IMikuCardData;
    /** does the currently playing song correspond with this card? */
    playerActive: boolean;
    setSongProgress: (percent: number) => void;
}) {
    const { audioState } = useAudioContext();
    /** user input state will override audioState timecode when set */
    const [userInputWidthPercent, setUserInputWidthPercent] = useState<null | number>(null);
    const showProgressBar = playerActive && !Number.isNaN(audioState.timeCode) && !Number.isNaN(audioState.duration);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const userInputStale = useRef(false); // only set to true once user has finished dragging
    const ignoreMouseDown = useRef(false); // if user did not initiate mouse down in the scrobble container, ignore movement
    useEffect(() => {
        if (userInputStale.current) {
            // remove user input (new audio data detected)
            setUserInputWidthPercent(null);
            userInputStale.current = false;
        }
    }, [audioState?.timeCode]);

    const songProgressPercent =
        userInputWidthPercent !== null ? userInputWidthPercent : audioState.timeCode / audioState.duration;

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
                '--song-progress': `${songProgressPercent * 100}%`,
            }}
        >
            <div className={clsx(css['card-header-container'], css['card-header-container--song-variant'])}>
                {playerActive ? (
                    audioState.status === 'paused' ? (
                        <PlayIcon height={12} width={12} />
                    ) : (
                        <PauseIcon height={12} width={12} />
                    )
                ) : (
                    <div className={css['card-header-dot']} />
                )}

                <div className={css['time-container']}>
                    <span className={css['card-header-relative-time-text']}>
                        {playerActive ? (audioState.status === 'paused' ? 'Paused' : 'Playing') : 'Tap/Click to Play'}
                    </span>
                    {playerActive && (
                        <span className={css['card-header-absolute-time-text']}>
                            {' '}
                            {secondsToReadableString(audioState.duration * songProgressPercent)} /{' '}
                            {secondsToReadableString(audioState.duration)}
                        </span>
                    )}
                </div>
                {playerActive && <WaveTable color="white" />}
            </div>
            {showProgressBar ? (
                // eslint-disable-next-line jsx-a11y/control-has-associated-label
                <div
                    role="slider"
                    aria-valuenow={songProgressPercent}
                    className={css['song-scrobble-clickable-area']}
                    onTouchMove={(ev) => {
                        setUserInputWidthPercent(getPercentScrolled(ev.touches[0]!.clientX));
                    }}
                    onTouchEndCapture={() => {
                        // the `ev` passed in here doesn't seem to have positional info, so we just use the last touch position instead
                        if (userInputWidthPercent === null) return;
                        userInputStale.current = true;
                        setSongProgress(userInputWidthPercent);
                    }}
                    onClick={(ev) => {
                        ev.preventDefault();
                    }}
                    onMouseEnter={(ev) => {
                        if (ev.buttons === 1) ignoreMouseDown.current = true; // drag from outer container should be ignored
                    }}
                    onMouseDown={(ev) => {
                        setUserInputWidthPercent(getPercentScrolled(ev.clientX));
                    }}
                    onMouseUp={(ev) => {
                        if (!ignoreMouseDown.current) {
                            userInputStale.current = true;
                            setSongProgress(getPercentScrolled(ev.clientX));
                        }
                        ignoreMouseDown.current = false;
                    }}
                    onMouseMove={(ev) => {
                        if (ignoreMouseDown.current) return;
                        if (ev.buttons === 1) setUserInputWidthPercent(getPercentScrolled(ev.clientX));
                    }}
                    onMouseLeave={(ev) => {
                        if (ev.buttons === 1 && !ignoreMouseDown.current) {
                            userInputStale.current = true;
                            setSongProgress(getPercentScrolled(ev.clientX));
                        }
                        ignoreMouseDown.current = false;
                    }}
                    ref={progressBarRef}
                >
                    <div className={css['song-scrobble']}>
                        <div className={css['song-scrobble-filled']}>
                            <div className={css['song-scrobble-button']} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className={css['song-scrobble-clickable-area']}>
                    <div className={css['song-scrobble']} />
                </div>
            )}
        </div>
    );
}

export default MikuCardHeader;
