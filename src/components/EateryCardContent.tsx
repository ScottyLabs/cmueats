import { MapPin } from 'lucide-react';
import UnpinnedControlIcon from '../assets/control_buttons/unpinned.svg?react';
import PinnedControlIcon from '../assets/control_buttons/pinned.svg?react';
import EyeControlIcon from '../assets/control_buttons/eye.svg?react';
import EyeOffControlIcon from '../assets/control_buttons/eyeOff.svg?react';
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
                                <PinnedControlIcon className={css['action-icon']} />
                            ) : (
                                <UnpinnedControlIcon className={css['action-icon']} />
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
                            {isHidden ? (
                                <EyeOffControlIcon className={css['action-icon']} />
                            ) : (
                                <EyeControlIcon className={css['action-icon']} />
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EateryCardContent;
