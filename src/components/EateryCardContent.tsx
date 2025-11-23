import { MapPin, Pin, Eye, EyeOff } from 'lucide-react';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import { CardViewPreference } from '../util/storage';
import css from './EateryCardContent.module.css';

function EateryCardContent({
    location,
    updateViewPreference,
    partOfMainGrid,
}: {
    location: IReadOnlyLocation_Combined;
    updateViewPreference: (newViewPreference: CardViewPreference) => void;
    partOfMainGrid: boolean;
}) {
    const { location: physicalLocation, name, cardViewPreference } = location;
    const isPinned = cardViewPreference === 'pinned';
    const isHidden = cardViewPreference === 'hidden';

    return (
        <div className={css['card-content-container']}>
            <h3 className={css['location-name-text']}>{name}</h3>

            <span className={css['physical-location-text']}>
                <MapPin size={12} />
                {physicalLocation}
            </span>

            {partOfMainGrid && (
                <div className={css['action-bar']}>
                    <div className={css.rating}>rating placeholder</div>

                    <div className={css['button-container']}>
                        <button
                            type="button"
                            className={css['action-button']}
                            aria-label={isPinned ? 'Unpin Card' : 'Pin Card'}
                            onClick={(event) => {
                                event.stopPropagation();
                                updateViewPreference(isPinned ? 'normal' : 'pinned');
                            }}
                        >
                            {isPinned ? (
                                <Pin style={{ fill: 'yellow', stroke: 'yellow' }} size={20} />
                            ) : (
                                <Pin size={20} />
                            )}
                        </button>

                        <button
                            type="button"
                            className={css['action-button']}
                            aria-label={isHidden ? 'Show Card' : 'Hide Card'}
                            onClick={(event) => {
                                event.stopPropagation();
                                updateViewPreference(isHidden ? 'normal' : 'hidden');
                            }}
                        >
                            {isHidden ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EateryCardContent;
