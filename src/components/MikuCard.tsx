import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import clsx from 'clsx';
import { IMikuCardData } from '../types/locationTypes';
import { useDrawerAPIContext } from '../contexts/DrawerAPIContext';
import MikuCardHeader from './MikuCardHeader';
import MikuCardContent from './MikuCardContent';
import css from './EateryCard.module.css';
import { useAudioContext } from '../contexts/AudioContext';

function MikuCard({ songData, animate = false }: { songData: IMikuCardData; animate?: boolean }) {
    const drawerAPIContext = useDrawerAPIContext();
    const { audioState, ...audioControls } = useAudioContext();
    const prevDrawerSelectedIdRef = useRef<string | null>(null);
    const playerId = songData.songUrl;
    useEffect(() => {
        prevDrawerSelectedIdRef.current = drawerAPIContext.selectedId ?? null;
    }, [drawerAPIContext.selectedId]);
    const shouldAnimatePositionChange = drawerAPIContext.selectedId === prevDrawerSelectedIdRef.current;

    return (
        <motion.div
            layout
            className={clsx(css.card, css['card-in-main-grid'])}
            initial={
                animate
                    ? {
                          opacity: 0,
                          transform: 'translate(-10px,0)',
                          filter: 'blur(3px)',
                          transition: { duration: 0.7, ease: [0.08, 0.67, 0.64, 1.01] },
                      }
                    : false
            }
            animate={{
                transform: 'translate(0,0)',
                opacity: 1,
                filter: 'blur(0)',
            }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={
                shouldAnimatePositionChange
                    ? undefined // default transition animation
                    : {
                          layout: {
                              type: false,
                          },
                      }
            }
            // whole card clickable
            role="button"
            onClick={(ev) => {
                if (ev.defaultPrevented) return;
                if (audioState?.playerId !== playerId) {
                    audioControls.initSong(songData.songUrl, playerId);
                } else {
                    if (audioState.status === 'playing') {
                        audioControls.pauseSong(playerId);
                    }
                    if (audioState.status === 'paused') {
                        audioControls.playSong(playerId);
                    }
                }

                ev.preventDefault();
            }}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    if (audioState?.playerId !== playerId) {
                        audioControls.initSong(songData.songUrl, playerId);
                    } else {
                        if (audioState.status === 'playing') {
                            audioControls.pauseSong(playerId);
                        }
                        if (audioState.status === 'paused') {
                            audioControls.playSong(playerId);
                        }
                    }
                    event.preventDefault();
                }
            }}
            tabIndex={0}
        >
            <MikuCardHeader
                songData={songData}
                playerActive={playerId === audioState?.playerId}
                setSongProgress={(percent) => {
                    audioControls.setSongProgress(playerId, percent);
                }}
            />
            <MikuCardContent
                songData={songData}
                playing={audioState?.playerId === playerId && audioState.status === 'playing'}
            />
        </motion.div>
    );
}

export default MikuCard;
