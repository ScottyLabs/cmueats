import { useEffect, useMemo, useRef, useState } from 'react';
import { EyeOff, MapPin, MoreHorizontal, Pin, Star } from 'lucide-react';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import './EateryCardContent.css';

const STAR_SLOTS = [0, 1, 2, 3, 4] as const;

function buildFallbackRating(conceptId: number) {
    const base = 2.6 + ((conceptId * 23) % 20) / 10;
    return Number(base.toFixed(1));
}

function buildFallbackReviewCount(conceptId: number) {
    return 18 + ((conceptId * 17) % 40);
}

type EateryCardContentProps = {
    location: IReadOnlyLocation_Combined;
    isPinned: boolean;
    onTogglePin: () => void;
    isHidden: boolean;
    onToggleHide: () => void;
};

function EateryCardContent({ location, isPinned, onTogglePin, isHidden, onToggleHide }: EateryCardContentProps) {
    const { location: physicalLocation, name, url, conceptId } = location;

    const ratingValue = useMemo(() => buildFallbackRating(conceptId), [conceptId]);
    const ratingCount = useMemo(() => buildFallbackReviewCount(conceptId), [conceptId]);
    const filledStars = Math.round(ratingValue);
    const displayName = useMemo(() => name.split(' - ')[0], [name]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isMenuOpen) {
            return undefined;
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isMenuOpen]);

    const moreButtonIcon = useMemo(() => {
        if (isHidden) {
            return <EyeOff size={20} aria-hidden />;
        }
        if (isPinned) {
            return <Pin size={20} aria-hidden />;
        }
        return <MoreHorizontal size={20} aria-hidden />;
    }, [isHidden, isPinned]);

    return (
        <div className="card-body">
            <div className="card-body__content">
                <h3 className="card-body__title">
                    <a className="card-body__title-link" href={url} onClick={(event) => event.stopPropagation()}>
                        {displayName}
                    </a>
                </h3>

                <div className="card-body__location" title={physicalLocation}>
                    <MapPin size={16} strokeWidth={2} />
                    <span>{physicalLocation}</span>
                </div>
            </div>

            <div className="card-body__footer">
                <div className="card-body__rating" aria-label={`Rated ${ratingValue} out of five`}>
                    <span className="card-body__rating-score">{ratingValue.toFixed(1)}</span>
                    <span className="card-body__stars">
                        {STAR_SLOTS.map((slot) => (
                            <Star
                                key={slot}
                                size={16}
                                className={`card-body__star ${slot < filledStars ? 'card-body__star--filled' : ''}`}
                            />
                        ))}
                    </span>
                    <span className="card-body__rating-count">({ratingCount})</span>
                </div>

                <div className="card-body__more-wrapper" ref={menuRef}>
                    <button
                        type="button"
                        className="card-body__more"
                        onClick={(event) => {
                            event.stopPropagation();
                            setIsMenuOpen((prev) => !prev);
                        }}
                        aria-haspopup="true"
                        aria-expanded={isMenuOpen}
                        aria-label={`More actions for ${displayName}`}
                    >
                        {moreButtonIcon}
                    </button>
                    {isMenuOpen && (
                        <div className="card-body__menu" role="menu">
                            <button
                                type="button"
                                role="menuitem"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setIsMenuOpen(false);
                                    onTogglePin();
                                }}
                            >
                                {isPinned ? 'Unpin card' : 'Pin card'}
                            </button>
                            <button
                                type="button"
                                role="menuitem"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setIsMenuOpen(false);
                                    onToggleHide();
                                }}
                            >
                                {isHidden ? 'Show card' : 'Hide card'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EateryCardContent;
