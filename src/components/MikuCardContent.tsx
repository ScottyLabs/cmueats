import { MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { IMikuCardData } from '../types/locationTypes';
import css from './EateryCardContent.module.css';

function MikuCardContent({
    songData,
    playing,
    playerActive,
}: {
    songData: IMikuCardData;
    playing: boolean;
    playerActive: boolean;
}) {
    return (
        <div className={css['card-content-container']}>
            <h3 className={css['location-name-text']} style={{ background: playing ? '#23272a' : '' }}>
                <span>{songData.title}</span>
            </h3>

            <span className={css['physical-location-text']}>
                <MapPin size={12} />
                {songData.artist}
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
