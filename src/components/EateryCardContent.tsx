import { useContext, useMemo } from 'react';
import { MapPin, Star } from 'lucide-react';
import { DrawerContext } from '../pages/ListPage';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';
import './EateryCardContent.css';

function buildFallbackRating(conceptId: number) {
    const base = 2.6 + (((conceptId * 23) % 20) / 10);
    return Number(base.toFixed(1));
}

function buildFallbackReviewCount(conceptId: number) {
    return 18 + ((conceptId * 17) % 40);
}

function EateryCardContent({ location }: { location: IReadOnlyLocation_Combined }) {
    const drawerContext = useContext(DrawerContext);
    const {
        location: physicalLocation,
        name,
        url,
        shortDescription,
        conceptId,
    } = location;

    const ratingValue = useMemo(() => buildFallbackRating(conceptId), [conceptId]);
    const ratingCount = useMemo(() => buildFallbackReviewCount(conceptId), [conceptId]);
    const filledStars = Math.round(ratingValue);

    return (
        <div className="card-body">
            <div className="card-body__content">
                <h3 className="card-body__title">
                    <a
                        className="card-body__title-link"
                        href={url}
                        onClick={(event) => event.stopPropagation()}
                    >
                        {name}
                    </a>
                </h3>

                <div className="card-body__location" title={physicalLocation}>
                    <MapPin size={16} strokeWidth={2} />
                    <span>{physicalLocation}</span>
                </div>

                {shortDescription && <p className="card-body__description">{shortDescription}</p>}
            </div>

            <div className="card-body__footer">
                <div className="card-body__rating" aria-label={`Rated ${ratingValue} out of five`}>
                    <span className="card-body__rating-score">{ratingValue.toFixed(1)}</span>
                    <span className="card-body__stars">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                                key={index}
                                size={16}
                                className={`card-body__star ${index < filledStars ? 'card-body__star--filled' : ''}`}
                            />
                        ))}
                    </span>
                    <span className="card-body__rating-count">({ratingCount})</span>
                </div>

                <button
                    type="button"
                    className="card-body__details"
                    onClick={(event) => {
                        event.stopPropagation();
                        drawerContext.setIsDrawerActive(!drawerContext.isDrawerActive);
                        drawerContext.setDrawerLocation(location);
                    }}
                >
                    View details
                </button>
            </div>
        </div>
    );
}

export default EateryCardContent;
