import { IMikuCardData } from '../types/locationTypes';
import css from './EateryCardContent.module.css';
import MusicIcon from '../assets/control_buttons/music.svg?react';

function MikuCardContent({ songData, playing }: { songData: IMikuCardData; playing: boolean }) {
    return (
        <div className={css['card-content-container']}>
            <h3 className={css['location-name-text']} style={{ background: playing ? 'var(--black-1000)' : '' }}>
                <span>{songData.title}</span>
            </h3>

            <span className={css['physical-location-text']}>
                <MusicIcon height={13} width={13} />
                <span>{songData.artist}</span>
            </span>

            <img
                src={songData.image}
                alt={`${songData.title} thumbnail`}
                className={css['card-content__song-image']}
                draggable={false}
                style={{ opacity: playing ? 1 : undefined }}
            />
        </div>
    );
}

export default MikuCardContent;
