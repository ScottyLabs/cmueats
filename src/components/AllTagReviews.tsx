import { MethodResponse } from 'openapi-react-query';
import clsx from 'clsx';
import { DateTime } from 'luxon';
import { $api } from '../api';
import css from './AllTagReviews.module.css';
import LikeIcon from '../assets/control_buttons/like.svg?react';
import DislikeIcon from '../assets/control_buttons/dislike.svg?react';
import { useCurrentTime } from '../contexts/NowContext';
import DropdownArrow from '../assets/control_button/dropdown_arrow.svg?react';

type ReviewType = MethodResponse<typeof $api, 'get', '/v2/locations/{locationId}/reviews/tags'>[0];
function Review({ review }: { review: ReviewType }) {
    useCurrentTime(); // the relative time may need updating every second
    const date = DateTime.fromMillis(review.updatedAt);
    const tagColor = review.vote ? `var(--green-500)` : 'var(--red-500)';
    return (
        <div className={css.review}>
            <div className={css.review__heading}>
                {review.vote ? (
                    <LikeIcon className={clsx(css['review__heading__vote-icon'])} style={{ color: tagColor }} />
                ) : (
                    <DislikeIcon className={clsx(css['review__heading__vote-icon'])} style={{ color: tagColor }} />
                )}
                <div className={css['review__heading__tag-name']} style={{ color: tagColor }}>
                    {review.tagName}
                </div>
                <div className={css['review__heading__date-relative']}>{date.toRelative()}</div>
            </div>
            <div className={css.review__text}>{review.writtenReview}</div>
        </div>
    );
}
export default function AllTagReviews({ locationId, goBack }: { locationId: string; goBack: () => void }) {
    const { data: allReviews, error } = $api.useQuery('get', '/v2/locations/{locationId}/reviews/tags', {
        params: { path: { locationId } },
    });
    return (
        <section>
            <div className={css['tag-review-header']}>
                <button className={css['tag-review-header__back']} onClick={goBack}>
                    <DropdownArrow />
                    Back
                </button>
            </div>
            {error ? (
                <div className={css['status-text']}>Failed to load!</div>
            ) : allReviews === undefined ? (
                <div className={css['status-text']}>Loading...</div>
            ) : allReviews.length === 0 ? (
                <div className={css['status-text']}>No reviews yet!</div>
            ) : (
                allReviews.map((review) => <Review review={review} key={review.id} />)
            )}
        </section>
    );
}
